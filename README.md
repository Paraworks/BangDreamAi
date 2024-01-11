# 开发日志
# 技术栈
Flask sqlite jinja2
# 结构
```
\---BangDreamAI
|   app.py
|   config.json
|   database_test.py
|   database_usecase.py
|   README.md
|   requirements.txt
|
\---BangDreamAIFlask
    |   __init__.py
    |
    +---controllers
    |       content.py
    |       listModels.py
    |       response.py
    |       sentence.py
    |       session.py
    |       __init__.py
    |
    +---models
    |       config.py
    |       database.py
    |
    +---static
    |   +---components
    |   |       index.js
    |   |       live2d.js
    |   |
    |   +---library
    |   |       iconfont.js
    |   |       live2d.min.js
    |   |       live2dcubismcore.js
    |   |       live2dcubismcore.js.map
    |   |       live2dcubismcore.min.js
    |   |       pixi.min.js
    |   |
    |   \---Resources
    |       +---001_2018_halloween
    |       |   |   model.json
    |       |   |
    |       |   \---live2d
    |       |           001_general_angry01.exp
    |       |           ......
    |       |           001_general_f18.exp
    |       |           001_general_gattsu01.mtn
    |       |           ......
    |       |           001_live_event_47_ssr_wink01.mtn
    |       |           kasumi_2018halloween.moc
    |       |           kasumi_2018halloween.physics
    |       |           texture_00.png
    |       |
    |       \---001_school_summer
    |           |   model.json
    |           |
    |           \---live2d
    |                   001_general_angry01.exp
    |                   ......
    |                   001_general_f18.exp
    |                   001_general_gattsu01.mtn
    |                   ......
    |                   001_live_event_47_ssr_wink01.mtn
    |                   kasumi_school_summer.moc
    |                   kasumi_school_summer.physics
    |                   texture_00.png
    |
    +---templates
    |   +---front
    |   |       base.html
    |   |       base_header.html
    |   |       index.html
    |   |
    |   \---live2d
    |           base.html
    |
    +---utils
    |       chat.py
    |       emotion.py
    |       TTS.py
    |
    \---views
            index.py
            __init__.py

```