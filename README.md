# Personal Portfolio Site

> 个人长期职业门户站。需求与设计依据见 [`docs/PRD.md`](./docs/PRD.md)。

## 技术栈

- Astro 5 + TypeScript
- Tailwind CSS v4（通过 `@tailwindcss/vite` 接入）
- MDX + Astro Content Collections（Content Layer API + Zod schema）
- Sitemap 集成
- 部署：Vercel 静态部署，备选 Cloudflare Pages

## 本地开发

环境要求：

- Node.js **≥ 20.18**（推荐 22）。Node 18 会装上但 Astro 5 / Tailwind v4 不能正常运行。
- npm ≥ 10.x。

仓库根目录的 `.nvmrc` 是 Node 版本约定文件，内容 `22` 表示本项目推荐使用 Node 22。它需要放在根目录，方便 nvm、CI 和部分部署平台自动识别。

如果你的系统里 `node -v` 是 18，请先升级（推荐用 [nvm-windows](https://github.com/coreybutler/nvm-windows) 或 [Volta](https://volta.sh/)），否则 `npm install` 会因 `optionalDependencies` 跳过原生 binding 导致 `@tailwindcss/oxide` 启动失败。

```bash
npm install
npm run dev
```

默认访问 `http://localhost:4321/`。

常用脚本：

```bash
npm run dev      # 本地开发
npm run check    # Astro 类型与 schema 检查
npm run build    # 静态构建到 dist/
npm run preview  # 预览 dist/ 静态产物
```

## 内容更新

| 内容 | 文件 |
|---|---|
| 首页文案 | `src/content/home.mdx` + `src/data/site.json` |
| 当前状态 | `src/content/now.mdx` |
| 关于页 | `src/content/about.mdx` |
| 在线简历 | `src/content/resume.mdx` |
| 项目详情 | `src/content/projects/<slug>.mdx` |
| 文章索引 | `src/content/articles/articles.json` |
| 联系方式 | `src/data/contact.json` |
| 站点基础信息 | `src/data/site.json` |

## 静态资源约定

| 路径 | 用途 |
|---|---|
| `public/files/resume.pdf` | 由 `/resume` 浏览器打印导出后放入，供下载 |
| `public/images/` | 站点图片，按目录细分 |
| `public/images/projects/` | 项目封面、架构图、截图 |
| `public/images/contact/` | 微信二维码等联系类图片 |
| `public/videos/` | 项目演示视频；超过 80MB 走外链 |
| `public/audio/` | 背景音乐音频；不进入首屏关键路径 |
| `public/qr/` | `/resume` 二维码等长期固定二维码图片 |

## 部署

1. 将仓库推送到 GitHub。
2. 在 Vercel 导入仓库；Astro 会被自动识别。
   - Framework Preset：Astro
   - Build Command：`npm run build`
   - Output Directory：`dist`
   - Node.js Version：22.x
3. 在 Vercel 项目的 Domains 设置中绑定 `wh5233.me` 主域名（按 Vercel 给出的 DNS 记录配置 A / CNAME）。
4. 推送到 `main` 分支后 60 秒内全网生效。

> 备选：Cloudflare Pages 同样可零配置识别 Astro。  
> 不部署到 ECS：详见 [`docs/PRD.md`](./docs/PRD.md) 第 9.1 节"部署架构与 ECS 边界"。

部署前最小自查：

- [ ] `npm run check` 通过。
- [ ] `npm run build` 通过，`dist/` 目录生成。
- [ ] `dist/index.html`、`dist/resume/index.html`、`dist/projects/scholarmind/index.html` 存在。
- [ ] `src/data/site.json` 中的 `name`、`fullName`、`domain`、`updatedAt` 已填真实值。
- [ ] `src/data/contact.json` 中的 `email`、`github`、`feishu` 已填真实值。
- [ ] `public/images/contact/wechat-qr.webp` 已上传，否则 `/contact` 微信二维码会显示破图。

## 内容提交前检查

- 新增项目必须包含 `summary`、`role`、`status`、`tags`、`stack`、`updatedAt`。
- 项目详情至少有一种可验证证据：Demo、截图、视频、GitHub、架构图或文章。
- 外链应能访问；无法访问时把 `status` 改为 `broken` 或暂时隐藏。
- 简历更新后请同步检查 `/resume` 打印样式（浏览器打印预览）。
- 提交前运行：`npm run check && npm run build`。

## 隐私边界

- 不在仓库或页面中提交真实手机号。
- 微信号只通过 `public/images/contact/wechat-qr.webp` 提供，不展示明文。
- `.env*` 已加入 `.gitignore`。

## 文档

- [`docs/PRD.md`](./docs/PRD.md)：长期事实源，包含定位、范围、页面、内容模型、验收标准。
- `docs/internal/`：内部部署笔记目录，已在 `.gitignore` 中，仅本地保留。
