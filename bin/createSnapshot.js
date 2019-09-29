'use strict';
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const shared = require('./shared');

//////////////////////////////////////////////////////////////////////////////////////////

const configFilePath = process.argv[2];
const appDataConfigPath = process.argv[3];
const appDataFilesPath = process.argv[4];

//////////////////////////////////////////////////////////////////////////////////////////

const assertProperArgs = () => {
    if (configFilePath && appDataConfigPath && appDataFilesPath) return;
    console.log(`${process.argv[1]} was not called with all the correct parameters`);
    process.exit(1);
}

const makeAppDataDirIfNeeded = () => shell.test('-d', appDataFilesPath) || shell.mkdir(appDataFilesPath);

const copyConfigFiles = (config, appData) => {
    for (let app of appData) {
        const appDirName = path.normalize(path.join(appDataFilesPath, app.name));
        shell.test('-d', appDirName) || shell.mkdir(appDirName);
        if (!app.configFiles) continue;
        app.configFiles.forEach(file => {
            const joinedPath = path.join(app.configBasePath, file);
            const sourceFile = shared.interpolatePaths(joinedPath, config.variables);

            console.log(`Copying ${path.normalize(sourceFile)} to ${appDirName}`);
            shell.cp('-rf', sourceFile, appDirName);
        });
    }
}

//////////////////////////////////////////////////////////////////////////////////////////

assertProperArgs();
makeAppDataDirIfNeeded();

const config = shared.getConfig(configFilePath);
const appData = shared.getAppData(appDataConfigPath);

copyConfigFiles(config, appData);
