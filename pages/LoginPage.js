const { expect } = require('@playwright/test');
const SmartLocator = require('../utils/smart-locator');
const config = require('../utils/config');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.smartLocator = new SmartLocator(page);
    this.config = config;
  }

  async navigate() {
    console.log(`🌐 导航到ERP系统: ${this.config.erpUrl}`);
    
    try {
      await this.page.goto(this.config.erpUrl, {
        waitUntil: 'networkidle',
        timeout: this.config.browser.timeout
      });
      
      await this.page.waitForLoadState('networkidle');
      const title = await this.page.title();
      console.log(`📄 页面标题: ${title}`);
      
      return true;
    } catch (error) {
      console.error(`❌ 导航失败: ${error.message}`);
      await this.takeScreenshot('navigation-error');
      throw error;
    }
  }

  async login(username, password) {
    console.log(`🔐 尝试登录，用户: ${username}`);
    
    try {
      // 1. 输入用户名
      await this.smartLocator.fill('用户名', username);
      await this.page.waitForTimeout(500);
      
      // 2. 输入密码
      await this.smartLocator.fill('密码', password);
      await this.page.waitForTimeout(500);
      
      // 3. 处理验证码
      await this.handleCaptchaIfPresent();
      
      // 4. 点击登录
      await this.smartLocator.click('登录按钮');
      
      // 5. 等待登录完成
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
      
      // 6. 验证登录结果
      const loginSuccess = await this.verifyLoginSuccess(username);
      
      if (loginSuccess) {
        console.log(`✅ 登录成功: ${username}`);
        await this.takeScreenshot('login-success');
        return true;
      } else {
        throw new Error('登录验证失败');
      }
    } catch (error) {
      console.error(`❌ 登录失败: ${error.message}`);
      await this.takeScreenshot('login-failed');
      throw error;
    }
  }

  async handleCaptchaIfPresent() {
    const captchaIndicators = ['验证码', 'captcha'];
    
    for (const text of captchaIndicators) {
      const hasCaptcha = await this.page.locator(`:has-text("${text}")`).count();
      if (hasCaptcha > 0) {
        console.log(`⚠️ 检测到验证码: ${text}`);
        await this.processCaptcha();
        break;
      }
    }
  }

  async processCaptcha() {
    // 检查测试验证码
    const testCaptcha = await this.page.locator('text=1234').first();
    if (await testCaptcha.isVisible()) {
      console.log('✅ 使用测试验证码: 1234');
      await this.smartLocator.fill('验证码', '1234');
      return;
    }
    
    // 尝试万能验证码
    const universalCodes = ['8888', '0000', '1111'];
    for (const code of universalCodes) {
      try {
        await this.smartLocator.fill('验证码', code);
        await this.page.waitForTimeout(1000);
        
        // 检查是否还有验证码错误提示
        const hasError = await this.page.locator('text=验证码错误').count();
        if (hasError === 0) {
          console.log(`✅ 验证码 ${code} 可能有效`);
          return;
        }
      } catch {
        continue;
      }
    }
    
    // 截图并暂停等待手动输入
    console.log('📸 无法自动处理验证码，保存截图');
    await this.takeScreenshot('captcha-required');
    console.log('⏸️ 请在10秒内手动输入验证码...');
    await this.page.waitForTimeout(10000);
  }

  async verifyLoginSuccess(username) {
    // 检查错误信息
    const errorMessages = ['密码错误', '用户名错误', '登录失败'];
    
    for (const error of errorMessages) {
      const errorElement = await this.page.locator(`:has-text("${error}")`).first();
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        console.error(`❌ 登录错误: ${errorText}`);
        return false;
      }
    }
    
    // 检查成功指标
    const successIndicators = [
      username.toLowerCase(),
      '首页',
      'dashboard',
      'welcome',
      '欢迎'
    ];
    
    for (const indicator of successIndicators) {
      const element = await this.page.locator(`:has-text("${indicator}")`).first();
      if (await element.isVisible()) {
        console.log(`✅ 检测到成功指标: ${indicator}`);
        return true;
      }
    }
    
    // 检查URL变化
    const currentUrl = this.page.url();
    const loginUrls = ['login', 'signin', 'auth'];
    const isLoginPage = loginUrls.some(url => currentUrl.toLowerCase().includes(url));
    
    if (!isLoginPage) {
      console.log(`✅ URL跳转成功: ${currentUrl}`);
      return true;
    }
    
    console.log('⚠️ 无法确定登录状态');
    return false;
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `screenshots/${name}-${timestamp}.png`;
    
    try {
      await this.page.screenshot({ path, fullPage: true });
      console.log(`📸 截图已保存: ${path}`);
    } catch (error) {
      console.error(`❌ 截图失败: ${error.message}`);
    }
  }
}

module.exports = LoginPage;
