'use strict';
const shell = require('shelljs');
const fs = require('fs');
const shared = require('./shared');

//////////////////////////////////////////////////////////////////////////////////////////

const configFilePath = process.argv[2];
const appDataConfigPath = process.argv[3];
const appDataFilesPath = process.argv[4];

//////////////////////////////////////////////////////////////////////////////////////////

const installAppsAndCopyFiles = (config, appData) => {
    for (let app of appData) {
        // Install app
        if (app.installName) {
            console.log(`Installing ${app.name}...`);
            shell.exec(`${config.packageInstall} ${app.installName}`, (code, stdout, stderr) => {
                console.log(stderr);
            });
            console.log(`${app.name} installed.`);
        }

        // Copy config files
        const appDataPath = `${appDataFilesPath}/${app.name}`;
        if (!shell.test('-d', appDataPath)) {
            console.log(`It looks like a snapshot has not been created yet because the app config directory ${appDataPath} doesn't exist.\nSkipping app config for ${app.name}...\n`);
        } else {
            const configBasePath = shared.interpolatePaths(app.configBasePath, config.variables);
            if (!shell.test('-d', configBasePath)) shell.mkdir('-p', configBasePath);
            shell.cp('-r', `${appDataPath}/*`, configBasePath);
        }
    }
}

const assertProperArgs = () => {
    if (configFilePath && appDataConfigPath && appDataFilesPath) return;
    console.log(`${process.argv[1]} was not called with all the correct parameters`);
    process.exit(1);
}

///////////////////////////////////////////////////////////////////////////////////////////////////

assertProperArgs();

const config = shared.getConfig(configFilePath);
const appData = shared.getAppData(appDataConfigPath);

installAppsAndCopyFiles(config, appData);
