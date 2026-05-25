# 使用 Node.js 18 基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 先复制 package.json 和 lock 文件（利用缓存层）
COPY backend/package.json ./

# 安装依赖
RUN npm install --production

# 复制后端源代码
COPY backend/ ./

# 暴露端口（Render 会通过 PORT 环境变量设置端口）
EXPOSE 3000

# 启动应用
CMD ["node", "src/app.js"]
