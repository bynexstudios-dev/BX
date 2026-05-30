const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Lenovo\\Desktop\\S Project new 30';

const replacements = [
    { search: /--accent:\s*#ccff00;/g, replace: '--accent: #D90429;' }, // Premium Red
    { search: /--accent-2:\s*#ff3e00;/g, replace: '--accent-2: #8D0801;' }, // Dark Premium Red
    { search: /S <span>SERIES<\/span>/g, replace: 'B<span>X</span>' },
    { search: /S SERIES/g, replace: 'BX' },
    { search: /S Series/g, replace: 'BX' },
    { search: /sseries_cart/g, replace: 'bx_cart' },
    { search: /sseries@gmail\.com/g, replace: 'hello@bx.com' }
];

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        let modified = false;
        replacements.forEach(r => {
            if (content.match(r.search)) {
                content = content.replace(r.search, r.replace);
                modified = true;
            }
        });
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        }
    }
});
