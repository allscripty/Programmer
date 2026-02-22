import fs from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR = path.join(process.cwd(), 'allfiles', 'c_Programs');
const DEST_DIR = path.join(process.cwd(), 'src', 'content', 'docs', 'c-programming');

async function migrate() {
    console.log('Starting migration...');

    try {
        const categories = await fs.readdir(SRC_DIR);

        for (const category of categories) {
            if (category.endsWith('.md')) continue; // Skip raw markdowns

            const categoryPath = path.join(SRC_DIR, category);
            const stat = await fs.stat(categoryPath);

            if (!stat.isDirectory()) continue;

            const files = await fs.readdir(categoryPath);

            // Create dest directory first
            const destCategoryPath = path.join(DEST_DIR, category.toLowerCase());
            await fs.mkdir(destCategoryPath, { recursive: true });

            for (const file of files) {
                if (!file.endsWith('.c')) continue;

                const filePath = path.join(categoryPath, file);
                const fileContent = await fs.readFile(filePath, 'utf-8');

                const title = file.replace('.c', '').replace(/_/g, ' ');
                const slug = file.replace('.c', '').replace(/_/g, '-').toLowerCase();

                let difficulty = 'Beginner';
                if (category.includes('Array') || category.includes('Function') || category.includes('Pointer')) {
                    difficulty = 'Intermediate';
                }

                let tags = ['C', category.replace(/_/g, ' ')];

                const mdxContent = `---
title: "${title}"
description: "C Program for ${title}"
difficulty: "${difficulty}"
tags: ${JSON.stringify(tags)}
---

import DifficultyBadge from '../../../../components/DifficultyBadge.astro';

<DifficultyBadge level={frontmatter.difficulty} />

### Code Example

\`\`\`c
${fileContent}
\`\`\`
`;

                const destFilePath = path.join(destCategoryPath, `${slug}.mdx`);
                await fs.writeFile(destFilePath, mdxContent);
                console.log(`Migrated: ${file} -> ${destCategoryPath}/${slug}.mdx`);
            }
        }

        console.log('Migration Complete!');
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

migrate();
