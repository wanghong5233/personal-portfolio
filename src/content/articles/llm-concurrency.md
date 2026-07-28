---
title: "LLM并发与容量治理"
summary: "并发不是经验常数；用准入、在途、速率和降级一起找吞吐、尾延迟、成本与质量的平衡。"
group: playbook
order: 8
tags:
  - "Playbook"
publishedAt: 2026-07-27
status: active
featured: true
---

# LLM 并发与容量治理

并发值不是模型属性，也不是可以跨任务复制的经验常量。它由到达速率、服务时间、单次 token、调用图、下游配额、部署拓扑和质量目标共同决定。正确目标不是“并行越多越快”，而是在稳定性约束下找到吞吐、尾延迟、成本和质量的平衡点。

## 判断原则

四种机制解决四种不同问题：

| 机制 | 控制什么 | 不解决什么 |
|---|---|---|
| 有界队列 / 任务准入 | 系统接收多少待处理工作 | 远端 RPM/TPM |
| 并发信号量 | 同时有多少请求在途 | 长期速率与 burst |
| Token bucket / rate limiter | 单位时间发送多少请求或 token | 本地内存与任务积压 |
| Load shedding / 降级 | 超载时保住核心能力 | 正常容量不足 |

这些机制不能互相替代。只有限流没有有界队列，会把过载变成长尾；只有 semaphore 没有速率整形，短请求仍可能形成 burst；只有重试没有重试预算，会把一次故障放大成持续过载。

Google SRE 将 overload 视为级联故障的常见根因，并建议有界排队、load shedding、deadline 与 retry budget。AWS Builders’ Library 强调超时、幂等、指数退避和 jitter。Netflix 的 adaptive concurrency 则用 Little 定律和延迟梯度识别排队开始的位置。三者共同指向同一结论：**容量治理必须同时控制准入、在途、速率和失败反馈。**

## 容量模型

Little 定律描述稳定系统中的平均关系：

`inflight = throughput × service_time`

它适合给出搜索起点，不直接给出生产配置。LLM 请求的 token 和时延通常长尾明显，平均值无法描述突发、p95/p99、provider 内部排队和重试放大。

至少计算三类上界：

- 请求配额：`RPM × 服务时间（分钟）`。
- token 配额：`TPM / 单次 token × 服务时间（分钟）`。
- 本地资源：连接池、CPU、内存、数据库、文件句柄和单任务占用。

候选搜索上界取三者最小值，再通过固定负载实验寻找膝点。若 provider 同时声明 RPS、TPS、并行请求数或 batch 限制，也必须一起纳入。

## 先画完整并发拓扑

并发通常不止一层：

1. 同时运行多少业务任务；
2. 单任务 DAG 同时启动多少步骤；
3. 每个步骤拆出多少 map/chunk；
4. 每个 profile 或模型允许多少在途；
5. 单实例有多少事件循环或线程池；
6. 集群有多少进程、实例和机器；
7. fallback、repair 和 retry 会额外产生多少调用。

局部看起来安全的上限会相乘。例如：任务并发 × 每任务首波扇出 × 实例数，可能远大于任一代码点的 semaphore。信号量还可能只绑定某个事件循环；同一进程创建多个 loop 时，也不能把它称为进程级上限。

容量键必须按真实共享边界聚合。任务 profile 可用于区分成本和优先级，但如果多个 profile 最终落到同一 provider、模型或凭证，它们仍共享同一配额。

## 固定并发还是自适应并发

### 固定并发适合

- 离线批处理，负载与模型相对稳定；
- provider 配额明确；
- 有固定基准集和周期性重标定；
- 需要简单、可解释、容易回滚。

### 自适应并发适合

- 请求大小或服务时间长期漂移；
- 多租户、自动扩缩容或下游容量经常变化；
- 能持续获得可靠的排队、RTT、超时和丢弃反馈；
- 系统允许围绕目标延迟动态增减在途。

自适应算法不是免标定。它仍需要初始值、最小/最大护栏、采样窗口、冷启动策略和失败回退。Netflix 的实现借鉴 TCP 拥塞控制，通过延迟梯度估计排队；如果指标混入本地等待、样本稀疏或请求成本差异巨大，算法同样会误判。

多数系统应先用固定并发建立可观测基线，再决定是否值得引入自适应控制。

## 标定流程

### 1. 固定负载与验收门

选择覆盖短、中、长输入及主要调用分支的固定样本。保持模型、prompt、输入策略、缓存、传输链路和部署拓扑不变。

性能实验必须同时保留质量门。若更高并发通过减少输入、触发降级或漏掉输出获得更短墙钟，这不是吞吐收益。

### 2. 建立调用画像

按任务、profile、模型和凭证统计：

- 输入/输出 token 的 p50、p95；
- `queue_wait`、provider time、端到端时延的 p50、p95；
- 单任务调用数、首波扇出、chunk 数；
- 429、timeout、fallback、repair、retry 和质量降级；
- CPU、内存、连接池、数据库池和队列深度。

排队时间必须与 provider time 分开。把二者合并，会把客户端限流误判成模型变慢，也无法判断增加并发究竟是在消除本地空槽还是制造远端排队。

### 3. 用公式确定探测区间

使用官方配额与真实调用画像计算 RPM/TPM 上界。上界只用于选择候选点，不直接作为运行值。候选点应覆盖“明显未填满”“接近估算容量”“略高于估算容量”三个区域。

### 4. 单变量、重复探测

先固定任务并发，标定单任务内部在途；再固定在途上限，标定任务准入。每个候选至少重复多轮，记录中位数与尾部，而不是挑最快一轮。

以下任一情况出现，说明已经越过膝点：

- 吞吐中位不再增长；
- p95/p99 或端到端尾延迟反升；
- queue/provider 比例持续扩大；
- 429、timeout、fallback 或 retry 增多；
- 资源池饱和、质量降级或单位成本上升。

取膝点前一个稳定值，并保留安全余量；不要取“最大一次成功值”。

### 5. 保存可复核决策

容量记录至少包含：

- 固定负载和环境指纹；
- 官方配额、Little 定律计算和候选区间；
- 每轮原始报告、吞吐、尾延迟、失败和质量；
- 污染实验及排除理由；
- 最终值、作用域、安全余量；
- 模型、prompt、输入、配额或部署改变后的重标定条件。

## 过载与重试

RFC 6585 定义 429，并允许服务端用 `Retry-After` 告知等待时间。客户端应优先遵守明确的服务端提示；没有提示时再使用有上限的指数退避与 jitter。

重试只适用于瞬态、可重试且幂等的操作。每层 SDK、网关和应用各自重试，会形成乘法放大。成熟实现需要：

- 只在一个明确层负责主要重试；
- 关闭或计入 SDK 隐式重试；
- 设置每请求与全局 retry budget；
- 使用幂等键避免重复副作用；
- 把 retry 计入 RPM/TPM 与成本；
- 超过 deadline 或预算后尽早失败，不继续排队。

离线任务可以延后重试；交互请求通常应更早 load shed。优先级不同的工作不要共享一个无差别队列。

## 工程经验

**单篇正常不等于批处理容量够用。** 离线批跑长文画像时，每篇先并行抽结构、实体、走势，再汇总；批侧还会同时跑多篇。历史上沿用一个“常见并发值”，单篇墙钟正常，批量一开却两头不讨好：并发太低时依赖阶段空槽，时间耗在本地 semaphore；并发太高时本地排队下降，吞吐却不再涨，尾延迟和失败反而上去。目标本来就是单位时间完成量，不是把单篇压到最短。

**先算搜索上界，再固定样本找膝点。** 用官方 RPM/TPM 和实测 token、provider 时延估出探测区间，固定同一组样本，单变量测几个递增候选。吞吐中位最高的那档不是排队最低的那档——再加一档只剩 queue wait 变好看，尾延迟已经反升。书级 worker 与 LLM 在途必须一起看；只调一边会误判空槽或过载。结论绑定当时模型、入料、传输和部署；原始轮次、污染实验和排除理由要留档，否则数字很快又变成 magic number。

## 禁止模式

- 从另一任务或模型复制并发值。
- 把功能探针的并发当作生产容量。
- 只看平均墙钟，不看吞吐、尾延迟、错误和质量。
- 只设置 profile semaphore，不核对共享模型和凭证。
- 多实例部署仍把单进程 semaphore 当作全局限流。
- 同时调大 worker、fan-out、retry 和连接池，导致无法归因。
- 队列无界，依靠“最终会处理完”掩盖过载。
- 看到 queue wait 下降就继续加并发。
- 只保留汇总表，不保存原始实验和排除理由。

## Agent 执行规则

遇到并发或容量任务时默认：

1. 画出任务、DAG、chunk、profile、loop、进程和实例的完整乘法关系。
2. 确认 provider/model/credential 的真实共享配额。
3. 分离 `queue_wait`、provider time 与 end-to-end。
4. 用官方配额和调用画像计算候选区间。
5. 单变量、重复探测，并同时检查质量和成本。
6. 选择膝点而非最大成功值，记录作用域与重标定条件。
7. 多实例前补共享限流、重试预算和 load shedding。

## 参考

- [Magic Number 治理](./magic-number-governance.md)：容量参数的语义、依据、作用域与重标定要求。
- [John D. C. Little, “A Proof for the Queuing Formula: L = λW”](https://doi.org/10.1287/opre.9.3.383)：Little 定律的一手论文与成立条件。
- [Google SRE: Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)：overload、队列管理、load shedding、deadline 与 retry budget。
- [AWS Builders’ Library: Timeouts, retries and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)：超时、重试放大、退避、jitter 与 token bucket。
- [AWS Builders’ Library: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)：幂等与安全重试。
- [Netflix concurrency-limits](https://github.com/Netflix/concurrency-limits)：Little 定律、延迟梯度与自适应并发。
- [RFC 6585 §4](https://datatracker.ietf.org/doc/html/rfc6585#section-4)：429 Too Many Requests 与 `Retry-After`。
