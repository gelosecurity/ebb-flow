import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Command } from 'cmdk';
import { FaSearch } from 'react-icons/fa'; // Make sure to install react-icons
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import NotepadSidebar from './components/NotepadSidebar';
import './App.css';
import './CommandPalette.css';

function App() {
  const [currentStockSymbol, setCurrentStockSymbol] = useState('SPY');
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleLoadStock = useCallback((symbol) => {
    if (symbol) {
      setCurrentStockSymbol(symbol.toUpperCase());
      setOpen(false);
      setInputValue('');
    }
  }, []);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLoadStock(inputValue);
    }
  };

  // Focus on the input field when the command palette opens
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Toggle the command palette when CMD+K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const toggleNotepad = () => {
    setIsNotepadOpen(!isNotepadOpen);
  };

  return (
    <div className="app">
      <Command.Dialog open={open} onOpenChange={setOpen}>
        <Command.Input placeholder="Enter ticker symbol" value={inputValue} onValueChange={handleInputChange} />
        <Command.List>
          <Command.Item onSelect={() => handleLoadStock(inputValue)}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaSearch style={{ marginRight: '10px' }} />
              Load Symbol: {inputValue}
            </div>
          </Command.Item>
        </Command.List>
      </Command.Dialog>
      <Sidebar currentStockSymbol={currentStockSymbol} onLoadStock={handleLoadStock} />
      <MainContent currentStockSymbol={currentStockSymbol} isNotepadOpen={isNotepadOpen} />
      <NotepadSidebar isOpen={isNotepadOpen} onToggle={toggleNotepad} />
    </div>
  );
}

export default App;