import json
    
class Config:
    def __init__(self,config_name):
        with open(config_name, encoding='utf-8') as f:
            config_values =  json.load(f)
        for key,value in config_values.items():
            setattr(self,key,value)
    
    def read(self):
        return {attr: getattr(self, attr) for attr in self.__dict__}