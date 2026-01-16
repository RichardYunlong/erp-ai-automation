/**
 * ERP智能元素定位器 - 免费开源方案
 */

class SmartLocator {
  constructor(page) {
    this.page = page;
    this.elementCache = new Map();
  }

  // ERP常见元素选择器映射
  getElementSelectors(elementName) {
    const selectorMap = {
      // 登录相关
      '登录按钮': [
        'button:has-text("登录")',
        'button:has-text("Sign In")',
        'button:has-text("Log In")',
        'input[type="submit"][value*="登录"]',
        '#loginBtn',
        '.login-button',
        '[data-testid="login-button"]',
        'button.btn-login'
      ],
      '用户名': [
        'input[name="username"]',
        'input[type="text"][placeholder*="用户"]',
        '#username',
        '#userName',
        '#account',
        '[data-testid="username"]',
        '.username-input'
      ],
      '密码': [
        'input[type="password"]',
        'input[name="password"]',
        '#password',
        '[data-testid="password"]',
        '.password-input'
      ],
      // ... 更多元素映射
    };

    return selectorMap[elementName] || [
      `button:has-text("${elementName}")`,
      `a:has-text("${elementName}")`,
      `[title*="${elementName}"]`,
      `[aria-label*="${elementName}"]`
    ];
  }

  async locate(elementName, options = {}) {
    console.log(`🔍 查找元素: ${elementName}`);
    
    // 检查缓存
    if (this.elementCache.has(elementName)) {
      const cachedSelector = this.elementCache.get(elementName);
      const element = await this.page.$(cachedSelector);
      if (element && await element.isVisible()) {
        console.log(`✅ 使用缓存选择器: ${cachedSelector}`);
        return cachedSelector;
      }
    }

    const selectors = this.getElementSelectors(elementName);
    
    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element && await element.isVisible()) {
          console.log(`✅ 找到元素 "${elementName}" 使用: ${selector}`);
          this.elementCache.set(elementName, selector);
          return selector;
        }
      } catch {
        continue;
      }
    }

    // 高级查找策略
    return await this.advancedLocate(elementName);
  }

  async advancedLocate(elementName) {
    // 尝试通过XPath查找
    const xpathSelectors = [
      `//*[contains(text(), '${elementName}')]`,
      `//*[contains(@value, '${elementName}')]`,
      `//button[contains(., '${elementName}')]`
    ];

    for (const xpath of xpathSelectors) {
      try {
        const element = await this.page.$(`xpath=${xpath}`);
        if (element && await element.isVisible()) {
          return xpath.replace('xpath=', '');
        }
      } catch {
        continue;
      }
    }

    // 获取页面所有可见文本
    const allTexts = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('*:not(script):not(style)');
      const results = [];
      elements.forEach(el => {
        if (el.textContent && el.textContent.trim()) {
          const text = el.textContent.trim();
          if (text.length < 50) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              results.push({
                text: text,
                tag: el.tagName.toLowerCase(),
                className: el.className,
                id: el.id
              });
            }
          }
        }
      });
      return results;
    });

    for (const item of allTexts) {
      if (item.text.includes(elementName) || elementName.includes(item.text)) {
        let selector = item.tag;
        if (item.id) selector = `#${item.id}`;
        else if (item.className) {
          const classes = item.className.split(' ').filter(c => c).join('.');
          if (classes) selector = `${item.tag}.${classes}`;
        }
        console.log(`🔍 文本匹配: "${item.text}" -> ${selector}`);
        return selector;
      }
    }

    // 截图用于调试
    await this.takeDebugScreenshot(elementName);
    throw new Error(`无法找到元素: ${elementName}`);
  }

  async takeDebugScreenshot(elementName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `screenshots/debug/${elementName}-${timestamp}.png`;
    
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    
    console.log(`📸 已保存调试截图: ${screenshotPath}`);
  }

  async click(elementName, options = {}) {
    const selector = await this.locate(elementName);
    await this.page.click(selector, options);
  }

  async fill(elementName, text, options = {}) {
    const selector = await this.locate(elementName);
    await this.page.fill(selector, text, options);
  }

  async getElement(elementName) {
    const selector = await this.locate(elementName);
    return await this.page.$(selector);
  }
}

module.exports = SmartLocator;
