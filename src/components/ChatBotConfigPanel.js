import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Box, Typography, Paper, List, ListItem, ListItemText, Collapse, IconButton } from '@mui/material';
import GameScriptEditor from './GameScriptEditor';

function ChatBotComponent() {
    const sessionId = 'test'; // 假设为测试,实际中应从外部获取
    const taskID = 'init'; // 根据实际情况调整  
    const sentenceId = 1; // 根据实际情况调整

    // 配置状态
    const [config, setConfig] = useState({});
    const [bands, setBands] = useState({});
    const [selectedBand, setSelectedBand] = useState('');
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [models, setModels] = useState([]);

    // 聊天状态 
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    // 控制面板展开状态
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);

    // 脚本编辑器展开状态
    const [isEditorPanelOpen, setIsEditorPanelOpen] = useState(false);

    // 信息提示框展开状态
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [infoMessages, setInfoMessages] = useState([]);

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
                const modelPaths = memberModels.map(m => m.replace('..', 'http://localhost:5000'));
                setModels(modelPaths);
            }
        } else if (name === 'speaker') {
            setSelectedMember(value);
            // 更新模型列表
            const memberModels = bands[selectedBand] && bands[selectedBand][value] ? bands[selectedBand][value].models : [];
            const modelPaths = memberModels.map(m => m.replace('..', 'http://localhost:5000'));
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
                setInfoMessages(prevMessages => [...prevMessages, 'Configuration updated!']);
            })
            .catch(error => {
                setInfoMessages(prevMessages => [...prevMessages, 'Error updating configuration: ' + error.message]);
            });
    };

    // 处理聊天消息发送
    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (userInput.trim() !== '') {
            await sendMessage(userInput);
            setUserInput('');
        }
    };

    // 聊天消息发送逻辑
    const sendMessage = async (message) => {
        try {
            const modelDataResponse = await fetch(selectedModel);
            const modelData = await modelDataResponse.json();
            const motions = Object.keys(modelData.motions || {});
            const expressions = (modelData.expressions || []).map(exp => exp.name);
            const chatData = { message, modelPath: selectedModel, motions, expressions };

            const response = await fetch(`http://localhost:5000/api/chat/${sessionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chatData)
            });
            const chatResponse = await response.json();
            if (chatResponse.response) {
                const speakerMessage = {
                    role: 'speaker',
                    content: chatResponse.response.response,
                    motion: chatResponse.response.motion,
                    expression: chatResponse.response.expression
                };
                // 添加用户消息和speaker消息到聊天记录
                setChatMessages(prevMessages => [...prevMessages, { role: 'user', content: message }, speakerMessage]);
            } else {
                setInfoMessages(prevMessages => [...prevMessages, 'Error sending message']);
            }
        } catch (error) {
            setInfoMessages(prevMessages => [...prevMessages, `Error sending message: ${error.message}`]);
        }
    };

    return (
        <Box display="flex" width="100%" height="100vh">
            <Box width="67%" height="100%" p={2}>
                {/* 左侧内容 */}
            </Box>
            <Box width="33%" height="100%" display="flex" flexDirection="column" p={2}>
                <Box flex="1" overflow="auto" mb={2}>
                    {isEditorPanelOpen ? (
                        <GameScriptEditor setInfoMessages={setInfoMessages} />
                    ) : (
                        <>
                            {!isConfigPanelOpen ? (
                                <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <List style={{ overflowY: 'auto', flexGrow: 1 }}>
                                        {chatMessages.map((message, index) => (
                                            <ListItem key={index}>
                                                <Paper
                                                    elevation={3}
                                                    style={{
                                                        padding: '10px',
                                                        marginBottom: '10px',
                                                        backgroundColor: message.role === 'user' ? '#f0f0f0' : '#e0f7fa',
                                                        alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                                                        maxWidth: '70%',
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        {message.role === 'user' ? 'User' : selectedMember}
                                                    </Typography>
                                                    <Typography variant="body1">{message.content}</Typography>
                                                </Paper>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            ) : (
                                <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                                    {/* 控制面板内容 */}
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
                            )}
                        </>
                    )}
                </Box>
                <Box mt={2}>
                    {!isEditorPanelOpen && (
                        <>
                            {!isConfigPanelOpen && (
                                <Box component="form" onSubmit={handleSendMessage} display="flex" alignItems="center">
                                    <TextField
                                        label="Type your message"
                                        variant="outlined"
                                        fullWidth
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                    />
                                    <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px' }}>
                                        Send
                                    </Button>
                                </Box>
                            )}
                            <Button variant="contained" color="secondary" onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} style={{ marginTop: '10px' }}>
                                {isConfigPanelOpen ? 'Back to Chat' : 'Config Panel'}
                            </Button>
                        </>
                    )}
                    <Button variant="contained" color="secondary" onClick={() => setIsEditorPanelOpen(!isEditorPanelOpen)} style={{ marginTop: '10px', marginLeft: '10px' }}>
                        {isEditorPanelOpen ? 'Back to Chat' : 'Open Editor'}
                    </Button>
                    <Button variant="contained" color="info" onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)} style={{ marginTop: '10px', marginLeft: '10px' }}>
                        {isInfoPanelOpen ? 'Close Info' : 'Open Info'}
                    </Button>
                </Box>
                <Collapse in={isInfoPanelOpen} style={{ marginTop: '10px' }}>
                    <Paper elevation={3} style={{ padding: '10px', height: '200px', overflowY: 'auto' }}>
                        {infoMessages.map((message, index) => (
                            <Typography key={index} variant="body2" gutterBottom>{message}</Typography>
                        ))}
                    </Paper>
                </Collapse>
            </Box>
        </Box>
    );
}

export default ChatBotComponent;