# 部署到 Netlify 指南

Netlify 是部署 Next.js 应用的优秀平台，提供全球 CDN、自动部署和边缘函数支持。

## 🚀 快速部署

### 方法一：通过 Git 部署（推荐）

1. **推送代码到 GitHub**
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
gh repo create ai-native-ip-frontend --public --push
```

2. **在 Netlify 部署**
   - 访问 [Netlify](https://app.netlify.com/)
   - 点击 "Add new site" → "Import an existing project"
   - 选择 GitHub 仓库
   - 构建设置会自动识别（使用 netlify.toml）
   - 点击 "Deploy site"

### 方法二：使用 Netlify CLI

1. **安装 CLI**
```bash
npm install -g netlify-cli
```

2. **登录**
```bash
netlify login
```

3. **初始化项目**
```bash
netlify init
```

4. **部署**
```bash
# 预览部署
netlify deploy --build

# 生产部署
netlify deploy --build --prod
```

### 方法三：拖拽部署（静态导出）

1. **修改 next.config.js 为静态导出**
```javascript
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  // 移除 rewrites，使用 _redirects 文件
}
```

2. **创建 _redirects 文件**
```
/api/*  https://ai-native-ip-production.up.railway.app/api/:splat  200
/*      /index.html                                                200
```

3. **构建并部署**
```bash
npm run build
# 将 dist 文件夹拖拽到 Netlify 控制台
```

---

## ⚙️ 配置说明

### netlify.toml 详解

```toml
[build]
  command = "npm run build"    # 构建命令
  publish = ".next"            # 发布目录（Next.js 默认）

# API 代理配置 - 解决跨域问题
[[redirects]]
  from = "/api/*"
  to = "https://ai-native-ip-production.up.railway.app/api/:splat"
  status = 200                 # 使用 200 进行重写（rewrite）
  force = true
```

### 环境变量配置

**推荐**：使用 **完整 Railway 地址**（与 `netlify.toml` 中 `build.environment` 一致），让浏览器直连 API，避免 Netlify 反向代理超时出现 **502 / Application failed to respond**（常见于 `getIngestStatus` 轮询）。

在 Netlify Dashboard → Site settings → Environment variables 中：

```
NEXT_PUBLIC_API_URL = https://ai-native-ip-production.up.railway.app/api/v1
```

若曾误设为 `NEXT_PUBLIC_API_URL=/api/v1`（走本站代理），请**删除或改成上面完整 URL**，并重新触发部署。

CLI：

```bash
netlify env:set NEXT_PUBLIC_API_URL https://ai-native-ip-production.up.railway.app/api/v1
```

---

## 🔧 注意事项

### 1. Next.js 运行时

Netlify 使用 `@netlify/plugin-nextjs` 自动支持：
- ✅ Server-Side Rendering (SSR)
- ✅ API Routes
- ✅ Image Optimization
- ✅ Middleware
- ✅ Rewrites/Redirects

### 2. 图片优化

如果使用 Next.js Image 组件，需要在 `next.config.js` 中配置：

```javascript
images = {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'ai-native-ip-production.up.railway.app',
    },
  ],
}
```

### 3. 缓存策略

已在 `netlify.toml` 中配置静态资源长期缓存：
- JS/CSS: 1年
- 图片/字体: 1年

### 4. 预览部署

每个 Pull Request 会自动创建预览链接，方便测试。

---

## 🌐 自定义域名

1. 在 Netlify Dashboard → Domain settings
2. 点击 "Add custom domain"
3. 输入你的域名（如 `ip-factory.yourdomain.com`）
4. 按照提示配置 DNS

### DNS 配置示例（Cloudflare）

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | ip-factory | your-site.netlify.app | Auto |

---

## 🛠️ 故障排查

### 问题：构建失败

**检查点**：
```bashn# 本地测试构建
npm run build

# 检查 Node 版本
node -v  # 需要 18+
```

**常见解决**：
- 在 Netlify Dashboard 设置 Node 版本：`NODE_VERSION = 18`
- 清除缓存重新部署

### 问题：API 请求 404

**检查点**：
- 确认 `netlify.toml` 中的 redirects 配置
- 检查浏览器 Network 面板，确认请求路径是 `/api/...`

**调试**：
```bash
# 本地测试 redirects
netlify dev
```

### 问题：样式丢失

**解决**：
```bash
rm -rf .next node_modules
npm install
npm run build
```

### 问题：图片不显示

**解决**：
```javascript
// next.config.js
images = {
  unoptimized: true,  // 静态导出时使用
}
```

---

## 📊 性能优化

### 启用 Netlify Edge

```toml
# netlify.toml
[build]
  edge_functions = "netlify/edge-functions"
```

### 启用 Analytics

在 Netlify Dashboard → Analytics 中启用，查看：
- 访问量
- 来源分析
- 性能指标

---

## 🔄 持续部署

配置 Git 集成后：

1. **开发分支** → 自动部署预览链接
2. **合并到 main** → 自动部署生产环境
3. **PR 评论** → 自动生成预览链接

---

## 📱 部署状态检查

部署后检查清单：

- [ ] 首页加载正常
- [ ] Dashboard 数据显示
- [ ] 侧边栏导航正常
- [ ] IP 管理页面加载
- [ ] Agent 配置页面加载
- [ ] API 请求成功（浏览器 DevTools → Network）

---

## 💡 最佳实践

1. **使用 Git 集成**：自动部署 + 预览链接
2. **配置分支预览**：main 分支 = 生产，其他分支 = 预览
3. **设置部署通知**：Slack/Email 通知
4. **启用表单检测**：自动处理 HTML 表单
5. **配置重定向规则**：SEO 友好的 URL

---

## 📚 参考资源

- [Netlify Next.js 文档](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)
- [Netlify Headers](https://docs.netlify.com/routing/headers/)
