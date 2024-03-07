import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function ModelSelector() {
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
        setSelectedModel('');
        setMotions([]);
        setExpressions([]);
    }, [selectedBand, selectedMember, bands]);


    useEffect(() => {
        if (selectedModel) {
            // Correctly adjust the endpoint and logic based on your server setup.
            axios.get(selectedModel.replace('..', 'http://localhost:5000')) // You need to adjust the server route to serve the model JSON correctly.
                .then(response => {
                    const { motions: modelMotions, expressions: modelExpressions } = response.data;
                    setMotions(Object.keys(modelMotions || {}));
                    setExpressions((modelExpressions || []).map(exp => exp.name));
                })
                .catch(error => console.error('Error fetching model details:', error));
        }
    }, [selectedModel]);

    return (
        <div>
            {/* Selectors for Bands, Members, and Models */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Band</InputLabel>
                <Select value={selectedBand} label="Band" onChange={(e) => setSelectedBand(e.target.value)}>
                    {Object.keys(bands).map(band => (
                        <MenuItem key={band} value={band}>{band}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Member</InputLabel>
                <Select value={selectedMember} label="Member" onChange={(e) => setSelectedMember(e.target.value)} disabled={!selectedBand}>
                    {selectedBand && Object.keys(bands[selectedBand]).map(member => (
                        <MenuItem key={member} value={member}>{member}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Model</InputLabel>
                <Select value={selectedModel} label="Model" onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedMember}>
                    {models.map(model => (
                        <MenuItem key={model} value={model}>{model}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Selectors for Motions and Expressions */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Motion</InputLabel>
                <Select value={selectedMotion} label="Motion" onChange={(e) => setSelectedMotion(e.target.value)} disabled={!selectedModel}>
                    {motions.map(motion => (
                        <MenuItem key={motion} value={motion}>{motion}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Expression</InputLabel>
                <Select value={selectedExpression} label="Expression" onChange={(e) => setSelectedExpression(e.target.value)} disabled={!selectedModel}>
                    {expressions.map(expression => (
                        <MenuItem key={expression} value={expression}>{expression}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default ModelSelector;
