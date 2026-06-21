const fs = require('fs');
const path = require('path');

try {
    const cssPath = path.join(__dirname, 'styles.css');
    const jsPath = path.join(__dirname, 'script.js');
    const htmlPath = path.join(__dirname, 'index.html');

    if (!fs.existsSync(cssPath)) {
        throw new Error('styles.css not found!');
    }
    if (!fs.existsSync(jsPath)) {
        throw new Error('script.js not found!');
    }
    if (!fs.existsSync(htmlPath)) {
        throw new Error('index.html not found!');
    }

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Replace the CSS stylesheet link with inlined style
    const cssLinkPattern = /<link\s+rel="stylesheet"\s+href="\.\/styles\.css"[^>]*>/;
    if (cssLinkPattern.test(htmlContent)) {
        htmlContent = htmlContent.replace(cssLinkPattern, `<style>${cssContent}</style>`);
        console.log('✅ Inlined CSS successfully.');
    } else {
        console.warn('⚠️ CSS link not found in index.html (it may have been inlined already).');
    }

    // Replace the JS script tag with inlined script
    const jsScriptPattern = /<script\s+src="\.\/script\.js"\s+defer><\/script>/;
    if (jsScriptPattern.test(htmlContent)) {
        htmlContent = htmlContent.replace(jsScriptPattern, `<script>${jsContent}</script>`);
        console.log('✅ Inlined JS successfully.');
    } else {
        console.warn('⚠️ JS script tag not found in index.html (it may have been inlined already).');
    }

    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log('🎉 index.html updated successfully with all inlined assets.');
} catch (err) {
    console.error('❌ Error during inlining:', err.message);
    process.exit(1);
}
