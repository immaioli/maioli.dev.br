import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { cache } from 'react';

// Zod schema to enforce a strong contract on MDX frontmatter (fail fast)
export const ProjectFrontmatterSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  priority: z.number().int().min(1).max(100),
  date: z.coerce.date(),
  githubUrl: z.string().url().nullable().optional(),
  productionUrl: z.string().url().nullable().optional(),
  tags: z.array(z.string()).default([]),
});

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;

export type Project = {
  slug: string;
  lang: string;
  frontmatter: ProjectFrontmatter;
  content: string; // The raw markdown/MDX content
};

const contentDir = path.join(process.cwd(), 'content', 'projects');

/**
 * Reads all projects for a locale, sorted by priority (descending)
 * first and then by date (descending).
 * Wrapped in React's cache() so it is memoized within a single
 * server render pass.
 */
export const getSortedProjects = cache((lang: string): Omit<Project, 'content'>[] => {
  const dirPath = path.join(contentDir, lang);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(dirPath);

  const projects = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(dirPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const { data } = matter(fileContents);

      // Validates frontmatter via Zod. On failure the page build fails
      // fast, flagging bad data in the MDX file instead of rendering it.
      const result = ProjectFrontmatterSchema.safeParse(data);
      if (!result.success) {
        throw new Error(`Invalid project frontmatter in "${fullPath}": ${result.error.message}`);
      }
      const parsedData = result.data;

      return {
        slug,
        lang,
        frontmatter: parsedData,
      };
    });

  return projects.sort((a, b) => {
    // First criterion: priority (higher first)
    if (a.frontmatter.priority !== b.frontmatter.priority) {
      return b.frontmatter.priority - a.frontmatter.priority;
    }
    // Second criterion: date (newer first)
    return b.frontmatter.date.getTime() - a.frontmatter.date.getTime();
  });
});

/**
 * Reads a single project by its slug and locale.
 */
export const getProjectBySlug = cache((slug: string, lang: string): Project | null => {
  const fullPathMdx = path.join(contentDir, lang, `${slug}.mdx`);
  const fullPathMd = path.join(contentDir, lang, `${slug}.md`);

  let targetPath = null;
  if (fs.existsSync(fullPathMdx)) {
    targetPath = fullPathMdx;
  } else if (fs.existsSync(fullPathMd)) {
    targetPath = fullPathMd;
  }

  if (!targetPath) return null;

  const fileContents = fs.readFileSync(targetPath, 'utf8');
  const { data, content } = matter(fileContents);

  const result = ProjectFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid project frontmatter in "${targetPath}": ${result.error.message}`);
  }
  const parsedData = result.data;

  return {
    slug,
    lang,
    frontmatter: parsedData,
    content,
  };
});
