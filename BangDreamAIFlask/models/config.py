import json
    
class Config:
    def __init__(self,config_name):
        with open(config_name) as f:
            config_values =  json.load(f)
        for key,value in config_values.items():
            setattr(self,key,value)