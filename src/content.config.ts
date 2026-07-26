import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const projectStatus = z.enum(['live', 'demo', 'wip', 'archived']);
const contentStatus = z.enum(['featured', 'active', 'draft', 'archived', 'broken']);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    status: projectStatus,
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    evidence: z
      .object({
        demo: z.string().url().optional(),
        github: z.string().url().optional(),
        video: z.string().optional(),
        architecture: z.string().optional(),
        article: z.string().url().optional(),
      })
      .default({}),
    cover: z.string().optional(),
    startedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date(),
  }),
});

const articleGroup = z.enum(['playbook', 'pitfalls', 'notes']);

const articles = defineCollection({
  loader: file('src/content/articles/articles.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    group: articleGroup,
    order: z.number().int().optional(),
    tags: z.array(z.string()).default([]),
    publishedAt: z.coerce.date(),
    url: z.string().url(),
    status: contentStatus.default('active'),
    featured: z.boolean().default(false),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: 'home.{md,mdx}', base: 'src/content' }),
  schema: z.object({
    headline: z.string(),
    intro: z.string(),
    techTags: z.array(z.string()).default([]),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: 'about.{md,mdx}', base: 'src/content' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
  }),
});

const now = defineCollection({
  loader: glob({ pattern: 'now.{md,mdx}', base: 'src/content' }),
  schema: z.object({
    title: z.string(),
    updatedAt: z.coerce.date(),
  }),
});

const resume = defineCollection({
  loader: glob({ pattern: 'resume.{md,mdx}', base: 'src/content' }),
  schema: z.object({
    title: z.string(),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = {
  projects,
  articles,
  home,
  about,
  now,
  resume,
};
