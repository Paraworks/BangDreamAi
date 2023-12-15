FROM continuumio/miniconda3

# 更新并安装 Node.js 和 npm
RUN apt-get update && apt-get install -y npm nodejs

# 安装全局 http-server 用于 live2dDriver
RUN npm install -g http-server

# 设置工作目录到 /app
WORKDIR /app

# 克隆 BangDreamAi 仓库
RUN git clone -b docker --single-branch https://github.com/Paraworks/BangDreamAi.git /app/BangDreamAi
WORKDIR /app/BangDreamAi

# 创建 Conda 环境并安装 chatgpt.py 相关依赖
RUN conda create -n chatgpt python=3.8 -y \
    && echo "source activate chatgpt" >> ~/.bashrc \
    && /bin/bash -c "source activate chatgpt && pip install Flask openai requests"

# 安装 live2dDriver 依赖
RUN cd /app/BangDreamAi/live2dDriver && npm install

# 安装 controller 依赖
RUN cd /app/BangDreamAi/controller && npm install

# 暴露所需端口
EXPOSE 8081 3000 8080

# 启动所有服务
CMD /bin/bash -c "source activate chatgpt && cd /app/BangDreamAi && python chatgpt.py &" && \
    /bin/bash -c "cd /app/BangDreamAi/live2dDriver && http-server -p 8081 &" && \
    /bin/bash -c "cd /app/BangDreamAi/controller && node server.js &" && \
    tail -f /dev/null
