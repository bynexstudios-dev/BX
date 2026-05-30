const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Lenovo\\Desktop\\S Project new 30';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        let modified = false;

        // Replace product price color
        const productPriceRegex = /(\.product-price-street\s*\{[^}]*color:\s*)var\(--accent\)(;[^}]*\})/g;
        if (content.match(productPriceRegex)) {
            content = content.replace(productPriceRegex, '$1var(--text)$2');
            modified = true;
        }

        // Replace cart item details price color
        const cartItemRegex = /(\.cart-item-details\s+p\s*\{[^}]*color:\s*)var\(--accent\)(;[^}]*\})/g;
        if (content.match(cartItemRegex)) {
            content = content.replace(cartItemRegex, '$1var(--text)$2');
            modified = true;
        }

        // Replace cart total value color
        const cartTotalRegex = /(\.cart-total-value\s*\{[^}]*color:\s*)var\(--accent\)(;[^}]*\})/g;
        if (content.match(cartTotalRegex)) {
            content = content.replace(cartTotalRegex, '$1var(--text)$2');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated prices to white in ${file}`);
        }
    }
});
