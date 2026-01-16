@echo off
echo === ERP自动化测试环境检查清单 ===
echo.

echo 1. Node.js版本检查...
node --version
if errorlevel 1 echo ❌ Node.js未安装

echo.
echo 2. npm版本检查...
npm --version
if errorlevel 1 echo ❌ npm有问题

echo.
echo 3. Playwright检查...
npx playwright --version >nul 2>nul
if errorlevel 1 echo ❌ Playwright未安装

echo.
echo 4. 目录结构检查...
if exist tests (echo ✅ tests目录存在) else (echo ❌ tests目录不存在)
if exist screenshots (echo ✅ screenshots目录存在) else (echo ❌ screenshots目录不存在)

echo.
echo 5. package.json检查...
if exist package.json (
  echo ✅ package.json存在
  type package.json | findstr "test" >nul
  if errorlevel 1 echo ❌ package.json缺少test脚本
) else (
  echo ❌ package.json不存在
)

echo.
echo === 检查完成 ===
pause
