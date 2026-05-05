# Personal Portfolio Site PRD

> 个人职业门户站项目需求文档。
> 仓库定位：独立长期项目，与 Pulse / ScholarMind / Resona 等作品集项目平级。
> 文档目标：作为后续实施、内容维护、设计取舍和验收的长期事实源。

## 1. 项目定位

| 项 | 内容 |
|---|---|
| 项目名 | Personal Portfolio Site（暂定 `wh5233.me` 或 `me.wh5233.me`） |
| 产品角色 | 长期维护的个人职业主页：在线简历、作品集、技术文章索引、个人简介、当前状态与联系方式的统一入口 |
| 当前阶段 | 2027 届研究生求职期，重点服务 HR、面试官、内推人和自荐对象 |
| 长期阶段 | 入职后继续作为职业履历、项目复盘、技术写作、公开成果和联系方式的可信主页 |
| 核心问题 | PDF 简历一旦投递无法更新，个人网站需要成为长期可更新、可验证、可分享的在线真相源 |
| 不是 | 不是博客 CMS；不是简历生成器；不是动态后台系统；不是动画炫技站；不是社交媒体替代品 |
| 持有者 | 单作者维护，个人品牌资产 |
| 生命周期 | 2026 年 5 月起长期维护，覆盖 2027 届校招、实习、正式工作与后续职业发展 |
| 与 Pulse / ScholarMind / Resona 关系 | 展示访问入口、视频、截图、源码、架构文档与复盘文章；不嵌入其业务代码 |

成功状态：

- 已投递的 PDF 简历即使不再更新，HR / 面试官仍可通过固定二维码或短链访问最新在线简历。
- 访问者 30 秒内能判断候选人的方向、学历、求职状态、代表项目、技术栈和联系方式。
- 技术面试官 3 分钟内能看到项目证据链：职责、架构、难点、访问入口、代码、文档和复盘。
- 候选人本人新增项目、更新履历、追加文章索引时，只需要修改仓库内内容文件并 push。
- 站点风格可信、克制、有技术密度，有少量个人风格，但不牺牲阅读效率和专业感。

## 2. 产品原则

| 原则 | 说明 |
|---|---|
| 可信优先 | 所有展示都要能被证据支撑，避免空泛自夸和不可验证的“大词” |
| 内容即资产 | 简历、项目、文章、联系方式都以结构化内容维护，页面只是内容的呈现层 |
| 长期可演进 | 当前文案可以强调求职，但结构不能绑定“学生求职站”，后续应能自然切换到职业主页 |
| 静态优先 | 首版不依赖服务端动态能力，降低维护成本和故障面 |
| 克制表达 | 动效、音乐、视觉风格只作为辅助，不抢占首屏信息和简历阅读注意力 |
| 移动端优先 | 链接可能来自微信、飞书、PDF 二维码，移动端必须快速可读 |
| 更新闭环短 | 内容修改、检查、部署、验证链路必须简单，避免“想更新但嫌麻烦” |

## 3. 目标用户与典型路径

| 用户 | 场景 | 期望体验 | 关键路径 |
|---|---|---|---|
| HR / 招聘官 | 看到 PDF 简历后扫码或点击短链 | 秒开、首屏直达定位、能快速复制联系方式 | `/` → `/resume` → `/contact` |
| 技术面试官 | 已知候选人有项目，想快速判断技术深度 | 能看到架构、职责、代码、访问入口、复盘和设计取舍 | `/projects` → `/projects/<slug>` → GitHub / 访问入口 |
| 内推人 / 自荐对象 | 在微信或飞书收到链接 | 移动端可读，一屏内知道“这个人适合什么岗位” | `/` → 代表项目 → `/resume` |
| 未来合作方 / 同行 | 通过 GitHub、文章或搜索进入 | 能看到长期方向、公开项目和稳定联系方式 | `/about` → `/projects` → `/articles` |
| 候选人本人 | 高频更新简历、项目、文章、联系方式 | 改 Markdown / JSON 后自动上线，不重新分发 PDF | 本地改内容 → `npm run check` → push |

访问者的注意力预算：

| 时间 | 应完成的信息传达 |
|---|---|
| 10 秒 | 我是谁、当前身份、目标方向、当前状态、主入口 |
| 30 秒 | 代表项目、技术栈、学历背景、联系方式、在线简历入口 |
| 3 分钟 | 项目技术深度、个人职责、代码质量、文章与复盘 |
| 10 分钟 | 完整在线简历、项目架构、演示视频、GitHub 仓库、技术文章 |

## 4. 真相源与内容治理

### 4.1 在线简历是真相源

`/resume` 是最新简历的唯一真相源。PDF 简历只作为投递附件和入口载体，不承担长期更新职责。

| 内容 | 真相源 | 更新方式 |
|---|---|---|
| 最新履历正文 | `src/content/resume.mdx` | 修改 MDX 后 push |
| PDF 简历 | 从 `/resume` 浏览器打印生成，或手动导出到 `public/files/resume.pdf` | 仅在批量投递前重新导出 |
| 已投递 PDF 上的入口 | 固定二维码 / 短链，指向 `/resume` | 链接保持不变 |
| 首页定位与当前状态 | `src/data/site.json` + `src/content/home.mdx` | 修改结构化字段和首页文案 |
| 当前动态 | `src/content/now.mdx` 或 `src/data/now.json` | 低频更新当前阶段、方向和近期重点 |
| 项目详情 | `src/content/projects/*.mdx` | 新增或修改项目文件 |
| 文章索引 | `src/content/articles/*.json` 或 Content Collection | 只维护标题、摘要、标签、外链 |
| 联系方式 | `src/data/contact.json` | 全站统一读取 |

### 4.2 固定链接策略

- PDF 简历、二维码、GitHub Profile、飞书签名、邮件签名统一指向固定域名。
- 固定入口优先使用 `/resume`，首页保留醒目的简历入口。
- 项目详情 URL 一旦公开，不随意改 slug；项目改名时保留重定向或别名。
- 外链可失效，站内链接不应失效。

### 4.3 内容状态

| 状态 | 含义 | 展示策略 |
|---|---|---|
| `featured` | 当前最想展示的代表内容 | 首页和作品集前排展示 |
| `active` | 正在维护或仍有展示价值 | 正常展示 |
| `draft` | 内容未完成 | 默认不公开 |
| `archived` | 历史项目或旧文章 | 可展示但弱化权重 |
| `broken` | 外链失效或访问入口不可用 | 显示不可用标记，不让访问者误点 |

### 4.4 内容更新节奏

| 场景 | 建议频率 | 检查项 |
|---|---|---|
| 批量投递前 | 每次投递前 | 在线简历、PDF、二维码、联系方式、代表项目 |
| 项目阶段完成 | 每个里程碑后 | 截图、访问入口、架构图、职责、复盘、设计取舍 |
| 技术文章发布 | 发布当天 | 标题、摘要、标签、链接、发布时间 |
| 求职状态变化 | 状态变化当天 | 首页、`/now`、简历开头、联系方式 |
| 长期维护 | 每月一次 | 失效链接、项目状态、简历更新时间、域名和部署状态 |

## 5. 范围

### 5.1 In Scope（必须做）

- 首页 / 关于 / 作品集索引 / 作品集详情 / 文章索引 / 在线简历 / 联系方式；首页必须展示当前状态，独立 `/now` 页面作为 P1 增强。
- 静态站点，全部核心内容来自仓库内 Markdown / MDX / JSON。
- 移动端与桌面端响应式适配。
- 在线简历支持浏览器“打印为 PDF”导出。
- 飞书或外部平台技术文章以外链形式接入，仓库内只维护标题、摘要、标签、链接。
- Pulse / ScholarMind / Resona 等项目的访问入口、演示视频、截图、架构图、源码链接与复盘接入本站。
- 固定二维码和短链入口，保证已投递 PDF 仍能访问最新内容。
- OpenGraph / Twitter Card / 微信分享卡片基础信息。
- 轻量暗色模式或跟随系统主题。
- 可访问性基础支持：键盘可达、focus 样式、图片 alt、颜色对比度。

### 5.2 P1 / P2 增强

| 优先级 | 能力 | 边界 |
|---|---|---|
| P1 | `/now` 当前状态页 | 简短展示当前阶段、方向、近期重点，不写成日记 |
| P1 | Proof of Work 区域 | 聚合访问入口、截图、架构图、关键文档和文章 |
| P1 | 项目标签筛选 | 只做客户端轻量筛选，不引入复杂搜索系统 |
| P1 | 文章标签筛选 | 文章正文仍放外部平台 |
| P1 | 下载 PDF 简历 | PDF 文件由人工导出后放入 `public/files/` |
| P2 | 背景音乐 | 默认关闭、点击后加载、移动端不进入首屏关键路径 |
| P2 | 轻量动效 | 只做 hover、淡入、锚点滚动等服务信息层级的动效 |
| P2 | 英文简版 | 只维护关键页面，不做完整复杂 i18n |

### 5.3 Out of Scope（明确不做）

- 不做评论系统。
- 不做用户登录 / 个人后台。
- 不做技术博客内容编辑器，博客正文继续走飞书或外部平台。
- 不做自动播放背景音乐。
- 不做服务端动态接口。
- 不做复杂 i18n 多语言，首版只维护中文，必要时再加英文简版。
- 不接入重型数据分析 SDK；最多用 Vercel Analytics / Cloudflare Web Analytics。
- 不做在线表单后端；联系入口优先用邮箱和 GitHub，微信二维码、飞书主页在准备好后再展示。
- 不在站点上展示真实手机号。
- 不在站点上展示薪资期望。
- 不写“求一份机会”这类弱势文案；统一使用“正在寻找 X 方向岗位”。

## 6. 信息架构

```text
/                         首页：定位、当前状态、代表项目、简历入口、联系方式
/now                      当前状态：当前阶段、求职/研究方向、近期重点、更新时间
/about                    关于：教育、技能、竞赛/实习、自我介绍
/projects                 作品集索引：项目卡片、标签筛选、成熟度
/projects/scholarmind     ScholarMind 详情：职责、架构、访问入口、视频、GitHub、复盘
/projects/pulse           Pulse 详情
/projects/resona          Resona 详情
/articles                 技术文章索引：飞书外链、摘要、标签、发布时间
/resume                   在线简历：最新履历，可打印为 PDF
/contact                  联系方式聚合：邮箱、GitHub；微信二维码、飞书主页按需接入
```

每页结构不变式：

| 区域 | 内容 |
|---|---|
| 顶部导航 | 站点 Logo + 主导航 + 简历入口 |
| 首屏 | 1 句话定位 + 当前状态 + 主 CTA（看作品集 / 看简历 / 联系我） |
| 主体 | 单列（移动端）/ 最多两列（桌面端） |
| 证据入口 | 代表项目、访问入口、GitHub、文章、简历至少出现一个明确入口 |
| 页脚 | 邮箱、GitHub、最后更新时间；微信二维码和飞书主页按需展示 |

## 7. 页面需求

### 7.1 首页 `/`

首页目标是让陌生访问者快速建立第一印象，并把不同访问者分流到正确页面。

| 优先级 | 需求 |
|---|---|
| P0 | 展示姓名、当前身份、目标岗位方向、当前求职状态或职业状态 |
| P0 | 首屏文案用一句话说明“我擅长什么、正在寻找什么、能交付什么” |
| P0 | 展示 3 个代表项目卡片，首批至少包含 Pulse、ScholarMind 和 Resona |
| P0 | 展示核心技术标签，如 全栈 / RAG / Agent / 系统设计 / 工程化 |
| P0 | 提供“查看在线简历”“查看作品集”“联系我”三个主入口 |
| P1 | 提供“给 HR 看”和“给面试官看”的快速入口 |
| P1 | 展示最近更新：新项目、新文章、简历更新时间或当前状态更新时间 |
| P1 | 展示 Proof of Work 条带：访问入口、GitHub、文章、架构图、视频 |
| P2 | 背景音乐入口，仅允许用户主动点击播放，默认关闭、默认静音 |

首页首屏推荐信息顺序：

```text
姓名 + 当前身份
一句话定位
目标方向 / 当前状态
主 CTA：在线简历 / 作品集 / 联系我
代表项目与技术标签
```

### 7.2 当前状态 `/now`

`/now` 用于降低首页频繁改文案的成本，也让长期职业主页不只绑定求职阶段。

| 优先级 | 需求 |
|---|---|
| P1 | 展示当前阶段，如“2027 届研究生，正在寻找 AI 应用 / 全栈 / Agent 工程方向岗位” |
| P1 | 展示近期重点：正在完善的项目、正在写的文章、正在准备的方向 |
| P1 | 展示最后更新时间 |
| P2 | 入职后可切换为当前工作、研究方向、开源项目、可交流话题 |

### 7.3 关于 `/about`

| 优先级 | 需求 |
|---|---|
| P0 | 教育背景、研究方向、求职方向 |
| P0 | 技术栈分组：前端、后端、AI 应用、工程化、部署运维 |
| P0 | 奖项、竞赛、实习、重要经历 |
| P1 | 用 3-5 条短句说明个人特点，避免空泛自夸 |
| P1 | 展示长期兴趣方向，如 AI 应用工程、Agent 系统、知识库、开发工具 |

### 7.4 作品集索引 `/projects`

| 优先级 | 需求 |
|---|---|
| P0 | 项目卡片展示名称、摘要、角色、标签、状态、缩略图 |
| P0 | 支持标签筛选：全部 / 全栈 / RAG / Agent / 系统设计 / 工程化 |
| P0 | 每张卡片提供详情页入口 |
| P1 | 标识项目成熟度：已部署 / MVP 开放 / 持续迭代 / 归档 |
| P1 | 标识证据类型：访问入口、视频、GitHub、架构图、复盘文章 |

### 7.5 作品集详情 `/projects/<slug>`

每个项目详情页必须像“面试官速读卡”，不只展示链接。

| 模块 | 必填 | 内容 |
|---|---|---|
| 一句话摘要 | 是 | 项目解决什么问题 |
| 项目状态 | 是 | 已部署 / MVP 开放 / 持续迭代 / 归档 |
| 我的角色 | 是 | 负责范围、独立完成部分、协作边界 |
| 技术栈 | 是 | 前端、后端、模型、数据库、部署 |
| 架构说明 | 是 | 架构图或模块图 + 关键设计说明 |
| 核心难点 | 是 | 2-4 个技术难点和解决方式 |
| 访问入口 / 视频 / 截图 | 是 | 可访问入口、演示视频或关键截图 |
| GitHub / 文档 | 是 | 源码、README、设计文档或文章 |
| 结果与复盘 | 是 | 结果、限制、后续改进 |
| 设计取舍与复盘 | P1 | 3-5 个可展开的技术取舍、限制和后续计划 |
| 关键证据 | P1 | 关键代码链接、PR、性能数据、系统截图或架构演进 |

详情页内容必须回答：

- 这个项目为什么值得看？
- 我具体负责了什么？
- 技术难点在哪里？
- 有什么可验证的结果？
- 有哪些可继续展开的设计取舍？

### 7.6 文章索引 `/articles`

| 优先级 | 需求 |
|---|---|
| P0 | 文章以外链形式展示，不在本站维护正文 |
| P0 | 卡片包含标题、摘要、标签、发布时间、外链 |
| P1 | 支持按标签筛选 |
| P1 | 支持失效链接标记，避免访问者点到死链 |
| P1 | 支持精选文章置顶 |

### 7.7 在线简历 `/resume`

| 优先级 | 需求 |
|---|---|
| P0 | HTML 简历作为最新版本，内容来自 `src/content/resume.mdx` |
| P0 | 提供浏览器打印为 PDF 的专用 CSS |
| P0 | 打印后单页或两页排版稳定，内容不被裁切 |
| P0 | 页面展示最后更新时间 |
| P0 | 页面底部展示二维码，扫码仍回到 `/resume` |
| P0 | 首屏展示固定域名、邮箱、GitHub 和目标方向 |
| P1 | 提供“复制链接”和“下载 PDF 版”入口，PDF 文件由人工导出后放入 `public/files/` |

### 7.8 联系方式 `/contact`

| 优先级 | 需求 |
|---|---|
| P0 | 邮箱一键复制 |
| P0 | GitHub 外链；飞书主页和技术博客主页准备好后再接入 |
| P1 | 微信二维码弹层展示，不明文展示微信号和手机号 |
| P1 | 展示可联系时间和偏好方式 |

### 7.9 背景音乐与动效

背景音乐和动效只作为个人风格点缀，不影响求职阅读。

| 优先级 | 需求 |
|---|---|
| P2 | 右下角或页脚提供轻量音乐按钮 |
| P2 | 默认关闭、默认静音，必须由用户主动触发 |
| P2 | 记住用户本次会话内的播放状态 |
| P2 | 移动端不自动加载大音频文件 |
| P2 | 动效只用于状态反馈、hover、页面切换、锚点滚动和内容层级提示 |

禁止项：

- 不做自动播放。
- 不做干扰阅读的粒子背景、复杂视差、全屏 loading 动画。
- 不让音乐、动画、视频进入首屏关键加载路径。

## 8. 非功能需求

| 维度 | 指标 |
|---|---|
| 首屏加载 | 移动端 4G 模拟下 LCP < 2.5s |
| Lighthouse | Performance / Accessibility / Best Practices / SEO 均 >= 90 |
| JS 体积 | 首页页面 JS payload < 50 KB（gzip 后） |
| 图片 | 全部使用 WebP / AVIF；头像、图标优先 SVG / WebP |
| 视频 | mp4(H.264 + AAC)，单个 < 80 MB；超过限制走对象存储或外链 |
| 音频 | 不进入首屏关键路径，用户点击后再加载 |
| 可访问性 | 所有交互元素有 focus 样式，所有图片有 alt，对比度 AA |
| SEO | 每页有独立 title、description、og:image |
| 分享 | 首页、简历页、项目页有 OpenGraph / Twitter Card / 微信分享基础信息 |
| 隐私 | 不放业务密钥，不放真实手机号；微信号通过二维码图片展示 |
| 部署 | 推送到 main 分支后 60 秒内全网生效 |
| 故障域 | 主部署平台异常时，简历短链可切到静态镜像或备用域名 |
| 可维护性 | 新增一个项目不需要改页面代码，只新增内容文件和静态资源 |
| ECS 占用 | 首版不在 2C2G ECS 上运行常驻进程，不占用 PostgreSQL / Redis / Cloudflare Tunnel 资源 |

## 9. 技术方案

| 维度 | 选型 | 理由 |
|---|---|---|
| 框架 | Astro 5（最新稳定） | 默认零 JS，适合静态内容、Markdown / MDX、SEO 和高性能；Astro 6 默认启用的 rolldown-vite 与 `@tailwindcss/vite` 当前组合存在已知兼容问题，故选 Astro 5 |
| 样式 | Tailwind CSS v4（`@tailwindcss/vite`） | v4 通过 Vite 插件接入，配置在 CSS 中，避免 PostCSS 配置漂移 |
| 内容管理 | Astro Content Collections（Content Layer API）+ MDX / JSON | 可定义 Zod schema，减少手改内容时字段写错 |
| 起步方式 | 不套第三方人物模板，从零基于 Astro 官方初始化 | 长期只依赖 Astro / Tailwind / MDX 等一线项目，避免第三方模板停更带来的迁移成本 |
| 部署 | Vercel 静态部署，备选 Cloudflare Pages | 免费额度足够，全球 CDN，自动 HTTPS，Git push 即生效 |
| 域名 | `wh5233.me` 主域名 | 个人门户作为长期主入口；如未来主域名另作他用，可平移到 `me.wh5233.me` |
| 国际化 | 首版只交付中文，i18n 路由结构预留 | `astro.config.mjs` 配置 `defaultLocale: 'zh'`，未来加 `en` 不需要重构页面 |
| 二维码生成 | 构建期生成静态 PNG | 避免运行时 JS 依赖 |
| 视频托管 | 首版可放 `public/videos/`；长期建议对象存储或外部静态链接 | 避免仓库膨胀 |
| 监控 | Vercel Analytics 或 Cloudflare Web Analytics | 不引入重型追踪 SDK |
| 内容校验 | Zod schema + `npm run check` | 内容字段错误在构建期失败暴露 |

### 9.1 部署架构与 ECS 边界

个人门户首版按纯静态站处理，部署在 Vercel 或 Cloudflare Pages。阿里云 2C2G ECS 已经承担 ScholarMind / ScriptLens 后端、PostgreSQL、Redis、Cloudflare Tunnel 等资源，不应再为个人门户新增常驻服务。

| 项 | 决策 |
|---|---|
| 首选部署 | Vercel 静态部署，Git push 后自动构建 |
| 备选部署 | Cloudflare Pages 静态部署 |
| ECS 角色 | 首版不使用 ECS；只在未来需要备用静态镜像时作为可选 fallback |
| Cloudflare Tunnel | 个人门户不需要 Tunnel；Tunnel 继续服务 ScholarMind / ScriptLens API |
| 数据库 / Redis | 不使用 PostgreSQL、Redis、RDS 或任何持久化后端 |
| Docker / Compose | 不为个人门户编写生产 Docker Compose |
| 域名接入 | `wh5233.me` 或 `me.wh5233.me` 直接绑定 Vercel / Cloudflare Pages |
| 静态资源 | 图片优先随站点部署；大视频优先外链或对象存储，不压 2C2G ECS 带宽 |

复用低成本云端部署手册时，只复用以下经验：

- 域名、DNS、Vercel 发布边界和密钥纪律。
- `git push` 触发前端自动构建的发布模型。
- 不把 `.env.production`、API keys、Tunnel token 写入仓库。
- 大文件、视频、备份、故障切换的成本意识。

明确不复用：

- ScholarMind 的 Docker Compose 运行态。
- PostgreSQL / Redis / pgvector。
- Cloudflare Tunnel API 入口。
- ECS 上的 `/opt/apps/homepage` 常驻后端目录规划。

如果未来需要静态镜像 fallback，可以将构建产物同步到 ECS 或对象存储，但该能力必须保持静态文件托管，不引入 Node server、PM2、数据库或后台任务。

### 9.2 开源模板调研结论与最终选择

| 模板 | 长期稳定性 | 与 PRD 适配度 | 结论 |
|---|---|---|---|
| `manuelernestog/astro-modern-personal-website`（Astrofy） | 中 | 中：自带 Blog 内容系统，与 PRD “文章只做外链索引” 相冲突 | 不采用 |
| `TimWitzdam/astro-minimal-portfolio-template` | 中低，单作者维护 | 中：缺 CV / 简历 / 打印 / 文章索引模块，需要大改 | 不采用 |
| `devaradise/devolio` / `devidevio/astro-developer-portfolio-template` | 中 | 中：信息组织可参考，结构与 PRD 不完全一致 | 仅作为信息组织参考 |
| `kremalicious/portfolio` | 中 | 低：作者风格强，不适合直接照搬 | 仅参考长期维护思路 |
| 从零基于 Astro 官方初始化 | 高，依赖只有 Astro / Tailwind / MDX 等一线项目 | 高：PRD 已细到字段级，目录与 schema 直接对应实现 | 采用 |

最终决策：**不套第三方人物模板，从零基于 Astro 官方初始化**。原因：

- 长期稳定性：人物模板有停更和版本漂移风险，长期维护要承担迁移成本；只依赖 Astro 官方 + Tailwind + MDX 一线项目，长期演进风险更低。
- 适配度：PRD 已经把目录结构、内容字段、页面优先级写到字段级，重写不慢；改第三方模板反而要先“反向理解作者意图”再裁剪，工作量更高。
- 可控性：每个组件、每段样式都来自仓库本身，不存在“看不懂的隐藏行为”，便于长期演进。
- 风险对冲：上述列出的模板可作为信息组织、首屏密度、打印样式的参考样本，但代码不直接引入仓库。

## 10. 内容模型

### 10.1 仓库结构（目标骨架）

```text
personal-portfolio/
├─ astro.config.mjs
├─ tailwind.config.mjs
├─ package.json
├─ public/
│  ├─ files/
│  │  └─ resume.pdf
│  ├─ images/
│  │  ├─ contact/
│  │  └─ projects/
│  ├─ videos/
│  ├─ audio/
│  └─ qr/
├─ src/
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ now.astro
│  │  ├─ about.astro
│  │  ├─ projects/
│  │  │  ├─ index.astro
│  │  │  └─ [slug].astro
│  │  ├─ articles.astro
│  │  ├─ resume.astro
│  │  └─ contact.astro
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ components/
│  │  ├─ Nav.astro
│  │  ├─ Footer.astro
│  │  ├─ ProjectCard.astro
│  │  ├─ EvidenceLinks.astro
│  │  ├─ VideoPlayer.astro
│  │  └─ MusicToggle.astro
│  ├─ content/
│  │  ├─ config.ts
│  │  ├─ home.mdx
│  │  ├─ now.mdx
│  │  ├─ about.mdx
│  │  ├─ resume.mdx
│  │  ├─ projects/
│  │  │  ├─ scholarmind.mdx
│  │  │  ├─ pulse.mdx
│  │  │  └─ resona.mdx
│  │  └─ articles/
│  │     └─ articles.json
│  └─ data/
│     ├─ contact.json
│     └─ site.json
└─ README.md
```

### 10.2 Site 内容字段

`src/data/site.json` 维护全站基础信息。

```json
{
  "name": "WH",
  "title": "2027 届研究生 / AI 应用与全栈工程方向",
  "headline": "关注 RAG、Agent、知识库与全栈工程化的开发者",
  "status": "正在寻找 AI 应用 / 全栈 / Agent 工程方向岗位",
  "location": "China",
  "domain": "https://wh5233.me",
  "resumeUrl": "/resume",
  "updatedAt": "2026-05-05"
}
```

### 10.3 Project 内容字段

每个 `src/content/projects/<slug>.mdx` 至少包含：

```yaml
title: ScholarMind
slug: scholarmind
summary: 面向论文阅读与研究工作的 AI Agent 学术助手
role: 独立开发 / 全栈开发 / 架构设计
status: demo
featured: true
tags:
  - RAG
  - Agent
  - Fullstack
  - System Design
stack:
  - Next.js
  - FastAPI
  - PostgreSQL
  - LLM
evidence:
  demo: https://example.com
  github: https://github.com/example
  video: /videos/scholarmind-demo.mp4
  architecture: /images/projects/scholarmind-architecture.webp
  article: https://example.feishu.cn
cover: /images/projects/scholarmind-cover.webp
startedAt: 2026-03-01
updatedAt: 2026-05-05
```

正文固定结构：

```text
## 问题背景
## 我的职责
## 技术架构
## 核心难点
## 证据入口
## 结果与复盘
## 设计取舍与复盘
```

### 10.4 Article 内容字段

```json
{
  "title": "文章标题",
  "summary": "一句话摘要",
  "tags": ["RAG", "Agent", "工程化"],
  "publishedAt": "2026-05-05",
  "url": "https://example.feishu.cn",
  "status": "active",
  "featured": false
}
```

### 10.5 Contact 内容字段

```json
{
  "email": "your-email@example.com",
  "github": "https://github.com/your-name",
  "feishu": "https://example.feishu.cn",
  "blog": "https://example.feishu.cn/wiki",
  "wechatQr": "/images/contact/wechat-qr.webp",
  "preferredContact": "邮箱 / 飞书 / 微信",
  "availability": "2027 届校招，正在寻找 AI 应用 / 全栈 / Agent 工程方向岗位"
}
```

## 11. 内容运营 / 更新工作流

```text
本地修改 Markdown / MDX / JSON
npm run check
本地预览关键页面
git commit + git push
Vercel / Cloudflare Pages 自动构建
全网生效，链接不变
```

| 更新场景 | 操作 | 影响 |
|---|---|---|
| 简历正文修改 | 改 `src/content/resume.mdx` | 已投递 PDF 上的二维码指向最新 HTML 简历 |
| PDF 简历更新 | 从 `/resume` 打印导出，覆盖 `public/files/resume.pdf` | 站内下载版同步更新 |
| 新增项目 | 新增 `src/content/projects/<slug>.mdx` + 图片 / 视频 | 作品集索引自动收录 |
| 新增飞书文章 | 在文章数据中追加一条 | 文章索引页自动收录 |
| 修改首页定位 | 改 `src/content/home.mdx` 或 `src/data/site.json` | 首页立即生效 |
| 修改当前状态 | 改 `src/content/now.mdx` 或 `src/data/site.json` | 首页和 `/now` 同步更新 |
| 修改联系方式 | 改 `src/data/contact.json` | 全站统一更新 |
| 替换二维码 | 覆盖 `public/qr/resume.png` 或构建期重新生成 | 已投递 PDF 不受影响，目标链接不变 |

内容提交前检查：

- 新增项目必须有 `summary`、`role`、`status`、`tags`、`stack`、`updatedAt`。
- 首页 featured 项目数量控制在 2-4 个。
- 项目详情至少有一种可验证证据：访问入口、截图、视频、GitHub、架构图或文章。
- 外链应能访问；无法访问时标记为 `broken` 或暂时隐藏。
- 简历更新后同步检查打印样式。

## 12. 验收标准

| 类别 | 标准 |
|---|---|
| 必含页面 | `/`、`/about`、`/projects`、`/projects/scholarmind`、`/articles`、`/resume`、`/contact` 全部上线 |
| P1 页面 | `/now` 可上线，若暂不实现，首页必须展示当前状态和更新时间 |
| 求职首屏 | 10 秒内能看到姓名、当前身份、求职方向、代表项目入口 |
| 在线简历 | `/resume` 是最新履历，展示最后更新时间 |
| 简历 PDF | 浏览器打印 `/resume` 为 PDF 后，单页或两页排版完整、字符不被裁切 |
| 二维码 | PDF 与站内二维码均能跳转 `/resume` |
| 作品集 | 至少 1 个完整作品集详情页（ScholarMind），包含职责、架构、难点、访问入口、GitHub、复盘 |
| 证据链 | featured 项目至少包含访问入口 / 截图 / 视频 / GitHub / 架构图中的两类证据 |
| 移动端 | iPhone SE（375px 宽）和常见安卓设备无横向滚动条、无字号过小 |
| 桌面端 | 1280px / 1440px / 1920px 三档下排版稳定 |
| 性能 | 首页 Lighthouse Performance >= 90 |
| SEO | 每页有独立 title / description / og:image |
| 联系 | 邮箱可复制，GitHub 可访问；微信二维码准备好后再接入 |
| 更新闭环 | 修改一行内容文件后 push，60 秒内线上可见 |
| 隐私 | 页面不展示真实手机号，不暴露业务密钥和私人账号信息 |

## 13. 里程碑

| 阶段 | 目标 | 时间预算 |
|---|---|---|
| M1 启动 | 仓库初始化、模板选型、域名绑定、空骨架上线 | 1 天 |
| M2 求职闭环 | 首页、在线简历、联系方式、二维码、打印 CSS | 1-2 天 |
| M3 作品集主体 | Pulse / ScholarMind / Resona 详情页、项目索引、证据链组件 | 2 天 |
| M4 内容增强 | 关于页、文章索引、`/now`、视频接入、OpenGraph | 1-2 天 |
| M5 投递准备 | 性能验收、移动端自测、HR 视角自测、PDF 导出 | 0.5 天 |
| M6 长期维护 | 月度内容检查、项目归档、文章追加、简历迭代 | 持续 |

首版目标：约 1 周内发布到投递可用状态。后续按项目、文章、求职阶段和职业阶段持续增量更新。

## 14. 风险与应对

| 风险 | 应对 |
|---|---|
| 自动播放音乐被视为减分项 | 默认不做自动播放；音乐入口降为 P2，用户主动触发 |
| 视觉过度设计削弱专业感 | 首屏优先信息密度和可读性，动效只服务层级与反馈 |
| 在线简历过度设计导致 PDF 排版崩 | 简历页采用单栏排版，CSS print 样式独立测试 |
| 飞书文章外链失效 | 定期校验外链，索引页支持显示失效状态 |
| 视频体积拖慢站点或撑大仓库 | 单视频严格 < 80 MB；超限走对象存储或外部静态链接 |
| 域名续费遗漏 | `wh5233.me` 续费提醒加入个人日程 |
| 内容字段手写出错 | 使用 Astro Content Collections 定义 schema，构建期失败暴露问题 |
| 联系方式泄露隐私 | 不展示真实手机号，微信只展示二维码 |
| 长期无人维护导致内容过期 | 首页和简历展示更新时间；每月做一次链接和状态检查 |
| 项目展示像“包装”而非真实能力 | 每个 featured 项目必须提供证据链和复盘，不只放宣传文案 |

## 15. 文案与设计边界

### 15.1 推荐语气

- 使用“正在寻找 AI 应用 / 全栈 / Agent 工程方向岗位”。
- 使用“我主要负责了 X，解决了 Y，结果是 Z”。
- 使用具体技术和证据，不使用泛泛的“热爱技术”“学习能力强”。
- 个人语气偏克制、理性、结构化：少形容词，少口号，优先讲边界、证据和取舍。
- 允许适度表达求职意向和合作开放度，但不把自己包装成“全能型选手”。

### 15.2 禁止语气

- 不写“求一份机会”。
- 不写无法验证的夸张描述。
- 不把项目包装成超过实际完成度的状态。
- 不在首屏堆满技术名词和动画效果。
- 不使用过度热情、煽动性或营销号式表达，例如“极致”“颠覆”“赋能一切”。

### 15.3 视觉方向

- 克制、清晰、技术感、可信。
- 动画少而准：hover、过渡、锚点滚动、当前状态提示。
- 音乐是彩蛋，不是核心卖点。
- 项目截图、架构图、代码链接比装饰图更重要。
