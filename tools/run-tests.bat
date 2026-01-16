@echo off
chcp 65001 >nul
echo ========================================
echo ERP自动化测试运行脚本
echo ========================================
echo.

echo 步骤1: 检查环境...
node --version
if errorlevel 1 (
  echo ❌ Node.js未安装
  pause
  exit /b 1
)

echo.
echo 步骤2: 创建必要目录...
if not exist screenshots mkdir screenshots
if not exist screenshots\debug mkdir screenshots\debug
if not exist test-results mkdir test-results

echo.
echo 步骤3: 运行登录测试...
echo 开始时间: %date% %time%
echo.

npx playwright test tests/erp-login.spec.js --reporter=html,line

echo.
echo 结束时间: %date% %time%
echo.

if exist playwright-report (
  echo 报告已生成: playwright-report/index.html
  start playwright-report/index.html
)

echo.
echo ========================================
echo 测试执行完成！
echo 查看报告: playwright-report/index.html
echo ========================================
pause
