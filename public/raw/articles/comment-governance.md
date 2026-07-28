---
title: "代码注释治理"
summary: "注释解释 why 和代码说不清的约束，不当第二事实源。"
group: playbook
order: 5
tags:
  - "Playbook"
publishedAt: 2026-07-02
status: active
featured: false
---

# 代码注释治理

注释不是代码的翻译，也不是给 Agent 的逐行旁白。代码本身是第一事实源；注释只能补充代码表达不了、但维护者必须知道的约束。

业界共识很朴素：Google Code Review / Go Style / Python Style 都强调 comment should explain why, not what；Clean Code 更激进，认为多数注释都是没把代码写清楚的副产品。真正的问题不在“要不要注释”，而在注释是否制造了第二事实源。过期注释比没有注释更坏，因为它会让人和 LLM 都相信错误背景。

LLM 不需要低质量注释。它可以读代码、类型、命名、测试和调用链。对它有价值的是代码外的事实：业务不变量、外部系统限制、兼容性边界、失败后果、为什么不能采用看起来更简单的实现。这类信息如果不写下来，Agent 很容易“优化”掉真正的防线。

## 判断原则

一条注释只有在回答下面问题时才值得保留：

- 为什么这里必须这样做？
- 这个约束来自业务、协议、数据、账本还是外部服务？
- 改错会破坏什么？
- 为什么不用更直观的方案？

如果注释只是解释代码正在做什么，应优先改命名、拆函数、收敛类型或补测试，而不是补文字。删掉注释后代码仍然同样清楚，这条注释就是噪声。

## 禁止模式

- 复述代码：`# 遍历列表`、`# 设置状态为 done`。
- 历史流水账：`旧版如何`、`本次修复了什么`。历史进 commit / ADR / playbook，不进函数体。
- 版本签名：`v2`、`Wave C`、`2026-xx fix`，除非它是稳定协议字段。
- 注释掉的旧代码。需要回溯用 git。
- 远离风险点的大段背景。局部约束必须靠近对应代码。

## 推荐口径

业务代码默认少注释。公共 API / schema 写契约。LLM prompt、预算、截断、fallback、并发、迁移、账本、外部服务适配可以写注释，但必须解释约束和失败后果。

好的注释应该短、近、真：

```py
# 未核验 claim 不能写入 verbatim 字段，否则前端会把模型概括当成原文证据高亮。
if event.quote_verified:
    evidence.quote = event.quote_verbatim
```

坏注释通常只是把代码换成中文：

```py
# 如果 quote 已核验，则设置 evidence quote
if event.quote_verified:
    evidence.quote = event.quote_verbatim
```

Agent 写代码时默认不加注释。只有当“删掉这条注释，未来维护者会更容易改错”时，才写。写了就要随代码一起维护；发现过期，直接删或改成当前事实。
