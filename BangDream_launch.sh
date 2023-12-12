#!/bin/bash

# 启动 live2dDriver
(cd /app/BangDreamAi/live2dDriver && npm run dev) &

# 启动 MyGO_VIts-bert
(cd /app/BangDreamAi/MyGO_VIts-bert && python server.py) &

# 启动 chatgpt
(cd /app/BangDreamAi && python chatgpt.py) &

# 启动 controller
(cd /app/BangDreamAi/controller && node server.js) &

# 保持容器

tail -f /dev/null
