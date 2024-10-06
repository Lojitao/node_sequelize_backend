# 使用官方 Node.js 镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 并安装依赖
COPY package*.json ./
RUN npm install && npm prune --production
#RUN npm ci && npm prune --production
# 复制应用程序源代码
COPY . .

# 启动应用程序
CMD ["npm", "start"]