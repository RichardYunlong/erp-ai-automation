@echo off
echo === 重置测试环境 ===
echo.

echo 警告：这将删除所有已安装的包和生成的文件！
echo 按Ctrl+C取消，或按任意键继续...
pause >nul

echo.
echo 步骤1: 删除node_modules...
if exist node_modules rmdir /s /q node_modules

echo.
echo 步骤2: 删除生成的文件...
if exist package-lock.json del package-lock.json
if exist playwright-report rmdir /s /q playwright-report
if exist test-results rmdir /s /q test-results
if exist screenshots rmdir /s /q screenshots

echo.
echo 步骤3: 重新初始化...
npm init -y

echo.
echo 步骤4: 重新安装...
npm install --save-dev @playwright/test playwright jest-image-snapshot dotenv

echo.
echo 步骤5: 安装浏览器...
npx playwright install chromium

echo.
echo ✅ 环境重置完成！
echo 运行: npm test 开始测试
pause
