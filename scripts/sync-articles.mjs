import fs from 'node:fs';
import path from 'node:path';

const srcRoot = 'e:/0找工作/0大模型全栈知识库/career/文章/飞书待发布';
const outDir = 'src/content/articles';
const playbookRoot = 'e:/0找工作/0大模型全栈知识库/career/实习/实习的原始文档/playbook';

// publishedAt: 优先文档时间索引「Git首次加入」日期；未纳入 Git 则用「最后修改(FS)」日期
const articles = [
  { id: 'llm-stable-json', title: 'LLM稳定JSON抽取', summary: 'JSON 抽取要过三关：语法可解析、契约合规、业务事实正确——前两项绿不代表第三项过。', group: 'playbook', order: 1, tags: ['Playbook'], publishedAt: '2026-07-25', featured: true, alt: path.join(playbookRoot, 'llm-stable-json-extraction.md') },
  { id: 'magic-number-throttle', title: 'Magic Number 治理', summary: 'Magic number 是携带了隐藏决策却没写清依据的字面量；治理要回答谁定的、约束什么、何时失效、怎么验证。', group: 'playbook', order: 2, tags: ['Playbook'], publishedAt: '2026-05-21', featured: false, alt: path.join(playbookRoot, 'magic-number-governance.md') },
  { id: 'test-governance', title: '测试治理', summary: '测试要验证真实行为，不是复刻实现；失真的测试比没有测试更坏。', group: 'playbook', order: 3, tags: ['Playbook'], publishedAt: '2026-07-06', featured: false, alt: path.join(playbookRoot, 'testing-governance.md') },
  { id: 'executable-plan', title: '可执行计划治理', summary: 'Plan 回答顺序、文件与验证；执行只按 Plan 推进，别把方案原文搬进 Plan。', group: 'playbook', order: 4, tags: ['Playbook'], publishedAt: '2026-07-09', featured: false, alt: path.join(playbookRoot, 'executable-plan-governance.md') },
  { id: 'comment-governance', title: '代码注释治理', summary: '注释解释 why 和代码说不清的约束，不当第二事实源。', group: 'playbook', order: 5, tags: ['Playbook'], publishedAt: '2026-07-02', featured: false, alt: path.join(playbookRoot, 'comment-governance.md') },
  { id: 'incremental-refactor-piv', title: '渐进式重构-双层计划与PIV', summary: '大重构用双层计划 + 小 slice 的 PIV，一 slice 一提交，别把总纲一次丢给 Agent。', group: 'playbook', order: 6, tags: ['Playbook'], publishedAt: '2026-06-07', featured: true, file: '02-工程治理与AI-Coding/渐进式重构-双层计划与PIV.md' },
  { id: 'ai-coding-engineering', title: 'AI编码工具工程化使用', summary: '用 AGENTS.md / skills / plan 把 AI 编码纳入工程流程，而不是一次性加速。', group: 'playbook', order: 7, tags: ['Playbook'], publishedAt: '2026-06-08', featured: true, file: '02-工程治理与AI-Coding/AI编码工具工程化使用.md' },
  { id: 'llm-concurrency', title: 'LLM并发与容量治理', summary: '并发不是经验常数；用准入、在途、速率和降级一起找吞吐、尾延迟、成本与质量的平衡。', group: 'playbook', order: 8, tags: ['Playbook'], publishedAt: '2026-07-27', featured: true, alt: path.join(playbookRoot, 'llm-concurrency-capacity-governance.md') },
  { id: 'state-curve-drift', title: '踩坑 01 · 状态曲线重复运行漂移', summary: '同一文本重复跑出不同结构曲线；改成固定模板分类 + 确定性 reducer。', group: 'pitfalls', order: 1, tags: ['踩坑'], publishedAt: '2026-07-25', featured: false, file: '01-AI应用工程/踩坑-状态曲线重复运行漂移.md' },
  { id: 'longtext-silent-truncation', title: '踩坑 02 · 长文本静默截断与窗口标定', summary: '链路返回合法 JSON，实际只覆盖约 6% 文本——问题在静默截断，不在模型不准。', group: 'pitfalls', order: 2, tags: ['踩坑'], publishedAt: '2026-07-25', featured: true, file: '01-AI应用工程/踩坑-长文本静默截断与窗口标定.md' },
  { id: 'chunk-to-fulltext', title: '踩坑 03 · 从分块选场到全文直喂', summary: '分块选场导致漏实体和重复；常见长文改全文单次调用。', group: 'pitfalls', order: 3, tags: ['踩坑'], publishedAt: '2026-07-25', featured: false, file: '01-AI应用工程/踩坑-从分块选场到全文直喂.md' },
  { id: 'sync-to-worker', title: '踩坑 04 · 从同步长任务到可恢复Worker', summary: '数分钟长任务放同步 HTTP 会超时丢状态；迁到可恢复 Worker。', group: 'pitfalls', order: 4, tags: ['踩坑'], publishedAt: '2026-07-26', featured: false, file: '03-可靠性与架构演进/踩坑-从同步长任务到可恢复Worker.md' },
  { id: 'agent-writeback-race', title: '踩坑 05 · Agent写回竞态与副作用验证', summary: '多 Agent 并行改同一编辑器会竞态；改回单 Agent，并在工具层校验是否真改了。', group: 'pitfalls', order: 5, tags: ['踩坑'], publishedAt: '2026-07-25', featured: true, file: '01-AI应用工程/踩坑-Agent写回竞态与副作用验证.md' },
  { id: 'ai-coding-scratch-notes', title: 'AI应用开发踩坑随手记', summary: '验证别埋雷；魔法数字会静默节流；plan 容易过度设计；agentic 听着香但扛不住长程。', group: 'notes', order: 1, tags: ['手记'], publishedAt: '2026-07-25', featured: true, file: '手记/AI应用开发踩坑随手记.md' },
  { id: 'ai-iteration-antipattern', title: 'AI迭代反模式-指标幻觉与方向失控', summary: '指标全绿、结果失真——把一次方向失控写成可复用的迭代纪律。', group: 'notes', order: 2, tags: ['复盘'], publishedAt: '2026-07-14', featured: true, file: '01-AI应用工程/AI迭代反模式-指标幻觉与方向失控.md' },
  { id: 'ai-saas-infra-loop', title: '可运营AI-SaaS基建闭环', summary: '可运营 SaaS 不是页面+接口，而是身份、入口、长任务、成本与可观测形成闭环。', group: 'notes', order: 3, tags: ['复盘'], publishedAt: '2026-06-24', featured: false, file: '03-可靠性与架构演进/可运营AI-SaaS基建闭环.md' },
  { id: 'async-retry-observability', title: '异步重试边界与可观测性', summary: '把重试、可观测和成本归属写成可复述的工程边界。', group: 'notes', order: 4, tags: ['复盘'], publishedAt: '2026-06-05', featured: false, file: '03-可靠性与架构演进/异步重试边界与可观测性.md' },
];

fs.mkdirSync(outDir, { recursive: true });

for (const a of articles) {
  const src = a.alt || path.join(srcRoot, a.file);
  let body = fs.readFileSync(src, 'utf8').replace(/^\uFEFF/, '');

  const tagsYaml = a.tags.map((t) => `  - ${JSON.stringify(t)}`).join('\n');
  const fm = `---
title: ${JSON.stringify(a.title)}
summary: ${JSON.stringify(a.summary)}
group: ${a.group}
order: ${a.order}
tags:
${tagsYaml}
publishedAt: ${a.publishedAt}
status: active
featured: ${a.featured}
---

`;

  fs.writeFileSync(path.join(outDir, `${a.id}.md`), fm + body, 'utf8');
  console.log('wrote', a.id);
}

console.log('done', articles.length);
