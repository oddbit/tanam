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
fse.moveSync('../dist/browser/index.html', '../dist/browser/dynamic.html', { overwrite: true });

// Putting all files in same public dir for simplicity of static file serving later
fse.moveSync('../dist/admin/index.html', '../dist/browser/admin.html', { overwrite: true });
copy('../dist/admin/**', '../dist/browser/', () => { });
fse.removeSync('../dist/admin/');

console.log('Copying cloud functions dist bundle...');
fse.copySync('./dist/functions/src', '../dist/');

console.log('Copying Tanam configuration...');
try {
    fse.copySync('../tanam.config.json', '../dist/browser/assets/tanam.config.json');
} catch (err) {
    console.log("No Tanam config file found. Not a problem if you provided configuration in another way.");
}

console.log('Merge package.json files...');
{
    const functionsPackage = require('./package.json');
    const angularPackage = require('../angular/package.json');

    functionsPackage.dependencies = { ...angularPackage.dependencies, ...functionsPackage.dependencies };
    functionsPackage.main = 'index.js';
    functionsPackage.scripts = {};
    functionsPackage.devDependencies = {};
    const jsonContent = JSON.stringify(functionsPackage, null, 2)
    fse.writeFile('../dist/package.json', jsonContent, { encoding: 'utf8' });
}

console.log('Merge package-lock.json files...');
{
    const functionsPackage = require('./package-lock.json');
    const angularPackage = require('../angular/package-lock.json');

    functionsPackage.dependencies = { ...angularPackage.dependencies, ...functionsPackage.dependencies };
    const jsonContent = JSON.stringify(functionsPackage, null, 2)
    fse.writeFile('../dist/package-lock.json', jsonContent, { encoding: 'utf8' });
}

console.log('Done!');
