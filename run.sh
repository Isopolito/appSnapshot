#!/bin/bash

mode=$1

#################
# Functions
#################

printHelpAndQuit() {
    cat 'data/generalHelp.txt'
    cat 'data/linuxHelp.txt'
}

isCreateSnapshotMode() {
   if [[ $mode = '-c' ]] || [[ $mode = '--create' ]] ;then
       echo 'true' 
   else
       echo 'false' 
   fi
}

isApplySnapshotMode() {
    if [[ $mode = '-a' ]] || [[ $mode = '--apply' ]] ;then 
        echo 'true';
    else
        echo 'false'
    fi
}

createSnapshot() {
    echo $'Creating snapshot...\n'
    node bin/createSnapshot.js 'data/linux.rc' 'data/linuxAppData.json' 'data/linuxAppData'
}

applySnapshot() {
    echo $'Applying snapshot...\n'
    node bin/applySnapshot.js 'data/linux.rc' 'data/linuxAppData.json' 'data/linuxAppData'
}

getConfigValue() {
    grep $1 ./data/config | awk -F'=' '{print $2}'
}

installNodeIfNeeded() {
    if command -v npm 1>/dev/null; then 
        # npm already installed
        return
    fi

    installCommand=$(getConfigValue 'packageInstall')
    eval $installCommand -y npm
}

###################
# Initiate work
###################

installNodeIfNeeded
npm install shelljs

if [[ $(isCreateSnapshotMode) = 'true' ]] ;then
    createSnapshot
elif [[ $(isApplySnapshotMode) = 'true' ]] ;then
    applySnapshot
else
    printHelpAndQuit
fi

