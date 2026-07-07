# DataVista / 数据视界

<p align=\"center\">
  <img src=\"https://img.shields.io/badge/license-MIT-blue.svg\" alt=\"License\" />
  <img src=\"https://img.shields.io/badge/status-active-brightgreen.svg\" alt=\"Status\" />
</p>

> 🖥️ 从 0 到 1 的数据可视化大屏开发实践项目

## 📖 项目简介

**DataVista（数据视界）** 是一个个人学习型开源项目，旨在通过从零开始构建一个完整的数据可视化大屏应用，掌握大屏开发全流程——包括数据接入、图表渲染、自适应布局、动效交互以及工程化部署。

项目定位为**实践驱动**，每一个功能模块都力求清晰可读、注释完备，适合同样在学习大屏开发的同学参考和上手。

## ✨ 特性

- 🎯 **从零搭建** — 不依赖大屏模板，每一步都有据可查
- 📊 **图表可视化** — 常用图表类型的封装与组合
- 🖥️ **自适应布局** — 适配不同分辨率屏幕，保持比例一致
- 🎨 **动效交互** — Tab 切换、轮播、数字滚动等大屏常见动效
- 🔌 **数据 Mock** — 内置 Mock 数据层，无后端也能跑通全流程
- 📦 **工程化** — 代码规范、提交规范、CI/CD 实践

## 🛠️ 技术栈

> 技术选型将在开发过程中逐步确定，以下为规划方向。

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 / React（待定） |
| 语言 | TypeScript |
| 构建 | Vite |
| 图表 | ECharts |
| CSS | SCSS / Tailwind CSS |
| 数据 Mock | MSW |
| 测试 | Vitest / Playwright |
| CI/CD | GitHub Actions |

## 🚀 快速开始

 + "" + "" + "" + @"bash
# 克隆项目
git clone https://github.com/DaPengRuYi/DataVista.git

# 进入目录
cd DataVista

# 安装依赖
npm install

# 启动开发服务器
npm run dev
" + "" + "" + "" + @"

## 📁 项目结构

> 目录结构将随开发推进逐步完善。

" + "" + "" + "" + @"
DataVista/
├── public/          # 静态资源
├── src/             # 源代码
│   ├── assets/      # 资源文件
│   ├── components/  # 公共组件
│   ├── views/       # 页面视图
│   ├── charts/      # 图表组件
│   ├── hooks/       # 组合式函数
│   ├── stores/      # 状态管理
│   ├── services/    # API 服务
│   ├── utils/       # 工具函数
│   └── types/       # 类型定义
├── docs/            # 文档
└── tests/           # 测试
" + "" + "" + "" + @"

## 🗺️ 开发路线图

- [ ] 项目初始化 & 工程化配置
- [ ] 大屏布局框架搭建
- [ ] 自适应缩放方案
- [ ] 图表组件开发
- [ ] 边框 & 装饰组件
- [ ] 动效 & 交互
- [ ] Mock 数据层
- [ ] 暗黑 / 亮色主题切换
- [ ] E2E 测试
- [ ] CI/CD 部署

## 📄 开源协议

本项目采用 [MIT License](LICENSE)。

## 🙋‍♂️ 关于作者

一个正在实践的数据可视化学习者，欢迎 Star ⭐ 和交流讨论！

---

**DataVista** — 让数据一览无余
