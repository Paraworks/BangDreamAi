import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Box } from '@mui/material';

function ChatBotConfigPanel() {
    const sessionId = 'test'; // 假设为测试，实际中应从外部获取
    const taskID = 'init'; // 根据实际情况调整
    const sentenceId = 1; // 根据实际情况调整

    // 配置状态
    const [config, setConfig] = useState({});
    const [bands, setBands] = useState({});
    const [selectedBand, setSelectedBand] = useState(''); // 已定义
    const [selectedMember, setSelectedMember] = useState(''); // 已定义
    const [selectedModel, setSelectedModel] = useState(''); // 已定义
    const [models, setModels] = useState([]);

    // 初始化加载
    useEffect(() => {
        // 加载乐队列表
        axios.get('http://localhost:5000/api/listModels')
            .then(response => {
                setBands(response.data);
                // 预先加载已存在的配置
                axios.get(`http://localhost:5000/api/content/${sessionId}/${taskID}/${sentenceId}`)
                    .then(res => {
                        const initialConfig = res.data || {};
                        setConfig(initialConfig);
                        setSelectedBand(initialConfig.band || '');
                        setSelectedMember(initialConfig.speaker || '');
                        setSelectedModel(initialConfig.modelPath || '');
                        // 在加载乐队信息后设置模型路径
                        if (initialConfig.band && initialConfig.speaker && response.data[initialConfig.band] && response.data[initialConfig.band][initialConfig.speaker]) {
                            const modelPaths = response.data[initialConfig.band][initialConfig.speaker].models.map(m => m.replace('..', 'http://localhost:5000/static/Resources'));
                            setModels(modelPaths);
                        }
                    })
                    .catch(error => console.error('Error fetching configuration:', error));
            })
            .catch(error => console.error('Error fetching bands:', error));
    }, [sessionId, taskID, sentenceId]);

    // 处理表单变化
    const handleConfigChange = (event) => {
        const { name, value } = event.target;
        setConfig({ ...config, [name]: value });

        if (name === 'band') {
            setSelectedBand(value);
            // 确定选中的乐队有成员
            const selectedBandMembers = bands[value];
            if (selectedBandMembers) {
                const firstMember = Object.keys(selectedBandMembers)[0];
                setSelectedMember(firstMember);
                setSelectedModel(''); // 重置模型选择
                // 更新模型列表
                const memberModels = selectedBandMembers[firstMember] ? selectedBandMembers[firstMember].models : [];
                const modelPaths = memberModels.map(m => m.replace('..', 'http://localhost:5000/static/Resources'));
                setModels(modelPaths);
            }
        } else if (name === 'speaker') {
            setSelectedMember(value);
            // 更新模型列表
            const memberModels = bands[selectedBand] && bands[selectedBand][value] ? bands[selectedBand][value].models : [];
            const modelPaths = memberModels.map(m => m.replace('..', 'http://localhost:5000/static/Resources'));
            setModels(modelPaths);
            setSelectedModel(''); // 重置模型选择
        } else if (name === 'modelPath') {
            setSelectedModel(value);
        }
    };

    // 处理表单提交
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`http://localhost:5000/api/content/${sessionId}/${taskID}/${sentenceId}`, config)
            .then(response => {
                alert('Configuration updated!');
            })
            .catch(error => console.error('Error updating configuration:', error));
    };

    return (
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
                <InputLabel>Band</InputLabel>
                <Select value={selectedBand} name="band" label="Band" onChange={handleConfigChange}>
                    {Object.keys(bands).map(band => (
                        <MenuItem key={band} value={band}>{band}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Member</InputLabel>
                <Select value={selectedMember} name="speaker" label="Member" onChange={handleConfigChange} disabled={!selectedBand}>
                    {selectedBand && bands[selectedBand] && Object.keys(bands[selectedBand]).map(member => (
                        <MenuItem key={member} value={member}>{member}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Model</InputLabel>
                <Select value={selectedModel} name="modelPath" label="Model" onChange={handleConfigChange} disabled={!selectedMember}>
                    {models.map(model => (
                        <MenuItem key={model} value={model}>{model}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField label="TTS API Base URL" variant="outlined" fullWidth margin="normal" name="ttsApiBaseUrl" value={config.ttsApiBaseUrl || ''} onChange={handleConfigChange} />
            <TextField label="Text API Base URL" variant="outlined" fullWidth margin="normal" name="textApiBaseUrl" value={config.textApiBaseUrl || ''} onChange={handleConfigChange} />
            <TextField label="Scale" type="number" variant="outlined" fullWidth margin="normal" name="scale" value={config.scale || ''} onChange={handleConfigChange} />
            <TextField label="Background" variant="outlined" fullWidth margin="normal" name="background" value={config.background || ''} onChange={handleConfigChange} />
            <TextField label="Mouse Track" type="number" variant="outlined" fullWidth margin="normal" name="mouseTrack" value={config.mouseTrack || ''} onChange={handleConfigChange} />
            <TextField label="Frequency" type="number" variant="outlined" fullWidth margin="normal" name="frequence" value={config.frequence || ''} onChange={handleConfigChange} />
            <TextField label="Volume" type="number" variant="outlined" fullWidth margin="normal" name="volum" value={config.volum || ''} onChange={handleConfigChange} />
            <Button type="submit" variant="contained" color="primary">Submit Changes</Button>
        </Box>
    );
}

export default ChatBotConfigPanel;
