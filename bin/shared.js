const fs = require('fs');
const shell = require('shelljs');

const getConfig = configFilePath => {
    const lines = require('fs').readFileSync(configFilePath, 'utf-8')
        .split('\n')
        .filter(Boolean);

    const configgers = lines.reduce((acc, curr) => {
        const kvp = curr.split('=');
        if (kvp.length === 2) acc[kvp[0]] = kvp[1];
        return acc;
    }, {});

    //console.log(JSON.stringify(configgers, null, 4));

    return configgers;
}

const getAppData = appDataConfigPath => {
    if (!shell.test('-f', appDataConfigPath)) {
        console.error(`A JSON config file containing application data does not exist at ${appDataConfigPath}`);
        process.exit(1);
    }

    return JSON.parse(fs.readFileSync(appDataConfigPath, 'utf8'));
}

const interpolatePaths = (path, variablesConfigData) => {
    variablesConfigData.split('|').forEach(variable => {
        const kvp = variable.split(';');
        if (kvp.length !== 2) {
            console.log(`Bad variable config value: ${variable}...skipping.`);
            return;
        }

        //console.log(`\nkvp: ${kvp}`);
        path = path.replace(kvp[0], kvp[1]);    
    });

    return path;
}

module.exports = {
    getConfig: getConfig,
    getAppData: getAppData,
    interpolatePaths: interpolatePaths,
}
