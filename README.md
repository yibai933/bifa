# 笔法 BIFA · 小说写作方法与技能库

Markdown 驱动的静态站点，基于 [Eleventy](https://www.11ty.dev/)。写 `.md` 自动生成页面，首页统计与计数从内容实时计算。

## 本地开发

```bash
npm install
npm run dev      # 启动本地预览（http://localhost:8080）
npm run build    # 产出 _site/ 目录
```

## 怎么更新内容

所有内容都是文件，改文件即改网站，提交后 Cloudflare 自动重新部署。

### 发一篇新文章

在 `src/articles/` 新建一个 `.md`，文件名即网址（如 `my-post.md` → `/articles/my-post/`）：

```markdown
---
layout: layouts/article.njk
title: 文章标题
category: 情节结构        # 人物塑造 / 情节结构 / 世界观构建 / 对话写作 / 叙事节奏 / 修改方法
date: 2026-08-01
readTime: 12             # 阅读分钟数
level: 入门              # 入门 / 进阶 / 高阶
excerpt: 一句话摘要，显示在首页与列表卡片。
featured: false          # true 则上首页"本周精选"摘录卡
figure: story-arc        # 可选：首页头图插画标识，留空则不显示
---

正文用 Markdown 写，支持标题、列表、引用、代码。
```

首页"精选文章"自动取最新一篇做头图、其后三篇做列表；统计里的"篇方法文章"会自动 +1。

### 改一篇技能卡

在 `src/skills/` 编辑对应 `.md`（这些文件 `permalink: false`，只供首页渲染、不生成独立页）。改 `title` / `excerpt` / `level` / `tags` / `practiceCount` 即可。

### 改练习题库

编辑 `src/_data/prompts.json`，加一条对象，首页"随机写作练习题"就多一题。

### 改模块（写作方法六项）

编辑 `src/_data/modules.json`。

### 改文案与全局信息

- 站点名、版权、页脚标签：`src/_data/site.json`
- 全站样式：`src/css/style.css`
- 交互脚本：`src/js/main.js`

## 部署到 Cloudflare Pages

仓库已推送到 GitHub，Cloudflare 连仓库后每次 `git push` 自动构建上线。

### 一次性连接（约 3 分钟）

1. 注册 / 登录 [Cloudflare](https://dash.cloudflare.com/)（若没有账号，用邮箱注册）。
2. 左侧 **Workers 和 Pages** → **创建** → **Pages** → **连接到 Git**。
3. 授权 GitHub，选 `yibai933/bifa` 仓库，分支 `main`。
4. 构建配置填：
   - **框架预设**：无（None）
   - **构建命令**：`npm run build`
   - **构建输出目录**：`_site`
   - **Node 版本**：`20` 或更高（环境变量 `NODE_VERSION=20`）
5. **保存并部署**。首次约 1 分钟，之后每次推送自动重新部署，访问 `*.pages.dev` 域名。

### 绑自定义域名（可选）

Cloudflare Pages 项目 → **自定义域** → 添加域名。国内访问建议备案后绑中文域名。

## 项目结构

```
src/
├── index.njk              首页（从集合渲染、统计真实化）
├── articles/
│   ├── index.njk          全部文章列表页
│   └── *.md              文章（每篇自动生成 /articles/<slug>/）
├── skills/*.md            技能卡数据（不生成独立页）
├── _data/                 站点 / 模块 / 题库 JSON
├── _includes/
│   ├── layouts/          base 外壳 + 文章页布局
│   └── partials/         插画片段
├── css/style.css
└── js/main.js
```
