import fs from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR = path.join(process.cwd(), 'allfiles', 'c_Programs');
const DEST_DIR = path.join(process.cwd(), 'src', 'content', 'docs', 'c-programming');

async function buildMigrationPlan() {
    const plan = [];
    try {
        const categories = await fs.readdir(SRC_DIR);

        for (const category of categories) {
            if (category.endsWith('.md')) continue; // Skip raw markdowns

            const categoryPath = path.join(SRC_DIR, category);
            const stat = await fs.stat(categoryPath);

            if (!stat.isDirectory()) continue;

            const files = await fs.readdir(categoryPath);

            const destCategoryPath = path.join(DEST_DIR, category.toLowerCase());

            for (const file of files) {
                if (!file.endsWith('.c')) continue;
                if (file === "Ascending_and_Descending_Order.c" || file === "Factorial.c") continue; // Already did these

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

<DifficultyBadge level="${difficulty}" />

### Code Example

\`\`\`c
${fileContent}
\`\`\`
`;

                const destFilePath = path.join(destCategoryPath, `${slug}.mdx`);
                plan.push({
                    content: mdxContent,
                    path: destFilePath
                });
            }
        }

        await fs.writeFile('migration_plan.json', JSON.stringify(plan, null, 2));
        console.log('Migration plan written to migration_plan.json');
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

buildMigrationPlan();
