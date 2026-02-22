const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'src/content/docs/c-programming');
const dirs = ['function_structure', 'series_and_conversion', 'pointers', 'file_handling', 'arrays'];

dirs.forEach(d => {
    const dir = path.join(base, d);
    try {
        fs.readdirSync(dir).filter(f => f.endsWith('.mdx')).forEach(f => {
            const p = path.join(dir, f);
            let c = fs.readFileSync(p, 'utf8');
            if (c.includes("from '../../../components/DifficultyBadge.astro'")) {
                c = c.replace("from '../../../components/DifficultyBadge.astro'", "from '../../../../components/DifficultyBadge.astro'");
                fs.writeFileSync(p, c);
                console.log('Fixed:', f);
            }
        });
    } catch (e) { }
});
console.log('Done!');
