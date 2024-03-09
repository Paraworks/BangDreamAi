import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import ModelSelector from './components/ModelSelector'; 
import ChatBotConfigPanel from './components/ChatBotConfigPanel';
//import GameScriptEditor from './components/GameScriptEditor';
import './App.css'; // Or wherever your main stylesheet is

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/*<Route path="/model-selector" element={<ModelSelector />} />*/}
          <Route path="/" element={<ChatBotConfigPanel />} />
          {/*<Route path="/game-script-editor" element={<GameScriptEditor />} />*/}
          {/* Replace 'component' with 'element' and pass component instances */}
          {/* Add more routes for your other components here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
