# 开发日志
```
#命令tree /F /A

\---BangDreamAI
    +---config.py   #配置文件
    |  
    +---manager.py  #启动文件
    |  
    +---README.md   #说明文件
    |   
    \---BangDreamAIFlask    #app包
        +---__init__.py     #初始化文件
        |
        +---models          #模型类
        |
        +---views           #视图类
        |
        +---controllers     #控制类
        |
        +---libs            #外部包
        |
        +---static          #静态文件夹
        |
        +---templates       #模板文件夹
        |
        \---utils           #方法以及类
```
# 技术栈
Flask mysql redis jinja2

```
\---BangDreamAI
|   app.py
|   config.json
|   README.md
|   requirements.txt
|
\---BangDreamAIFlask
    |   __init__.py
    |
    +---controllers
    |       chat.py
    |       config.py
    |       listModels.py
    |       response.py
    |       session.py
    |       __init__.py
    |
    +---models
    |       configManager.py
    |       databaseManager.py
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
    |       chatgpt.py
    |       emotion.py
    |       TTS.py
    |
    \---views
            index.py
            __init__.py
```