const fse = require('fs-extra');
const copy = require('copy');

console.log('Removing old dist files...');
// Retaining node_modules by not deleting the whole dist folder
fse.removeSync('../dist/admin/');
fse.removeSync('../dist/browser/');
fse.removeSync('../dist/dynamic/');
fse.removeSync('../dist/tanam-core/');
fse.removeSync('../dist/triggers/');
fse.removeSync('../dist/index.js');
fse.removeSync('../dist/index.js.map');
fse.removeSync('../dist/package.json');
fse.removeSync('../dist/package-lock.json');

console.log('Copying Angular dist bundle...');
fse.copySync('../angular/dist/', '../dist/', { overwrite: true });
// fse.moveSync('../dist/browser/index.html', '../dist/browser/dynamic.html', { overwrite: true });

// Putting all files in same public dir for simplicity of static file serving later
fse.moveSync('../dist/admin/index.html', '../dist/browser/admin.html', { overwrite: true });
copy('../dist/admin/**', '../dist/browser/', () => {
    fse.removeSync('../dist/admin/');
    fse.removeSync('../dist/browser/assets/tanam.config.json');
});

console.log('Copying cloud functions dist bundle...');
fse.copySync('./dist/functions/src', '../dist/');
fse.copySync('./package.json', '../dist/package.json');
fse.copySync('./package-lock.json', '../dist/package-lock.json');

console.log('Copying Tanam configuration...');
try {
    fse.copySync('../tanam.config.json', '../dist/browser/assets/tanam.config.json');
} catch (err) {
    console.log("No Tanam config file found. Not a problem if you provided configuration in another way.");
}

console.log('Done!');
