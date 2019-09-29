 param (
    [switch]$create = $false,
    [switch]$apply = $false,
    [switch]$help = $false
 )

 $ErrorActionPreference = 'SilentlyContinue'

#################################################
# Functions
################################################

function installChocoIfNecessary() {
    if (Get-Command choco -ErrorAction SilentlyContinue) 
    { 
       Write-Output "Chocolatey is already installed"
    } else {
       Write-Output "Seems Chocolatey is not installed, installing now..."
       Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    }
}

function installNodeIfNecessary() {
    if (Get-Command node -ErrorAction SilentlyContinue) 
    { 
       Write-Output "Node version already installed"
    } else {
       choco install -y nodejs.install
    }
    
    npm install shelljs
    npm install path
}

function printHelpAndQuit() {
    Get-Content 'data\generalHelp.txt'
    Get-Content 'data\winHelp.txt'
    exit
}


################################################

if ($help -or (!$create -and !$apply)) {
    printHelpAndQuit
}

installChocoIfNecessary
installNodeIfNecessary


if ($apply) {
    node .\bin\applySnapshot.js 'data\win.rc' 'data\winAppData.json' 'data\winAppData'
} else {
    node .\bin\createSnapshot.js 'data\win.rc' 'data\winAppData.json' 'data\winAppData'
}
 