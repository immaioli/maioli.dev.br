import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';
import { z } from 'zod';

export const AboutFrontmatterSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  priority: z.number().int().min(1).max(100),
  tags: z.array(z.string()).default([]),
});

export type AboutFrontmatter = z.infer<typeof AboutFrontmatterSchema>;

export type AboutEntry = {
  slug: string;
  lang: string;
  frontmatter: AboutFrontmatter;
  content: string;
};

const contentDirectory = path.join(process.cwd(), 'content', 'about');

function parseAboutFile(filePath: string, slug: string, lang: string): AboutEntry {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const result = AboutFrontmatterSchema.safeParse(data);

  if (!result.success) {
    throw new Error(`Invalid about frontmatter in "${filePath}": ${result.error.message}`);
  }

  return { slug, lang, frontmatter: result.data, content };
}

export const getSortedAboutEntries = cache((lang: string): Omit<AboutEntry, 'content'>[] => {
  const localeDirectory = path.join(contentDirectory, lang);
  if (!fs.existsSync(localeDirectory)) return [];

  return fs.readdirSync(localeDirectory)
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const entry = parseAboutFile(path.join(localeDirectory, fileName), slug, lang);
      return { slug: entry.slug, lang: entry.lang, frontmatter: entry.frontmatter };
    })
    .sort((a, b) => b.frontmatter.priority - a.frontmatter.priority);
});

export const getAboutEntryBySlug = cache((slug: string, lang: string): AboutEntry | null => {
  const localeDirectory = path.join(contentDirectory, lang);
  const mdxPath = path.join(localeDirectory, `${slug}.mdx`);
  const mdPath = path.join(localeDirectory, `${slug}.md`);
  const targetPath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  return targetPath ? parseAboutFile(targetPath, slug, lang) : null;
});
