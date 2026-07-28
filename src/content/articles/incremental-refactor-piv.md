---
title: "渐进式重构-双层计划与PIV"
summary: "大重构用双层计划 + 小 slice 的 PIV，一 slice 一提交，别把总纲一次丢给 Agent。"
group: playbook
order: 6
tags:
  - "Playbook"
publishedAt: 2026-06-07
status: active
featured: true
---

# 03 · 渐进式重构：双层计划 + PIV 循环 / Incremental Refactor: Layered Plan + PIV Loop

## 现状陈述

大型重构走"双层计划 + 逐 slice 的 PIV 循环 + 活文档"，不把整份总纲丢给 agent 一次实现。Layer-1 是问题地图（写一次、允许修订、含优先级阶段）：**只列阶段与范围，绝不写文件级改法 / Verify / build 单元**——顶层提前写死细节，等动手时必与真实代码对不上而返工。Layer-2 只为"下一个阶段"展开：**先详细调研该段代码**，再产出 5-9 个可执行 slice，每个 slice 带 `Files / Changes / Verify / Done-when` 四件套。每个 slice 进 fresh context 跑 Plan→Implement→Validate，一 slice 一原子提交，过结构性 parity 才合。验收方式在写码前定义。决策与踩坑实时追加进活文档。

## 命名与层级合同

多轮重构不能共用裸 `S1/S2` 语义。每一轮 Layer-1 总纲先声明**计划族前缀**，该总纲内部再从 `S1` 开始编号；后续新总纲不能续旧总纲的 `S6`，也不能换成无上下文的 `A/B/C/D`。

```text
<计划族>-S<n>       Layer-1 阶段,一个 todo = 一个 Layer-2 plan
<计划族>-S<n>-<m>   Layer-1 问题条目,只描述问题和证据
<计划族>-S<n>-A     Layer-2 slice,进入该阶段后调研代码再切
```

| 对象 | 示例 | 规则 |
|---|---|---|
| 计划族 | `SYS` / `E2E` / `OBS` | 2-5 个大写字母或短词,表示一轮总纲的命名空间 |
| Layer-1 文件 | `e2e_debug_closure_index_*.plan.md` | 文件名体现计划族和总纲性质,不要伪装成二级 slice |
| Layer-1 todo | `E2E-S1` | 只写阶段范围和对应二级 plan 文件名,不写 files/verify |
| 问题条目 | `E2E-S1-1` | 归属于某个一级阶段,可以有 evidence / impact / hypotheses |
| Layer-2 文件 | `e2e_s1_state_api_contract_*.plan.md` | 只展开一个 `E2E-S1`,包含 5-9 个 slice |
| Layer-2 slice | `E2E-S1-A` | 带 `Files / Changes / Verify / Done-when`,可独立提交 |

Layer-1 frontmatter 的 `todos` 必须是阶段,不是问题清单。问题清单放正文索引表。否则 agent 会把“问题地图”误当成“可 build 的任务列表”。

## 反模式 vs 正例

| 维度 | 反模式 | 正例 |
|---|---|---|
| 计划粒度 | 把整份总纲丢给 agent "照着实现" | 总纲当地图，只把下一 slice 当路线交付 |
| 层级边界 | 顶层文档就写死文件级改法 / Verify / build 单元 | 顶层只列阶段+问题地图，细节进各阶段 Layer-2 |
| 总纲续号 | 新一轮 debug 总纲接着上一轮写 `S6` | 新总纲声明计划族,从 `E2E-S1` 开始 |
| 编号体系 | 第一轮用 `S1`,第二轮改成 `A/B/C/D` | 所有总纲都用 `<计划族>-S<n>`;只换计划族前缀 |
| todo 语义 | Layer-1 todo 列 8 个 bug | Layer-1 todo 列 2-5 个阶段,每个阶段指向一个 Layer-2 plan |
| Layer-2 时机 | 不调研代码直接写操作步骤 | 进入阶段先详细调研代码，再写可操作 plan |
| 上下文 | 一个长 session 连做多阶段 | 每 slice fresh context，做完即弃 |
| Layer-2 来源 | 从纯抽象总纲直接展开 | 必须 carryover 上一阶段实测 facts（文件/端点/命名） |
| 验收时机 | 写完代码再想怎么验 | 写码前先定 `Verify`（命令 / 用例 id / parity 条目） |
| slice 体量 | 跨 >6 文件 / >500 行 / 多关注点 | 一 slice 一关注点，fresh session 装得下 |
| 失败处理 | 在脏 context 里硬修第 4 次 | 连失败 3 次 → revert + 重拆 slice |
| 提交 | 一个大 commit 混多个改动 | 一 slice 一原子提交，可独立回滚 |
| 旧路径 | 直接删旧实现换新 | 旧路径留兜底，新抽象灰度替换，parity 稳定再撤旧 |
| 兼容策略 | 多套兼容层并存 | 单一事实源直接替换 |
| 决策留痕 | 只在脑子里 / 聊天里 | 活文档 Critical Decision 段（supersede / rationale / 触发数据） |
| 注释 | 留历史变更、版本签名、"曾经这样" | 只讲当前意图；面向 LLM 的 schema/描述不出现版本号 |

## 第一性原理

| 维度 | 分析 | 结论 |
|---|---|---|
| 上下文预算 | 单 session 有效注意力随长度衰减且被污染 | 一 slice 一 fresh context，做完即弃 |
| 可逆性 | 脏 context 原地硬修的期望代价高于 revert 重来 | 回退优先于原地修 |
| 故障域 | 大 commit 把多关注点耦合，回滚必伤无辜 | 原子提交把故障域钉到单关注点 |
| 命名空间 | 裸 `S1/S2` 只有当前文档内有意义，跨总纲会撞号 | 计划族前缀把阶段编号限定在一轮总纲内 |
| 数据正确性 | 总纲假设常被真实运行数据证伪 | 验收用真实数据；证伪即改总纲并留痕 |
| 信噪比 | 无真实接线 facts 的 Layer-2 必返工 | Layer-2 强制携带上一阶段实测事实 |
| 责任归属 | 旧路径删早了则回归无兜底 | 新旧并存到 parity 稳定，再撤旧 |

## 触发"先停后想"的信号

1. 同一 slice agent 连续失败 3 次
2. 一个 slice 涉及 >6 文件或 >500 行变更
3. agent 开始建议越过既定边界（例如把稳定且已调好的领域逻辑重写）
4. parity 持续不过 —— 反问"是不是 slice 划分错了 / 漏了不变量"，而不是降低 parity 标准
5. 真实运行暴露总纲未记录的"隐藏不变量"
6. 待执行的 Layer-2 是从纯抽象总纲展开的，没有上一阶段实测接线点
7. 新总纲开始沿用上一轮的裸阶段号，或 Layer-1 todo 变成 bug 列表

## 设计骨架

```text
Layer-1 总纲 (计划族前缀 + 问题地图 + 优先级阶段; 写一次, 可修订)
  ├─ todo := <计划族>-S<n>              # 一个 todo = 一个 Layer-2 plan
  ├─ issue := <计划族>-S<n>-<m>         # 问题证据,不直接 build
  └─ 只为"下一个阶段"展开 Layer-2
       slice := <计划族>-S<n>-A { Files, Changes, Verify, Done-when }  # 5-9 个 / 阶段
         └─ fresh session 跑 PIV:
              Plan      : 只出计划 + 风险 + 测试, 不写码, 人工 approve
              Implement : 小步多次, 每组相关文件停下 review
              Validate  : 写码前定义的 Verify 必过; 结构性 parity exact
              Commit    : 一 slice 一原子提交

阶段收尾:
  跑全阶段用例 + 回滚演练
  真实数据证伪总纲假设 → 改 Layer-1 + 活文档记 Critical Decision

贯穿不变量:
  验收先于编码          # feature 级 TDD
  绿色基线先于动手      # 改前先有一份全绿测试快照作 parity 锚
  旧路径兜底到 parity 稳定
  单一事实源替换 > 多套兼容
  Fail fast / Fail loud # 边界处崩响, 不静默兜空值
```

## 适用边界

- 适用：跨多模块 / 前后端并行、零回归要求高、含不可重写的稳定 IP、AI 协作易埋雷的重构
- 退化：小于 ~3 文件的局部改动直接做，不必双层
- Strangler / shadow-write 仅当"有旧系统需迁移"时启用；无迁移目标时退化为 branch-by-abstraction（新抽象 + 旧兜底并存，灰度切换）
- 与 TDD 关系：Verify-before-code 是 feature 级验收先行，不强求单测全覆盖，但每 slice 必须有可机器执行的验收

## 自检清单

- [ ] 总纲是"地图"还是被当成"一次实现的任务书"？后者 → 拆 slice
- [ ] 新总纲是否声明了计划族前缀？编号是否从 `<计划族>-S1` 开始？
- [ ] Layer-1 todo 是否都是阶段,且每个 todo 指向一个待创建 / 已创建的 Layer-2 plan？
- [ ] 问题条目是否用 `<计划族>-S<n>-<m>` 归属到阶段,而不是占用 todo？
- [ ] 顶层文档是否出现了文件级改法 / Verify / build 单元？出现 → 下沉 Layer-2
- [ ] 该阶段 Layer-2 是否在详细调研代码之后才写？否 → 先调研
- [ ] 每个 slice 是否都有 `Files / Changes / Verify / Done-when` 四件套？
- [ ] `Verify` 是否在写码前定义、且可机器执行？
- [ ] 单 slice 是否 ≤6 文件 / 单关注点 / fresh session 装得下？
- [ ] 是否一 slice 一原子提交、可独立回滚？
- [ ] 动手前是否有一份全绿测试快照作 parity 锚？
- [ ] 旧路径是否保留到 parity 稳定再撤？
- [ ] 证伪总纲的真实数据是否已回写活文档并修订总纲？

## 反向链接

- 可观测命名空间：→ `./01-agent-observability-namespace.md`
- Secret 防御拦截层：→ `./02-secret-leakage-defense-layers.md`
