# DataVista（数据视界）完整项目搭建提示词

## 角色设定
你是一名资深前端架构师与数据可视化大屏专家，精通 Vue 3 + TypeScript + Vite 技术栈、ECharts 图表引擎、MSW 数据 Mock、以及前端工程化全流程。你的代码风格严谨、模块化、可测试、可维护。

## 项目背景
- 项目名：DataVista（数据视界）
- 定位：个人从 0 到 1 实践的数据可视化大屏开源学习项目
- 当前阶段：纯前端，数据采用 Mock，后期通过 Repository Pattern 无缝切换真实 API
- 仓库地址：https://github.com/nevernotbad/DataVista
- Git 用户：nevernotbad / 2465431819@qq.com

## 核心约束（必须遵守）
1. **严禁所有代码耦合在单一文件中**，每个文件职责单一
2. **数据层采用 Repository Pattern**，定义 IDataSource 接口，Mock 和 API 分别实现
3. **目录结构严格按下方规范**，不允许随意新增顶层目录
4. **每个模块完成后立即验证**（lint + type-check + test + 启动确认）
5. **所有文案使用中文**

## 目标目录结构

 + "" + "" + "" + @"
src/
├── adapters/                # 数据适配器层
│   ├── IDataSource.ts       # 数据源接口定义
│   ├── MockDataSource.ts    # Mock 数据源实现
│   └── ApiDataSource.ts     # API 数据源实现（后期）
├── charts/                  # 图表组件
│   ├── BarChart/
│   │   ├── BarChart.vue
│   │   └── useBarChart.ts
│   ├── LineChart/
│   │   ├── LineChart.vue
│   │   └── useLineChart.ts
│   ├── PieChart/
│   │   ├── PieChart.vue
│   │   └── usePieChart.ts
│   └── GaugeChart/
│       ├── GaugeChart.vue
│       └── useGaugeChart.ts
├── components/              # 通用 UI 组件
│   ├── BorderBox/
│   │   └── BorderBox.vue
│   ├── Decoration/
│   │   └── Decoration.vue
│   ├── DigitalScroll/
│   │   └── DigitalScroll.vue
│   ├── Loading/
│   │   └── Loading.vue
│   └── PageHeader/
│       └── PageHeader.vue
├── composables/             # 组合式函数
│   ├── useAutoResize.ts     # 大屏自适应缩放
│   ├── useCarousel.ts       # 轮播逻辑
│   └── useTheme.ts          # 主题切换
├── layouts/                 # 布局
│   └── DashboardLayout.vue  # 大屏网格布局
├── mocks/                   # MSW Mock 配置
│   ├── browser.ts           # 浏览器端 MSW 初始化
│   ├── handlers.ts          # 请求处理器汇总
│   └── data/                # Mock 数据 JSON
│       ├── sales.json
│       ├── traffic.json
│       ├── distribution.json
│       └── efficiency.json
├── services/                # 业务服务
│   ├── dashboard.ts         # 大屏数据服务
│   └── logger/
│       ├── index.ts         # Logger 入口
│       └── Logger.ts        # Logger 核心实现
├── stores/                  # Pinia Store
│   ├── dashboard.ts         # 大屏数据状态
│   └── theme.ts             # 主题状态
├── styles/                  # 样式
│   ├── variables.scss       # CSS 变量 & SCSS 变量
│   ├── reset.scss           # 样式重置
│   └── global.scss          # 全局样式
├── types/                   # 类型定义
│   ├── dashboard.ts         # 大屏数据类型
│   └── global.d.ts          # 全局类型声明
├── views/                   # 页面
│   └── Dashboard.vue        # 大屏主页面
├── App.vue
└── main.ts
" + "" + "" + "" + @"

## 技术依赖清单

### 生产依赖
| 包名 | 用途 |
|------|------|
| vue | 核心框架 |
| pinia | 状态管理 |
| vue-router | 路由 |
| echarts | 图表引擎 |
| vue-echarts | Vue ECharts 封装 |
| axios | HTTP 请求（API 适配器使用） |
| dayjs | 时间处理 |

### 开发依赖
| 包名 | 用途 |
|------|------|
| typescript | 类型系统 |
| vite | 构建工具 |
| @vitejs/plugin-vue | Vite Vue 插件 |
| sass | SCSS 编译 |
| msw | Mock Service Worker |
| vitest | 单元测试 |
| @vue/test-utils | Vue 组件测试 |
| happy-dom | 测试 DOM 环境 |
| playwright | E2E 测试 |
| eslint | 代码检查 |
| @typescript-eslint/parser | TS ESLint 解析器 |
| @typescript-eslint/eslint-plugin | TS ESLint 规则 |
| eslint-plugin-vue | Vue ESLint 规则 |
| prettier | 代码格式化 |
| stylelint | 样式检查 |
| stylelint-config-standard-scss | SCSS Stylelint 规则 |
| husky | Git hooks |
| lint-staged | 暂存区文件检查 |
| @commitlint/cli | 提交信息检查 |
| @commitlint/config-conventional | 提交规范配置 |

## 执行步骤（严格按顺序，每步完成后确认）

### 第 1 步：搭建 Vite + Vue 3 + TS 脚手架

1. 使用 
pm create vite@latest . -- --template vue-ts 在当前 DataVista 目录创建项目
2. 安装全部生产依赖和开发依赖：
    + "" + "" + "" + @"bash
   npm install vue pinia vue-router echarts vue-echarts axios dayjs
   npm install -D typescript vite @vitejs/plugin-vue sass msw vitest @vue/test-utils happy-dom playwright
   npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-vue prettier stylelint stylelint-config-standard-scss
   npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
   " + "" + "" + "" + @"
3. 配置 ite.config.ts：设置别名 @ 指向 src/，配置 SCSS 全局变量注入
4. 配置 	sconfig.json：开启路径别名、严格模式
5. 运行 
pm run dev 确认项目能启动

### 第 2 步：搭建工程化规范体系

1. 创建 .eslintrc.cjs：集成 TypeScript + Vue 3 规则
2. 创建 .prettierrc.json：统一格式化规则
3. 创建 .stylelintrc.json：SCSS 规则
4. 添加 package.json scripts：
   - "lint": "eslint src --ext .ts,.vue --fix"
   - "format": "prettier --write src/**/*.{ts,vue,scss}"
   - "lint:style": "stylelint src/**/*.{scss,vue} --fix"
   - "type-check": "vue-tsc --noEmit"
   - "test": "vitest run"
   - "test:watch": "vitest"
   - "test:e2e": "playwright test"
5. 初始化 Husky：
    + "" + "" + "" + @"bash
   npx husky init
   " + "" + "" + "" + @"
6. 创建 .husky/pre-commit：运行 
px lint-staged
7. 创建 .husky/commit-msg：运行 
px --no -- commitlint --edit 
8. 配置 lint-staged（在 package.json 中）：对 .ts/.vue 跑 eslint，对 .scss 跑 stylelint，对全部跑 prettier
9. 创建 commitlint.config.cjs：使用 conventional 规范
10. 删除 Vite 默认生成的 HelloWorld.vue 等示例文件，只保留框架结构

### 第 3 步：创建类型定义与样式基础

1. **src/types/dashboard.ts**：
   - SalesData：month, revenue, target（销售额月度数据）
   - TrafficData：channel, value, percentage（流量来源）
   - DistributionData：name, value（品类分布）
   - EfficiencyData：name, value, unit（效率指标）
   - DashboardData：汇总以上所有数据

2. **src/types/global.d.ts**：声明 .vue 模块、SCSS 模块

3. **src/styles/variables.scss**：
   - 大屏设计稿基准 1920×1080
   - 主色系：科技蓝 #00d4ff、深色背景 #0a1a2e、面板背景 gba(6,30,60,0.8)
   - 字体、间距、边框渐变等 CSS 变量
   - 标题样式 mixin

4. **src/styles/reset.scss**：标准 CSS Reset

5. **src/styles/global.scss**：全局深色背景、字体、滚动条样式

6. 在 ite.config.ts 中配置 SCSS dditionalData 自动注入 ariables.scss

### 第 4 步：实现 Logger 日志服务

1. **src/services/logger/Logger.ts**：
   - 日志级别枚举：DEBUG、INFO、WARN、ERROR
   - 类 Logger：构造函数接收模块名 module
   - 方法：debug()、info()、warn()、error()
   - 格式：[时间] [级别] [模块名] 消息
   - 开发环境 console 输出，预留 emote() 方法用于后期远程上报

2. **src/services/logger/index.ts**：导出 createLogger(module: string) 工厂函数

### 第 5 步：实现数据层（Repository Pattern）

1. **src/adapters/IDataSource.ts**：
   - 接口 IDataSource<T>：方法 etchData(): Promise<T>

2. **src/adapters/MockDataSource.ts**：
   - 实现 IDataSource<DashboardData>
   - etchData() 通过 xios 请求 MSW 拦截的 /api/dashboard，返回结构化数据

3. **src/adapters/ApiDataSource.ts**：
   - 实现 IDataSource<DashboardData>
   - etchData() 直接通过 xios 请求真实 API 端点（URL 可配置）
   - 包含错误处理和重试逻辑骨架

### 第 6 步：配置 MSW Mock 数据

1. **src/mocks/data/ 目录下** 创建 4 个 JSON 文件，每个包含至少 6 条有意义的模拟数据：
   - sales.json：1-6 月的销售额和目标值
   - 	raffic.json：6 个流量渠道占比
   - distribution.json：6 个产品品类分布
   - efficiency.json：6 个生产效率指标

2. **src/mocks/handlers.ts**：
   - 注册 GET /api/dashboard 处理器
   - 返回 DashboardData 完整结构，汇总上述 JSON 数据

3. **src/mocks/browser.ts**：标准 MSW browser worker 初始化

4. **public/mockServiceWorker.js**：执行 
px msw init public/

### 第 7 步：创建 Pinia Store

1. **src/stores/dashboard.ts**：
   - State：data: DashboardData | null、loading: boolean、error: string | null、dataSource: IDataSource<DashboardData>
   - Actions：etchDashboard() — 通过注入的 dataSource 获取数据
   - Getters：salesChartData、	rafficChartData 等，将原始数据转为 ECharts 配置格式

2. **src/stores/theme.ts**：
   - State：isDark: boolean
   - Actions：	oggleTheme()

### 第 8 步：创建组合式函数（Composables）

1. **src/composables/useAutoResize.ts**：
   - 监听容器尺寸变化，计算缩放比例
   - 返回 scaleX、scaleY、scale（取两者最小值保持等比缩放）
   - 使用 CSS 	ransform: scale() 实现自适应
   - 导出 useAutoResize(wrapperRef, designWidth = 1920, designHeight = 1080)

2. **src/composables/useCarousel.ts**：
   - 接收 interval 参数（默认 5000ms）
   - 返回 ctiveIndex、
ext()、prev()、goTo(index)
   - 自动轮播 + 鼠标悬停暂停

3. **src/composables/useTheme.ts**：
   - 绑定 	heme Store
   - 切换时在 document.documentElement 上设置 data-theme 属性
   - 返回 isDark、	oggle

### 第 9 步：封装 ECharts 图表组件

每个图表组件遵循统一模式：
- .vue 文件负责渲染 DOM 容器和 props 接口
- useXxxChart.ts composable 负责 ECharts 初始化、配置生成、resize、销毁

1. **src/charts/BarChart/**：柱状图，展示月度销售额 vs 目标对比
2. **src/charts/LineChart/**：折线图，展示销售趋势
3. **src/charts/PieChart/**：饼图（环形），展示流量渠道分布
4. **src/charts/GaugeChart/**：仪表盘，展示效率指标

每个图表：
- 使用深色主题配色（#00d4ff 系）
- 带有入场动画（nimationDuration: 1000）
- 响应式：监听窗口 resize 自动重绘
- props 接收数据 + 可选的 height、width

### 第 10 步：创建装饰与布局组件

1. **src/components/BorderBox/BorderBox.vue**：
   - 带发光边框的容器组件
   - 使用 order-image 或伪元素实现蓝色渐变边框
   - slot 传入内容
   - props：	itle（标题文字）

2. **src/components/Decoration/Decoration.vue**：
   - 顶部/底部装饰线（SVG 或 CSS 渐变线 + 圆点）

3. **src/components/DigitalScroll/DigitalScroll.vue**：
   - 数字滚动效果组件
   - props：alue: number、duration: number
   - 使用 equestAnimationFrame 实现

4. **src/components/Loading/Loading.vue**：
   - 加载中动画（旋转的科技感圆环）
   - props：isible: boolean

5. **src/components/PageHeader/PageHeader.vue**：
   - 大屏顶部标题栏
   - 左侧：项目名称"数据视界 / DataVista"
   - 中间：当前时间（实时更新）
   - 右侧：主题切换按钮

### 第 11 步：创建布局与主页面

1. **src/layouts/DashboardLayout.vue**：
   - 使用 CSS Grid 实现大屏网格布局
   - 布局方案（12 列）：
     - 顶部：一行，PageHeader（高度 80px）
     - 左列（3 列宽）：两行 — 饼图（流量）+ 仪表盘（效率）
     - 中列（6 列宽）：两行 — 折线图（趋势）+ 柱状图（销售）
     - 右列（3 列宽）：两行 — 数字滚动面板 + 装饰区域
   - 使用 useAutoResize 实现等比缩放
   - 深色背景 + 网格线装饰

2. **src/views/Dashboard.vue**：
   - 组装 DashboardLayout
   - onMounted 时调用 Store 的 etchDashboard()
   - 根据 loading 状态显示 Loading 组件
   - 根据 error 状态显示错误提示

### 第 12 步：装配入口文件

1. **src/main.ts**：
   - 创建 Vue 应用
   - 注册 Pinia、Router
   - 开发环境下启动 MSW：if (import.meta.env.DEV) { const { worker } = await import('./mocks/browser'); worker.start() }
   - 导入全局样式
   - 挂载应用

2. **src/App.vue**：
   - 仅包含 <RouterView />
   - 设置 #app 为 width: 100vw; height: 100vh; overflow: hidden

3. **路由配置**：/ 指向 Dashboard 页面

4. **index.html**：设置 <meta viewport>、页面标题"数据视界 - DataVista"

### 第 13 步：验证与启动

1. 运行 
pm run type-check，确保零类型错误
2. 运行 
pm run lint，确保零 ESLint 错误
3. 运行 
pm run format，统一格式化
4. 运行 
pm run dev，确认：
   - 页面正常加载，背景为深色
   - MSW 拦截生效，Mock 数据正确填充所有图表
   - 大屏等比缩放正常
   - 所有 4 个图表有数据有动画
   - 顶部标题栏时间实时更新
   - 数字滚动效果正常

### 第 14 步：Git 提交

1. git add -A
2. git commit -m "feat: scaffold DataVista dashboard with Vue 3 + ECharts + MSW"
3. git push origin master

## 最终验收标准

完成后的大屏页面应满足以下视觉效果：
- 全屏深蓝科技风背景，带细微网格线
- 顶部标题栏：项目名 + 实时时钟 + 主题按钮
- 左上：环形饼图 — 流量渠道分布
- 左中：仪表盘 — 效率指标
- 中上：折线图 — 月度销售趋势（带动画）
- 中下：柱状图 — 销售额 vs 目标对比
- 右上：数字滚动面板 — 核心指标数值
- 右下：装饰区域 + 数据汇总文字
- 所有面板带发光边框
- 缩放浏览器窗口时大屏等比缩放，不变形
