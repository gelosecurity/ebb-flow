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
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleLoadStock = useCallback((symbol) => {
    if (symbol) {
      const upperSymbol = symbol.toUpperCase();
      setCurrentStockSymbol(upperSymbol);
      
      // Update recent searches
      setRecentSearches(prev => {
        const updated = [upperSymbol, ...prev.filter(s => s !== upperSymbol)].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        return updated;
      });

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

  // Add event listener to the window object instead of document
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  const toggleNotepad = () => {
    setIsNotepadOpen(!isNotepadOpen);
  };

  return (
    <div className="app">
      <Command.Dialog 
        open={open} 
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          setIsCommandPaletteOpen(isOpen); // Update overlay state
        }}
      >
        <Command.Input 
          placeholder="Enter ticker symbol" 
          value={inputValue} 
          onValueChange={handleInputChange} 
        />
        <Command.List>
          <Command.Item onSelect={() => handleLoadStock(inputValue)}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaSearch style={{ marginRight: '10px' }} />
              Load Symbol: {inputValue}
            </div>
          </Command.Item>
          
          {recentSearches.length > 0 && (
            <>
              <Command.Group heading="Recent Searches">
                {recentSearches.map((symbol) => (
                  <Command.Item 
                    key={symbol} 
                    onSelect={() => handleLoadStock(symbol)}
                    value={symbol} // This helps with filtering
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-history" style={{ marginRight: '10px' }}></i>
                      {symbol}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            </>
          )}
        </Command.List>
      </Command.Dialog>
      <Sidebar currentStockSymbol={currentStockSymbol} onLoadStock={handleLoadStock} />
      <MainContent 
        currentStockSymbol={currentStockSymbol} 
        isNotepadOpen={isNotepadOpen} 
        isCommandPaletteOpen={isCommandPaletteOpen} // Pass the state
      />
      <NotepadSidebar isOpen={isNotepadOpen} onToggle={toggleNotepad} />
    </div>
  );
}

export default App;