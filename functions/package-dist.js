const fse = require('fs-extra');

console.log('Removing old dist files...');
// Retaining node_modules by not deleting the whole dist folder
fse.removeSync('../dist/index.js');
fse.removeSync('../dist/browser/');
fse.removeSync('../dist/triggers/');

console.log('Copying Angular dist bundle...');
fse.copySync('../admin/dist/', '../dist/');
fse.moveSync('../dist/browser/index.html', '../dist/browser/dynamic.html');
fse.moveSync('../dist/tanam-admin/', '../dist/browser');
fse.moveSync('../dist/browser/index.html', '../dist/browser/admin.html');

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
    const mainPackage = require('./package.json');
    const adminPackage = require('../admin/package.json');

    mainPackage.dependencies = { ...adminPackage.dependencies, ...mainPackage.dependencies };
    mainPackage.main = 'index.js';
    mainPackage.scripts = {};
    mainPackage.devDependencies = {};
    const jsonContent = JSON.stringify(mainPackage, null, 2)
    fse.writeFile('../dist/package.json', jsonContent, { encoding: 'utf8' });
}

console.log('Merge package-lock.json files...');
{
    const mainPackage = require('./package-lock.json');
    const adminPackage = require('../admin/package-lock.json');

    mainPackage.dependencies = { ...adminPackage.dependencies, ...mainPackage.dependencies };
    const jsonContent = JSON.stringify(mainPackage, null, 2)
    fse.writeFile('../dist/package-lock.json', jsonContent, { encoding: 'utf8' });
}

console.log('Done!');
