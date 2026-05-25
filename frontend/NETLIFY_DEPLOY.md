# Netlify 部署指南

## 部署方式

### 方式一：拖拽部署（推荐）

1. **构建项目**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **拖拽部署**
   - 访问 [Netlify](https://app.netlify.com/)
   - 登录后，点击 "Add new site" -> "Deploy manually"
   - 将 `dist` 文件夹直接拖拽到上传区域
   - 等待部署完成

### 方式二：Git 连接部署

1. **推送代码到 Git 仓库**
   ```bash
   git add .
   git commit -m "Add Netlify configuration"
   git push
   ```

2. **连接 Netlify**
   - 访问 [Netlify](https://app.netlify.com/)
   - 点击 "Add new site" -> "Import an existing project"
   - 选择 Git 提供商并授权
   - 选择项目仓库
   - 配置构建设置（已自动配置）：
     - Build command: `npm run build`
     - Publish directory: `dist`
   - 点击 "Deploy site"

## 环境变量配置

在 Netlify 控制台配置环境变量：

1. 进入 Site settings -> Environment variables
2. 添加以下变量：
   - `VITE_API_BASE_URL`: API 基础 URL
   - `VITE_APP_TITLE`: 应用标题

## 注意事项

1. **API 地址配置**
   - 当前 API 地址：`https://rn6qg920-3001.jpe1.devtunnels.ms/api/v1`
   - 生产环境需要配置正确的 API 地址
   - 可以使用 Netlify Functions 作为 API 代理

2. **路由配置**
   - 已配置 SPA 路由重定向
   - 所有路由都会重定向到 `index.html`

3. **缓存策略**
   - 静态资源已配置长期缓存
   - HTML 文件不缓存

4. **自定义域名**
   - 在 Site settings -> Domain management 中配置
   - 可以添加自定义域名

## 文件说明

- `netlify.toml`: Netlify 配置文件
- `public/_redirects`: 路由重定向规则
- `vite.config.js`: Vite 构建配置

## 故障排查

1. **构建失败**
   - 检查 Node.js 版本（推荐 18.x）
   - 检查依赖是否正确安装
   - 查看构建日志

2. **页面空白**
   - 检查 `base` 配置是否正确
   - 检查路由重定向是否生效
   - 检查控制台错误信息

3. **API 请求失败**
   - 检查 API 地址是否正确
   - 检查 CORS 配置
   - 考虑使用 Netlify Functions 代理
