# ==================== 阶段1：构建前端 ====================
FROM node:18-alpine AS frontend-builder

WORKDIR /frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ==================== 阶段2：后端运行镜像 ====================
FROM node:18-alpine

WORKDIR /app

# 复制后端依赖配置并安装
COPY backend/package.json ./
RUN npm install --production

# 复制后端源码
COPY backend/ ./

# 从前端构建阶段复制打包好的静态文件
COPY --from=frontend-builder /frontend/dist ./public

# Railway / Render 通过 PORT 环境变量设置端口
EXPOSE 3000

CMD ["node", "src/app.js"]
