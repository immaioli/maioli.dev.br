import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const projectsRoot = path.join(process.cwd(), 'content', 'projects');
const aboutRoot = path.join(process.cwd(), 'content', 'about');
const errors = [];

for (const locale of fs.readdirSync(projectsRoot)) {
  const localeDirectory = path.join(projectsRoot, locale);
  if (!fs.statSync(localeDirectory).isDirectory()) continue;

  for (const fileName of fs.readdirSync(localeDirectory)) {
    if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) continue;

    const filePath = path.join(localeDirectory, fileName);
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    const requiredFields = ['title', 'excerpt', 'priority', 'date'];
    const missingFields = requiredFields.filter((field) => data[field] === undefined);

    if (missingFields.length > 0) {
      errors.push(`${locale}/${fileName}: missing ${missingFields.join(', ')}`);
      continue;
    }

    if (Number.isNaN(new Date(data.date).getTime())) {
      errors.push(`${locale}/${fileName}: invalid date ${JSON.stringify(data.date)}`);
    }
  }
}

for (const locale of fs.readdirSync(aboutRoot)) {
  const localeDirectory = path.join(aboutRoot, locale);
  if (!fs.statSync(localeDirectory).isDirectory()) continue;

  for (const fileName of fs.readdirSync(localeDirectory)) {
    if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) continue;

    const filePath = path.join(localeDirectory, fileName);
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    const requiredFields = ['title', 'excerpt', 'priority'];
    const missingFields = requiredFields.filter((field) => data[field] === undefined);

    if (missingFields.length > 0) {
      errors.push(`about/${locale}/${fileName}: missing ${missingFields.join(', ')}`);
    } else if (data.tags !== undefined && !Array.isArray(data.tags)) {
      errors.push(`about/${locale}/${fileName}: tags must be an array`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Project and about content validation passed.');
}
