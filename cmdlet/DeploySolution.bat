@echo off
cd /d %~dp0
powershell -ExecutionPolicy UnRestricted -File ".\DeploySolution.ps1"
@echo on
pause