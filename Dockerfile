# 使用官方 Node.js 镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 并安装依赖
COPY package*.json ./
RUN npm install

# 复制应用程序源代码
COPY . .

# 告訴別人docker是在哪個端口運行，如果docker-compose.yml有設定，這邊不是一定要寫
# EXPOSE 3038

# 启动应用程序
CMD ["npm", "start"]