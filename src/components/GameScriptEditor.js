
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Box, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function GameScriptEditor() {
    const [sessionId, setSessionId] = useState('');
    const [taskId, setTaskId] = useState('');
    const [script, setScript] = useState({});
    const [selectedSentenceId, setSelectedSentenceId] = useState(null);
    const [sentenceData, setSentenceData] = useState({});
    const [bands, setBands] = useState({});
    const [selectedBand, setSelectedBand] = useState('');
    const [selectedMember, setSelectedMember] = useState('');
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [motions, setMotions] = useState([]);
    const [selectedMotion, setSelectedMotion] = useState('');
    const [expressions, setExpressions] = useState([]);
    const [selectedExpression, setSelectedExpression] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/listModels')
            .then(response => setBands(response.data))
            .catch(error => console.error('Error fetching models:', error));
    }, []);

    useEffect(() => {
        if (selectedBand && selectedMember && bands[selectedBand] && bands[selectedBand][selectedMember]) {
            const memberModels = bands[selectedBand][selectedMember].models || [];
            const updatedModels = memberModels.map(model => model.replace('..', 'http://localhost:5000'));
            setModels(updatedModels);
        } else {
            setModels([]);
        }
    }, [selectedBand, selectedMember, bands]);

    useEffect(() => {
        if (selectedModel) {
            axios.get(selectedModel)
                .then(response => {
                    const { motions: modelMotions, expressions: modelExpressions } = response.data;
                    setMotions(Object.keys(modelMotions || {}));
                    setExpressions((modelExpressions || []).map(exp => exp.name));
                })
                .catch(error => console.error('Error fetching model details:', error));
        }
    }, [selectedModel]);

    const loadScript = () => {
        axios.get(`http://127.0.0.1:5000/api/editor/${sessionId}/${taskId}`)
            .then(response => {
                const contents = response.data.contents || {};
                setScript(contents);
                if (Object.keys(contents).length > 0) {
                    const firstSentenceId = Object.keys(contents)[0];
                    setSelectedSentenceId(firstSentenceId);
                    setSentenceData(contents[firstSentenceId]); // 加载句子的原有数据
                    setSelectedBand(contents[firstSentenceId].band || '');
                    setSelectedMember(contents[firstSentenceId].speaker || '');  
                    setSelectedModel(contents[firstSentenceId].modelPath || '');
                    setSelectedMotion(contents[firstSentenceId].text?.motion || '');
                    setSelectedExpression(contents[firstSentenceId].text?.expression || '');
                } else {
                    createNewScript();
                }
            })
            .catch(error => {
                console.error('Error fetching script:', error);
                createNewScript();
            });
    };

    const createNewScript = () => {
        const newScript = {
            [getDefaultSentenceId(true)]: getDefaultSentenceData(true)
        };
        setScript(newScript);
        setSelectedSentenceId(getDefaultSentenceId(true));
        setSentenceData(getDefaultSentenceData(true));
    };
    
    const getDefaultSentenceId = (reset = false) => {
        const sentenceNumber = reset ? 1 : Object.keys(script).length + 1;
        return `sentence_${sentenceNumber.toString().padStart(7, '0')}`;
    };

    const getDefaultSentenceData = (reset = false) => {
        const sentenceNumber = reset ? 1 : Object.keys(script).length + 1;
        return {
            sessionID: sessionId,
            taskID: taskId,
            sentenceId: sentenceNumber,
            playerID: 1,
            modelPath: selectedModel,
            ttsApiBaseUrl: "http://127.0.0.1:8000/?is_chat=false",
            textApiBaseUrl: "http://127.0.0.1:5000/api/sentence/test",
            audiobaseUrl: "/api/file/",
            audioname: `${taskId}_${(Object.keys(script).length + 1).toString().padStart(7, '0')}.wav`,
            text: {
                expression: selectedExpression,
                motion: selectedMotion,
                response: "",
            },
            frequence: 0.5,
            volum: 70,
            duration: 2,
            background: "114.png",
            speaker: selectedMember,
            band: selectedBand,
            positionX: 300,
            positionY: 50,
            stopBreath: 0,
            mouseTrack: 1,
            scale: 0.3
        };
    };

    const handleSentenceChange = (event) => {
        const { name, value } = event.target;
        if (name.includes('.')) {
            const [parentKey, childKey] = name.split('.');
            setSentenceData({
                ...sentenceData,
                [parentKey]: {
                    ...sentenceData[parentKey],
                    [childKey]: value
                }
            });
            setScript({
                ...script,
                [selectedSentenceId]: {
                    ...sentenceData,
                    [parentKey]: {
                        ...sentenceData[parentKey],
                        [childKey]: value
                    }
                },
            });
        } else {
            setSentenceData({ ...sentenceData, [name]: value });
            setScript({
                ...script,
                [selectedSentenceId]: {
                    ...sentenceData,
                    [name]: value,
                },
            });
        }
    };

    const handleSubmit = () => {
        const updatedScript = {
            ...script,
            [selectedSentenceId]: sentenceData
        };
        const scriptData = {
            sessionID: sessionId,
            taskID: taskId,
            contents: updatedScript
        };
    
        axios.post(`http://127.0.0.1:5000/api/editor/${sessionId}/${taskId}`, scriptData)
            .then(() => alert('Script saved successfully'))
            .catch(error => console.error('Error saving script:', error));
    };

    const addSentence = () => {
        const newSentenceId = getDefaultSentenceId();
        const newSentenceData = {
            ...getDefaultSentenceData(),
            band: selectedBand,
            speaker: selectedMember,
            modelPath: selectedModel,
            text: {
                ...getDefaultSentenceData().text,
                motion: selectedMotion,
                expression: selectedExpression
            }
        };
        setSelectedSentenceId(newSentenceId);
        setSentenceData(newSentenceData);
        setScript({ ...script, [newSentenceId]: newSentenceData });
    };

    const deleteSentence = () => {
        if (!script || !selectedSentenceId) {
            console.warn('Script or selectedSentenceId is undefined or null.');
            return;
        }
    
        const updatedScript = { ...script };
        delete updatedScript[selectedSentenceId];
    
        if (Object.keys(updatedScript).length === 0) {
            const newSentenceId = getDefaultSentenceId();
            const newSentenceData = getDefaultSentenceData();
            
            if (newSentenceData) {
                updatedScript[newSentenceId] = newSentenceData;
                setSelectedSentenceId(newSentenceId);
                setSentenceData(newSentenceData);
            } else {
                console.warn('Default sentence data is undefined or null.');
            }
        } else {
            const newScriptKeys = Object.keys(updatedScript);
            if (newScriptKeys.length > 0) {
                setSelectedSentenceId(newScriptKeys[0]);
                setSentenceData(updatedScript[newScriptKeys[0]]);
            }
        }
    
        setScript(updatedScript);
    };

    const handleAudioUpload = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`http://127.0.0.1:5000/api/upload/${sessionId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'uploadfile': sentenceData.audioname
            }
        })
        .then(response => {
            console.log('File uploaded successfully');
            // 更新音频URL
            updateAudioUrl();
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    };
    const getAudioFromTTS = () => {
        const ttsApiBaseUrl = sentenceData.ttsApiBaseUrl;
        const speaker = sentenceData.speaker;
        const text = sentenceData.text.response;
        
        axios.get(`${ttsApiBaseUrl}&speaker=${encodeURIComponent(speaker)}&text=${encodeURIComponent(text)}`, {
            responseType: 'blob'
        })
        .then(response => {
            const audioBlob = new Blob([response.data], { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('file', audioBlob, sentenceData.audioname);
            
            // 将音频上传到后端
            axios.post(`http://127.0.0.1:5000/api/upload/${sessionId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'uploadfile': sentenceData.audioname
                }
            })
            .then(response => {
                console.log('TTS audio uploaded successfully');
                // 更新音频URL
                updateAudioUrl();
            })
            .catch(error => {
                console.error('Error uploading TTS audio:', error);
            });
        })
        .catch(error => {
            console.error('Error fetching audio from TTS:', error);
        });
    };

    const updateAudioUrl = () => {
        // 获取最新的音频URL
        axios.get(`http://127.0.0.1:5000/api/file/${sessionId}/${sentenceData.audioname}`, {
            responseType: 'blob'
        })
        .then(response => {
            const audioBlob = new Blob([response.data], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setSentenceData({
                ...sentenceData,
                audioUrl: audioUrl
            });
        })
        .catch(error => {
            console.error('Error fetching audio URL:', error);
        });
    };



    const handleBackgroundUpload = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`http://127.0.0.1:5000/upload/${sessionId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'uploadfile': sentenceData.background
            }
        })
        .then(response => {
            console.log('File uploaded successfully');
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Typography variant="h6">Game Script Editor</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Session ID"
                        value={sessionId}
                        onChange={(e) => setSessionId(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Task ID"
                        value={taskId}
                        onChange={(e) => setTaskId(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={loadScript} variant="contained">Load/Create Article</Button>
                </Grid>
                {selectedSentenceId !== null && (
                    <>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Sentence</InputLabel>
                                <Select
                                    value={selectedSentenceId}
                                    label="Sentence"
                                    onChange={(e) => {
                                        const newSelectedSentenceId = e.target.value;
                                        setSelectedSentenceId(newSelectedSentenceId);
                                        setSentenceData(script[newSelectedSentenceId]); // 加载句子的原有数据
                                        setSelectedBand(script[newSelectedSentenceId].band || '');
                                        setSelectedMember(script[newSelectedSentenceId].speaker || '');
                                        setSelectedModel(script[newSelectedSentenceId].modelPath || '');
                                        setSelectedMotion(script[newSelectedSentenceId].text?.motion || '');
                                        setSelectedExpression(script[newSelectedSentenceId].text?.expression || '');
                                    }}
                                >
                                    {Object.keys(script).map((id) => (
                                        <MenuItem key={id} value={id}>{id}</MenuItem>
                                    ))}
                                </Select>

                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel>Band</InputLabel>
                                <Select
                                    value={selectedBand}
                                    name="band"
                                    label="Band"
                                    onChange={(e) => {
                                        const selectedBand = e.target.value;
                                        setSelectedBand(selectedBand);
                                        setSentenceData({ ...sentenceData, band: selectedBand });
                                        setScript({
                                            ...script,
                                            [selectedSentenceId]: {
                                                ...sentenceData,
                                                band: selectedBand
                                            }
                                        });
                                    }}
                                >
                                    {Object.keys(bands).map(band => (
                                        <MenuItem key={band} value={band}>{band}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel>Member</InputLabel>
                                <Select
                                    value={selectedMember}
                                    name="speaker"
                                    label="Member"
                                    onChange={(e) => {
                                        const selectedMember = e.target.value;
                                        setSelectedMember(selectedMember);
                                        setSentenceData({ ...sentenceData, speaker: selectedMember });
                                        setScript({
                                            ...script,
                                            [selectedSentenceId]: {
                                                ...sentenceData,
                                                speaker: selectedMember
                                            }
                                        });
                                    }}
                                    disabled={!selectedBand}
                                >
                                    {selectedBand && bands[selectedBand] && Object.keys(bands[selectedBand]).map(member => (
                                        <MenuItem key={member} value={member}>{member}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel>Model</InputLabel>
                                <Select
                                    value={selectedModel}
                                    name="modelPath"
                                    label="Model"
                                    onChange={(e) => {
                                        const selectedModel = e.target.value;
                                        setSelectedModel(selectedModel);
                                        setSentenceData({ ...sentenceData, modelPath: selectedModel });
                                        setScript({
                                            ...script,
                                            [selectedSentenceId]: {
                                                ...sentenceData,
                                                modelPath: selectedModel
                                            }
                                        });
                                    }}
                                >
                                    {models.map(model => (
                                        <MenuItem key={model} value={model}>{model}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Motion</InputLabel>
                                <Select
                                    value={selectedMotion}
                                    name="text.motion"
                                    label="Motion"
                                    onChange={(e) => {
                                        const selectedMotion = e.target.value;
                                        setSelectedMotion(selectedMotion);
                                        setSentenceData({
                                            ...sentenceData,
                                            text: {
                                                ...sentenceData.text,
                                                motion: selectedMotion
                                            }
                                        });
                                        setScript({
                                            ...script,
                                            [selectedSentenceId]: {
                                                ...sentenceData,
                                                text: {
                                                    ...sentenceData.text,
                                                    motion: selectedMotion
                                                }
                                            }
                                        });
                                    }}
                                >
                                    {motions.map(motion => (
                                        <MenuItem key={motion} value={motion}>{motion}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
    <FormControl fullWidth>
        <InputLabel>Expression</InputLabel>
        <Select
            value={selectedExpression}
            name="text.expression"
            label="Expression"
            onChange={(e) => {
                const selectedExpression = e.target.value;
                setSelectedExpression(selectedExpression);
                setSentenceData({
                    ...sentenceData,
                    text: {
                        ...sentenceData.text,
                        expression: selectedExpression
                    }
                });
                setScript({
                    ...script,
                    [selectedSentenceId]: {
                        ...sentenceData,
                        text: {
                            ...sentenceData.text,
                            expression: selectedExpression
                        }
                    }
                });
            }}
        >
            {expressions.map(expression => (
                <MenuItem key={expression} value={expression}>{expression}</MenuItem>
            ))}
        </Select>
    </FormControl>
</Grid>
<Grid item xs={12}>
    <TextField
        fullWidth
        margin="normal"
        label="Response"
        name="text.response"
        value={sentenceData.text.response || ''}
        onChange={handleSentenceChange}
        multiline
        rows={5}
    />
</Grid>
<Grid item xs={12}>
                <input
                    accept="audio/*"
                    style={{ display: 'none' }}
                    id="audio-upload"
                    type="file"
                    onChange={handleAudioUpload}
                />
                <label htmlFor="audio-upload">
                    <Button variant="contained" component="span">
                        Upload Audio
                    </Button>
                </label>
                <Button variant="contained" onClick={getAudioFromTTS} style={{ marginLeft: '10px' }}>
                    Get Audio from TTS
                </Button>
                {sentenceData.audioUrl && (
                    <audio controls src={sentenceData.audioUrl} style={{ marginTop: '10px' }} />
                )}
            </Grid>
<Grid item xs={12}>
    <input
        accept="image/*"
        style={{ display: 'none' }}
        id="background-upload"
        type="file"
        onChange={handleBackgroundUpload}
    />
    <label htmlFor="background-upload">
        <Button variant="contained" component="span">
            Upload Background
        </Button>
    </label>
</Grid>
<Grid item xs={12}>
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Advanced Options</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={2}>
                {Object.keys(sentenceData).map((key) => {
                    if (key !== 'band' && key !== 'speaker' && key !== 'modelPath' && key !== 'text' && key !== 'audioname' && key !== 'background' && key !== 'sentenceId' && key !== 'sessionID' && key !== 'taskID') {
                        return (
                            <Grid item xs={6} key={key}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label={key}
                                    name={key}
                                    value={sentenceData[key] || ''}
                                    onChange={handleSentenceChange}
                                />
                            </Grid>
                        );
                    }
                    return null;
                })}
            </Grid>
        </AccordionDetails>
    </Accordion>
</Grid>
<Grid item xs={12}>
    <Button onClick={handleSubmit} variant="contained">Save Script</Button>
    <Button onClick={addSentence} variant="outlined" sx={{ ml: 2 }}>Add Sentence</Button>
    <Button onClick={deleteSentence} variant="outlined" color="error" sx={{ ml: 2 }}>Delete Sentence</Button>
</Grid>
</>
)}
</Grid>
</Box>
);
}

export default GameScriptEditor;

