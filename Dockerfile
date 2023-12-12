# 使用带有 Node.js 和 Python 的基础镜像
FROM nikolaik/python-nodejs:latest

# 设置工作目录
WORKDIR /app

# 克隆 BangDreamAi 仓库
RUN git clone https://github.com/Paraworks/BangDreamAi

# 安装 live2dDriver 依赖
RUN cd /app/BangDreamAi/live2dDriver \
    && npm install

# 安装 MyGO_VIts-bert 依赖
RUN cd /app/BangDreamAi \
    && git clone https://huggingface.co/spaces/Mahiruoshi/MyGO_VIts-bert \
    && cd MyGO_VIts-bert \
    && pip install -r requirements.txt \
    && pip install Flask Flask-CORS

# 安装 chatgpt.py 相关依赖
RUN pip install Flask openai

# 安装 controller 依赖
RUN cd /app/BangDreamAi/controller \
    && npm install

# 暴露需要的端口
EXPOSE 5173 3000

# 复制启动脚本
COPY BangDream_launch.sh /app/BangDreamAi/BangDream_launch.sh
RUN chmod +x /app/BangDreamAi/BangDream_launch.sh

# 启动脚本来运行所有服务
CMD ["/app/BangDreamAi/BangDream_launch.sh"]
