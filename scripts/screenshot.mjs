/**
 * DataVista 自动化截图脚本
 *
 * 用法:
 *   1. 先启动开发服务器: npm run dev
 *   2. 再运行截图:      node scripts/screenshot.mjs
 *   或一键: BASE_URL=http://localhost:10001 node scripts/screenshot.mjs
 */

import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = resolve(__dirname, '..', 'docs', 'screenshots');
const BASE_URL = process.env.BASE_URL || 'http://localhost:10001';

const THEMES = [
  { id: 'chinese-blue', label: '国风科技蓝', idx: 0 },
  { id: 'aurora-green', label: '极光翠', idx: 1 },
  { id: 'purple-star', label: '紫韵星辰', idx: 2 },
  { id: 'ink-gold', label: '墨金雅韵', idx: 3 },
  { id: 'sunrise-warm', label: '晨曦暖阳', idx: 4 },
  { id: 'celadon-light', label: '云白天青', idx: 5 },
];

if (!existsSync(SCREENSHOT_DIR)) mkdirSync(SCREENSHOT_DIR, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function switchTheme(page, themeId) {
  // 点击主题按钮打开下拉
  const themeBtn = await page.$('.theme-btn');
  if (!themeBtn) { console.log('     ⚠ 找不到主题按钮，跳过'); return false; }
  await themeBtn.click();
  await sleep(400);

  // 点击对应主题选项
  const options = await page.$$('.theme-option');
  const theme = THEMES.find(t => t.id === themeId);
  if (theme && options[theme.idx]) {
    await options[theme.idx].click();
    await sleep(1800); // 等待主题切换 + 图表重渲染
    return true;
  }
  // 关闭下拉
  await page.mouse.click(100, 100);
  await sleep(300);
  return false;
}

async function main() {
  console.log('🚀 启动 Chromium...');
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1, // 1x 控制文件大小
    });
    const page = await context.newPage();

    // 先加载首页
    console.log(`📡 连接 ${BASE_URL} ...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 20000 });

    // 等待仪表盘渲染
    try {
      await page.waitForSelector('.dashboard-grid', { timeout: 15000 });
    } catch {
      console.log('⚠ 等待超时，尝试截图当前状态...');
    }
    await sleep(2500); // 等待入场动画 + 图表渲染完成

    // ==========================================
    // 1. 逐个主题截图
    // ==========================================
    console.log('\n📸 【各主题全屏截图】');
    for (const theme of THEMES) {
      console.log(`   → ${theme.label}`);
      const ok = await switchTheme(page, theme.id);
      if (ok) {
        await page.screenshot({
          path: resolve(SCREENSHOT_DIR, `theme-${theme.id}.png`),
        });
        console.log(`     ✅ theme-${theme.id}.png`);
      } else {
        console.log(`     ❌ 切换失败`);
      }
    }

    // 回到默认主题
    await switchTheme(page, 'chinese-blue');
    await sleep(1000);

    // ==========================================
    // 2. 功能特写
    // ==========================================
    console.log('\n📸 【功能特写】');

    // 2a. 设置面板
    console.log('   → 设置面板');
    const settingsBtn = await page.$('.btn-settings');
    if (settingsBtn) {
      await settingsBtn.click();
      await sleep(800);
      await page.screenshot({ path: resolve(SCREENSHOT_DIR, 'feature-settings.png') });
      // 关闭
      await page.keyboard.press('Escape');
      await sleep(500);
      console.log('     ✅ feature-settings.png');
    }

    // 2b. 告警弹窗
    console.log('   → 告警详情弹窗');
    const alertItem = await page.$('.alert-item');
    if (alertItem) {
      await alertItem.click();
      await sleep(600);
      await page.screenshot({ path: resolve(SCREENSHOT_DIR, 'feature-alert.png') });
      const closeBtn = await page.$('.am-close');
      if (closeBtn) await closeBtn.click();
      await sleep(400);
      console.log('     ✅ feature-alert.png');
    }

    // 2c. 主题下拉
    console.log('   → 主题下拉菜单');
    const tbtn = await page.$('.theme-btn');
    if (tbtn) {
      await tbtn.click();
      await sleep(500);
      await page.screenshot({ path: resolve(SCREENSHOT_DIR, 'feature-themes.png') });
      await page.mouse.click(100, 100);
      await sleep(300);
      console.log('     ✅ feature-themes.png');
    }

    // 2d. 数据刷新动效 — 截取变化瞬间
    console.log('   → 刷新按钮区域');
    const refreshBtn = await page.$('.header-btn');
    if (refreshBtn) {
      // 先 hover 到刷新按钮展示效果
      await refreshBtn.hover();
      await sleep(300);
    }
    // 截取 header 区域
    const header = await page.$('.page-header');
    if (header) {
      await header.screenshot({ path: resolve(SCREENSHOT_DIR, 'feature-header.png') });
      console.log('     ✅ feature-header.png');
    }

    console.log(`\n🎉 完成！截图保存在: ${SCREENSHOT_DIR}`);
    console.log('   共生成以下文件:');
    for (const t of THEMES) {
      console.log(`     theme-${t.id}.png`);
    }
    console.log('     feature-settings.png');
    console.log('     feature-alert.png');
    console.log('     feature-themes.png');
    console.log('     feature-header.png');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('❌ 截图失败:', err.message);
  process.exit(1);
});
