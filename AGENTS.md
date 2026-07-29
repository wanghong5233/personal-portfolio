# AGENTS.md

## 这是什么项目

个人职业门户（Astro）：`wh5233.me`。  
简历、作品集、**文章展现壳**、关于与联系。  
对外长文与公开笔记站 **同源**（原目录联接），本仓不维护第二份活正文。  
**开工前必读 `docs/PRODUCT.md`。** 知识库四层与双站细节见 `../quartz-notes/docs/PRODUCT.md`。

## 当前阶段

- 导航可同时有「文章」与「知识库」（notes 外链）——双展现定稿，保留
- **关于页逻辑删除**：版式在 `src/archived/about.astro`，数据在 `about.json` / `about.mdx`；导航已摘除，`/about` 无路由。文案定稿后再移回 `pages/` 并恢复 `site.json` → `nav`
- **待落地**：文章构建树改为联接对外正文原目录，去掉仓内手改副本
- 版式细项可看 `docs/PRD.md`；冲突以 `docs/PRODUCT.md` 为准

## 技术栈

- Astro + Tailwind；Vercel；文章 MD/MDX；Mermaid（rehype-mermaid）

## 命令

| 用途 | 命令 |
|---|---|
| 本地预览 | `npm run dev` |
| 构建 | `npm run build` |
| 检查 | `npm run check` |

## 硬约束（违反即返工）

- 先改 `docs/PRODUCT.md` 再改内容架构 / 与知识库的关系 / 双展现取舍
- 禁止把原目录正文 copy 进本仓当第二活源；用目录联接（或等价只读挂载）
- 不把知识库第 2–4 层私料打进本站
- 不为双入口维护两套可编辑 Markdown

## 改完怎么验收

- `/articles` 与 notes 对外内容一致且只改原目录即可两端更新（各自 push）
- 首页 30 秒内能看清方向与状态；简历页可分享
