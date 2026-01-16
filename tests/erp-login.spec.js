const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const config = require('../utils/config');

test.describe('ERP系统登录测试套件', () => {
  let loginPage;
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });
  
  test('TC-001: 管理员成功登录', async ({ page }) => {
    test.setTimeout(60000);
    console.log('\n🧪 开始测试: 管理员登录');
    
    // 1. 导航到ERP
    await loginPage.navigate();
    
    // 2. 执行登录
    const admin = config.users.admin;
    const loginResult = await loginPage.login(admin.username, admin.password);
    
    // 3. 断言
    expect(loginResult).toBeTruthy();
    
    // 4. 验证登录后页面
    await expect(page).not.toHaveURL(/login|signin|auth/i);
    await expect(page.locator('body')).not.toContainText(/错误|失败|error/i);
    
    // 5. 验证用户信息显示
    const userInfoVisible = await page.locator(`:has-text("${admin.username}")`).first().isVisible()
      || await page.locator(':has-text("admin")').first().isVisible();
    
    expect(userInfoVisible).toBeTruthy();
    console.log('✅ 测试通过: 管理员登录成功');
  });
  
  test('TC-002: 普通用户成功登录', async ({ page }) => {
    test.setTimeout(60000);
    console.log('\n🧪 开始测试: 普通用户登录');
    
    await loginPage.navigate();
    const user = config.users.user;
    const loginResult = await loginPage.login(user.username, user.password);
    
    expect(loginResult).toBeTruthy();
    console.log('✅ 测试通过: 普通用户登录成功');
  });
  
  test('TC-003: 错误密码应该登录失败', async ({ page }) => {
    test.setTimeout(60000);
    console.log('\n🧪 开始测试: 错误密码验证');
    
    await loginPage.navigate();
    const user = config.users.user;
    const wrongPassword = 'WrongPassword123!';
    
    try {
      await loginPage.login(user.username, wrongPassword);
      expect(false).toBeTruthy();
    } catch (error) {
      console.log(`✅ 预期错误: ${error.message}`);
      expect(error.message).toMatch(/失败|错误/i);
    }
    
    console.log('✅ 测试通过: 错误密码被正确拒绝');
  });
});

test.describe('ERP登录性能测试', () => {
  test('登录响应时间应小于5秒', async ({ page }) => {
    test.setTimeout(30000);
    console.log('\n⏱️ 开始登录性能测试');
    
    const loginPage = new LoginPage(page);
    const startTime = Date.now();
    
    await loginPage.navigate();
    const user = config.users.user;
    await loginPage.login(user.username, user.password);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ 登录总耗时: ${duration}ms`);
    expect(duration).toBeLessThan(5000);
    console.log(`✅ 性能测试通过: ${duration}ms < 5000ms`);
  });
});
