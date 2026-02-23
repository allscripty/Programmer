import os
import shutil
import json

src_dir = os.path.join(os.getcwd(), 'allfiles', 'c_Programs')
dest_dir = os.path.join(os.getcwd(), 'src', 'content', 'docs', 'c-programming')

def migrate():
    print('Starting migration...')
    
    try:
        categories = os.listdir(src_dir)
        
        for category in categories:
            if category.endswith('.md'):
                continue
            
            category_path = os.path.join(src_dir, category)
            if not os.path.isdir(category_path):
                continue
                
            files = os.listdir(category_path)
            
            dest_category_path = os.path.join(dest_dir, category.lower())
            os.makedirs(dest_category_path, exist_ok=True)
            
            for file in files:
                if not file.endswith('.c'):
                    continue
                    
                file_path = os.path.join(category_path, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    file_content = f.read()
                
                title = file.replace('.c', '').replace('_', ' ')
                slug = file.replace('.c', '').replace('_', '-').lower()
                
                difficulty = 'Beginner'
                if 'Array' in category or 'Function' in category or 'Pointer' in category:
                    difficulty = 'Intermediate'
                
                tags = ['C', category.replace('_', ' ')]
                tags_json = json.dumps(tags)
                
                mdx_content = f"""---
title: "{title}"
description: "C Program for {title}"
difficulty: "{difficulty}"
tags: {tags_json}
---

import DifficultyBadge from '../../../../components/DifficultyBadge.astro';

<DifficultyBadge level="{difficulty}" />

### Code Example

```c
{file_content}
```
"""
                
                dest_file_path = os.path.join(dest_category_path, f"{slug}.mdx")
                with open(dest_file_path, 'w', encoding='utf-8') as f:
                    f.write(mdx_content)
                print(f"Migrated: {file} -> {dest_category_path}/{slug}.mdx")
                
        print('Migration Complete!')
    except Exception as e:
        print(f'Migration failed: {e}')

if __name__ == '__main__':
    migrate()
