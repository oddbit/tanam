const fse = require('fs-extra');

console.log('Removing old dist files...');
// Retaining node_modules by not deleting the whole dist folder
fse.removeSync('../dist/index.js');
fse.removeSync('../dist/browser/');
fse.removeSync('../dist/tanam-render/');
fse.removeSync('../dist/triggers/');

console.log('Copying cloud functions dist bundle...');
fse.copySync('./dist/', '../dist/');

console.log('Copying admin app dist bundle...');
fse.copySync('../admin/dist/tanam-admin/', '../dist/browser/');
fse.moveSync('../dist/browser/index.html', '../dist/browser/admin.html');

console.log('Copying dynamic rendering app dist bundle...');
fse.copySync('../render/dist/', '../dist/dynamic/');
fse.moveSync('../dist/dynamic/browser/', '../dist/browser/');
fse.moveSync('../dist/browser/index.html', '../dist/browser/dynamic.html');

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
    const renderPackage = require('../render/package.json');

    mainPackage.main = 'index.js';
    mainPackage.scripts = {};
    mainPackage.devDependencies = {};
    mainPackage.dependencies = {
        ...mainPackage.dependencies,
        ...adminPackage.dependencies,
        ...renderPackage.dependencies,
    };
    fse.writeFile('../dist/package.json', JSON.stringify(mainPackage, null, 2), { encoding: 'utf8' });
}

console.log('Merge package-lock.json files...');
{
    const mainPackage = require('./package-lock.json');
    const adminPackage = require('../admin/package-lock.json');
    const renderPackage = require('../render/package-lock.json');

    mainPackage.dependencies = {
        ...mainPackage.dependencies,
        ...adminPackage.dependencies,
        ...renderPackage.dependencies,
    };
    fse.writeFile('../dist/package-lock.json', JSON.stringify(mainPackage, null, 2), { encoding: 'utf8' });
}

console.log('Done!');
