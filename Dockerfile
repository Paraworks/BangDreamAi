# 使用带有 Node.js 和 Python 的基础镜像
FROM cimg/python:3.11-node

# 设置工作目录
WORKDIR /app

# 克隆 BangDreamAi 仓库
RUN git clone -b docker --single-branch https://github.com/Paraworks/BangDreamAi.git

# 安装 chatgpt.py 相关依赖
RUN pip install Flask openai

# 安装 http-server 用于 live2dDriver
RUN npm install -g http-server

# 安装 live2dDriver 依赖
RUN cd /app/BangDreamAi/live2dDriver \
    && npm install

# 克隆 MyGO_VIts-bert 仓库并安装依赖
RUN git clone https://huggingface.co/spaces/Mahiruoshi/MyGO_VIts-bert \
    && cd /app/MyGO_VIts-bert \
    && pip install -r requirements.txt \
    && pip install Flask Flask-CORS

# 安装 controller 依赖
RUN cd /app/BangDreamAi/controller \
    && npm install

# 暴露需要的端口
EXPOSE 8081 5000 3000

# 启动所有服务
CMD sh -c 'cd /app/BangDreamAi && python chatgpt.py & \
           cd /app/BangDreamAi/live2dDriver && http-server -p 8081 & \
           cd /app/MyGO_VIts-bert && python server.py & \
           cd /app/BangDreamAi/controller && node server.js & \
           tail -f /dev/null'
