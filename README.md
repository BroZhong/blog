# BroZhong Blog

基于 [timlrx/tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) 搭建的个人博客。

## 本地开发

```bash
corepack enable
yarn install
yarn dev
```

默认开发地址是 <http://localhost:3000>。
如果当前机器没有全局 `yarn` 命令，也可以直接使用仓库内置的 Yarn：

```bash
node .yarn/releases/yarn-3.6.1.cjs install
node .yarn/releases/yarn-3.6.1.cjs dev
```

## 常用位置

- 站点配置：`data/siteMetadata.js`
- 作者介绍：`data/authors/default.mdx`
- 文章目录：`data/blog`
- 项目页数据：`data/projectsData.ts`
- 导航配置：`data/headerNavLinks.ts`

## 写文章

在 `data/blog` 下新增 `.mdx` 文件即可。可以参考现有示例文章的 frontmatter：

```mdx
---
title: 第一篇文章
date: '2026-06-19'
tags: ['blog']
draft: false
summary: 写给搜索结果和文章列表看的摘要。
---

正文从这里开始。
```

## 部署

推荐部署到 Vercel。部署前记得把 `data/siteMetadata.js` 里的 `siteUrl` 改成真实域名。

## 来源

模板：<https://github.com/timlrx/tailwind-nextjs-starter-blog>
