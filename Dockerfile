FROM node:18-alpine
WORKDIR /tmp/frontend

# 构建前端
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 安装后端
WORKDIR /app
COPY backend/package.json ./
RUN npm install --omit=dev
COPY backend/ ./

# 复制前端产物
RUN cp -r /tmp/frontend/dist ./public

EXPOSE 3000
CMD ["node", "src/app.js"]
