@echo off
chcp 65001 >nul
title ERP自动化测试每日运行

echo ####################################
echo #    ERP自动化测试每日运行脚本     #
echo #    运行时间: %date% %time%      #
echo ####################################
echo.

echo 1. 更新代码...
git pull
if errorlevel 1 (
  echo ❌ 代码更新失败
  pause
  exit /b 1
)

echo.
echo 2. 安装依赖...
npm install
if errorlevel 1 (
  echo ❌ 依赖安装失败
  pause
  exit /b 1
)

echo.
echo 3. 运行所有测试...
set START_TIME=%time%
npx playwright test --reporter=html,line
set TEST_RESULT=%errorlevel%
set END_TIME=%time%

echo.
echo 4. 生成报告...
if %TEST_RESULT% equ 0 (
  echo ✅ 所有测试通过！
) else (
  echo ⚠️ 有测试失败
)

echo.
echo 5. 发送通知（可选）...
echo 测试开始时间: %START_TIME%
echo 测试结束时间: %END_TIME%
echo 测试结果: %TEST_RESULT%

echo.
echo 6. 归档报告...
set ARCHIVE_FOLDER=reports\%date:~0,4%%date:~5,2%%date:~8,2%
mkdir "%ARCHIVE_FOLDER%" 2>nul
if exist playwright-report (
  xcopy playwright-report "%ARCHIVE_FOLDER%\playwright-report" /E /I /Y
  echo ✅ 报告已归档到: %ARCHIVE_FOLDER%
)

echo.
echo ####################################
echo #           运行完成！             #
echo ####################################
pause
