powershell set-executionpolicy unrestricted
cd /d %~dp0
powershell -File .\bin\run.ps1 -apply
pause