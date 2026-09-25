@echo off
title Smart Canteen Management Platform - Local Server
echo Starting Smart Canteen Platform on http://localhost:3000...
powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
