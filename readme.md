# ERP智能自动化测试框架
---
一套基于 Playwright 的现代化、AI 增强的 ERP 系统网页自动化测试解决方案
项目概述 • 快速开始 • 功能特性 • 目录结构 • 使用指南
## 📖 项目概述

本项目是一个专为 ERP 系统设计的自动化测试框架，基于 Microsoft Playwright 构建，集成了智能元素定位、多环境配置、可视化报告等特性，旨在提升 ERP 系统测试的覆盖率和可靠性。
> 核心优势：免费开源、易于上手、功能强大，专为 ERP 系统测试场景优化。
## 🚀 快速开始
### 环境要求

- 操作系统: Windows 10/11, macOS 10.14+, Ubuntu 20.04+
- Node.js: v18.17.0 或更高版本
- 内存: 8GB RAM (推荐 16GB+)
- 磁盘空间: 5GB 可用空间
- 
### 5分钟安装部署

#### 1. 一键环境配置 (Windows)

```bash
# 下载并运行安装脚本
.\setup-windows.bat
```

该脚本将自动完成 Node.js 检查、依赖安装、浏览器下载等所有步骤。

#### 2. 手动安装（适用于所有平台）
```bash
# 1. 克隆项目
git clone <你的项目地址>
cd erp-ai-automation

# 2. 安装依赖
npm install

# 3. 安装浏览器
npx playwright install chromium

# 4. 验证安装
npx playwright --version
```
#### 3. 环境配置
复制环境配置文件并修改为你的 ERP 系统地址：
```bash
# 复制配置模板
copy .env.template .env

# 编辑 .env 文件，设置你的 ERP 地址
ERP_URL=http://your-erp-system.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
```
#### 4. 运行测试
```bash
# 运行所有测试
npm test

# 或使用详细报告
npx playwright test --reporter=html,line
```
#### 5. 查看测试报告
测试完成后，自动生成可视化报告：
```bash
# 打开 HTML 报告
npm run report
```
报告文件位于：playwright-report/index.html
## ✨ 功能特性
### 🧠 AI 增强测试
- 智能元素定位器: 自动识别多语言、动态变化的页面元素
- 自适应验证码处理: 支持测试环境验证码自动处理
- 容错重试机制: 智能处理网络波动和页面加载问题
### 📊 专业测试报告
- 多格式报告: HTML、JSON、Line 等多种报告格式
- 可视化追踪: 包含操作截图、视频录制、网络追踪
- 性能监控: 页面加载时间、操作响应时间统计
### 🔧 企业级特性
- Page Object 模式: 代码结构清晰，易于维护
- 多环境配置: 支持开发、测试、生产环境一键切换
- 数据驱动测试: JSON 数据文件管理测试用例
- CI/CD 集成: 原生支持 GitHub Actions、Jenkins 等
## 📁 目录结构
```
erp-ai-automation/
├── tests/                 # 测试用例目录
│   └── erp-login.spec.js # ERP 登录测试样例
├── pages/                # 页面对象模型
│   └── LoginPage.js      # 登录页面封装
├── utils/                # 工具类
│   ├── smart-locator.js  # 智能元素定位器
│   └── config.js         # 配置管理
├── screenshots/          # 截图保存目录
├── playwright-report/   # HTML 测试报告
├── playwright.config.js  # Playwright 配置
├── package.json          # 项目依赖配置
└── .env                  # 环境变量配置
```
## 🎯 使用指南
### 运行测试的多种方式
```bash
# 1. 运行全部测试
npm test

# 2. 可视化调试模式
npm run test:ui

# 3. 查看浏览器运行
npm run test:headed

# 4. 调试模式（支持断点）
npm run test:debug

# 5. 运行特定测试文件
npx playwright test tests/erp-login.spec.js

# 6. 运行包含特定标签的测试
npx playwright test --grep "登录"
```
### 编写测试用例
参考 tests/erp-login.spec.js 编写你的测试：
```javascript
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test('管理员登录测试', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // 导航到 ERP 系统
  await loginPage.navigate();
  
  // 执行登录操作
  const result = await loginPage.login('admin', 'password');
  
  // 验证登录结果
  expect(result).toBeTruthy();
});
```
### 配置说明
主要配置文件 playwright.config.js 支持以下定制：
```javascript
// 示例配置
module.exports = {
  timeout: 30000,           // 全局超时时间
  retries: 2,               // 失败重试次数
  workers: 4,               // 并行工作进程数
  use: {
    headless: false,        // 是否无头模式
    viewport: { width: 1920, height: 1080 }, // 浏览器视窗
    screenshot: 'on',       // 截图策略
    video: 'retain-on-failure' // 视频录制
  }
};
```
## 🔧 实用脚本
项目提供了多个实用脚本，简化日常操作：
```bash
# 环境检查脚本
.\tools\checklist.bat

# 每日自动化运行
.\tools\daily-run.bat

# 环境重置（清理重新安装）
.\tools\reset-env.bat

# 快速运行测试并生成报告
.\tools\run-tests.bat
```
## 🐛 常见问题
### 安装问题
Q: Node.js 安装失败？
A: 请从 Node.js 官网 下载 v18+ 版本，安装时勾选 "Add to PATH"。
Q: Playwright 浏览器下载慢？
A: 使用国内镜像加速：
```bash
set PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright/
```
### 运行问题
Q: 测试超时？
A: 在 playwright.config.js 中增加超时时间：
```javascript
timeout: 60000,  // 60秒
expect: { timeout: 10000 }
```
Q: 元素找不到？
A: 使用智能定位器或增加等待：
```javascript
await page.waitForSelector('#element', { timeout: 10000 });
```
## 📈 最佳实践
1. 使用数据驱动: 将测试数据存储在 JSON 文件中
2. 实现页面对象: 每个页面创建独立的类文件
3. 合理使用等待: 优先使用 waitForSelector 而非固定等待
4. 定期维护: 更新浏览器版本和依赖包
5. 集成 CI/CD: 自动化测试执行和报告生成
## 🤝 参与贡献
欢迎提交 Issue 和 Pull Request！
1. Fork 本项目
2. 创建特性分支 (git checkout -b feature/AmazingFeature)
3. 提交更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 开启 Pull Request
## 📄 许可证
本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。
## 📞 技术支持
- 文档: 查看 docs/ 目录获取详细文档
- 问题: 提交 GitHub Issues
- 社区: 加入我们的技术交流群
---
开始你的自动化测试之旅吧！ 🎉
> 如有问题，请先查看 故障排除 章节或运行 .\checklist.bat 进行环境诊断。
