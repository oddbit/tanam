const fs = require('fs');

(() => {
    console.log('Copying files for Firebase cloud functions...');
    ['./package.json', './package-lock.json'].map(file => {
        fs.copyFileSync(file, `dist/${file}`);
    });
})();
