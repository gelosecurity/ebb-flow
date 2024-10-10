import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import NotepadSidebar from './components/NotepadSidebar';
import './App.css';

function App() {
  const [currentStockSymbol, setCurrentStockSymbol] = useState('SPY');
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);

  const handleLoadStock = (symbol) => {
    setCurrentStockSymbol(symbol);
  };

  const toggleNotepad = () => {
    setIsNotepadOpen(!isNotepadOpen);
  };

  return (
    <div className="app">
      <Sidebar currentStockSymbol={currentStockSymbol} onLoadStock={handleLoadStock} />
      <MainContent currentStockSymbol={currentStockSymbol} isNotepadOpen={isNotepadOpen} />
      <NotepadSidebar isOpen={isNotepadOpen} onToggle={toggleNotepad} />
    </div>
  );
}

export default App;