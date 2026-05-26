---
title: "About"
updated: "2026-01-01"
---

I'm **Avishake Adhikary** — a machine learning engineer who builds AI from the ground up. Not wrappers around APIs, not fine-tuned adapters. I mean the real thing: architecture design, pretraining runs, custom CUDA kernels, loss functions from first principles.

My primary focus is on three areas: **large language models** (transformer architectures, training dynamics, RLHF, efficient inference), **diffusion models** (score-based generative modeling, latent diffusion, flow matching), and **multimodal systems** (vision-language alignment, cross-attention, contrastive learning). I care about understanding why things work, not just that they work.

## What you'll find here

This blog is a research notebook made public. I write about:

- **Model architecture** — dissecting transformers, diffusion U-Nets, SSMs, MoEs, and whatever comes next. Not summaries of papers; actual derivations and reimplementations.
- **Training at scale** — mixed precision, gradient checkpointing, distributed training strategies, instability debugging. The parts of ML that live between the paper and the working model.
- **Mathematical foundations** — variational inference, score matching, information theory, optimization geometry. I think math belongs in engineering writing.
- **Systems and tooling** — PyTorch internals, custom autograd, CUDA programming, inference optimization. The machinery underneath the research.

I write when I notice something that took me longer to understand than it should have, or when I've done something that I wish I could have found written down somewhere.

## About this site

Built from scratch with **Next.js 15** (statically exported), **TypeScript**, **Tailwind CSS**, and **JetBrains Mono** everywhere. Markdown is processed with `unified` / `remark` / `rehype`; syntax highlighting comes from Shiki; math is rendered with KaTeX. There is no CMS. Posts are markdown files in a folder. The build reads them, renders HTML, and ships static files to GitHub Pages.

Source on [GitHub](https://github.com/avishakeadhikary/blog).

## Support

If my writing has helped you understand something faster, you can support more of it:

- [GitHub Sponsors](https://github.com/sponsors/avishakeadhikary)
- [Patreon](https://patreon.com/avishakeadhikary)
- [Ko-fi](https://ko-fi.com/avishakeadhikary)
- [Buy Me a Coffee](https://buymeacoffee.com/avishake69)

Thanks for reading.
