$ErrorActionPreference = "Stop"

$srcDir = Join-Path (Get-Location) "allfiles\c_Programs"
$destDir = Join-Path (Get-Location) "src\content\docs\c-programming"

Write-Host "Starting migration..."

if (-Not (Test-Path $srcDir)) {
    Write-Error "Source directory not found: $srcDir"
    exit 1
}

$categories = Get-ChildItem -Path $srcDir -Directory

foreach ($categoryItem in $categories) {
    $categoryName = $categoryItem.Name
    $categoryPath = $categoryItem.FullName
    $destCategoryPath = Join-Path $destDir ($categoryName.ToLower())

    if (-Not (Test-Path $destCategoryPath)) {
        New-Item -ItemType Directory -Path $destCategoryPath -Force | Out-Null
    }

    $files = Get-ChildItem -Path $categoryPath -Filter "*.c" -File

    foreach ($fileItem in $files) {
        $fileName = $fileItem.Name
        $filePath = $fileItem.FullName
        $fileContent = Get-Content -Path $filePath -Raw

        $title = $fileName.Replace(".c", "").Replace("_", " ")
        $slug = $fileName.Replace(".c", "").Replace("_", "-").ToLower()

        $difficulty = "Beginner"
        if ($categoryName -match "Array|Function|Pointer") {
            $difficulty = "Intermediate"
        }

        $tags = @("C", ($categoryName -replace "_", " "))
        $tagsJson = "[" + ($tags | ForEach-Object { "`"$_`"" }) -join ", " + "]"

        $mdxContent = @"
---
title: "$title"
description: "C Program for $title"
difficulty: "$difficulty"
tags: $tagsJson
---

import DifficultyBadge from '../../../../components/DifficultyBadge.astro';

<DifficultyBadge level={frontmatter.difficulty} />

### Code Example

```c
$fileContent
```
"@

        $destFilePath = Join-Path $destCategoryPath "$slug.mdx"
        Set-Content -Path $destFilePath -Value $mdxContent -Encoding UTF8
        Write-Host "Migrated: $fileName -> $destCategoryPath\$slug.mdx"
    }
}

Write-Host "Migration Complete!"
