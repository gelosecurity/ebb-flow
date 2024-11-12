import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './MainContent.css';

const MainContent = ({ currentStockSymbol, isNotepadOpen, isCommandPaletteOpen }) => {
  const defaultConfigs = [
    {
      url: `https://unusualwhales.com/option-charts/ticker-flow?ticker_symbol={symbol}`,
      title: 'Option Flow',
    },
    {
      title: 'Dark Pool Flow',
    },
    {
      url: `https://unusualwhales.com/stock/{symbol}/greek-exposure?tab=Gamma`,
      title: 'Greek Exposure',
    },
  ];

  const [windowConfigs, setWindowConfigs] = useState(defaultConfigs);
  const [newWindowUrl, setNewWindowUrl] = useState('');
  const [newWindowTitle, setNewWindowTitle] = useState('');
  const [darkPoolTimeframe, setDarkPoolTimeframe] = useState('all-time'); // Default timeframe

  const updateDarkPoolUrl = (timeframe) => {
    setDarkPoolTimeframe(timeframe); // Set the timeframe without modifying the URL in state
  };

  useEffect(() => {
    const savedConfigs = localStorage.getItem('windowConfigs');
    if (savedConfigs) {
      setWindowConfigs(JSON.parse(savedConfigs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('windowConfigs', JSON.stringify(windowConfigs));
  }, [windowConfigs]);

  const addNewWindow = () => {
    if (newWindowUrl && newWindowTitle) {
      setWindowConfigs([...windowConfigs, { url: newWindowUrl, title: newWindowTitle }]);
      setNewWindowUrl('');
      setNewWindowTitle('');
    }
  };

  const removeWindow = (index) => {
    setWindowConfigs(windowConfigs.filter((_, i) => i !== index));
  };

  const resetToDefault = () => {
    setWindowConfigs(defaultConfigs);
  };

  return (
    <div className={`main-content ${isNotepadOpen ? 'notepad-open' : ''}`}>
      {isCommandPaletteOpen && <div className="iframe-overlay" />}
      <div className="window-controls">
        <input
          type="text"
          value={newWindowUrl}
          onChange={(e) => setNewWindowUrl(e.target.value)}
          placeholder="Enter URL with {symbol} for ticker"
        />
        <input
          type="text"
          value={newWindowTitle}
          onChange={(e) => setNewWindowTitle(e.target.value)}
          placeholder="Enter window title"
        />
        <button onClick={addNewWindow} className="add-window">Add Window</button>
        <button onClick={resetToDefault} className="reset-to-default">Reset to Default</button>
      </div>
      <PanelGroup direction="horizontal">
        {/* Left half: Option Flow */}
        <Panel>
          <div className="window-wrapper">
            <div className="window-title">Option Flow</div>
            <iframe
              src={`https://unusualwhales.com/option-charts/ticker-flow?ticker_symbol=${currentStockSymbol}`}
              title="Option Flow"
            />
          </div>
        </Panel>
        
        <PanelResizeHandle className="resize-handle" />

        {/* Right half: Dark Pool Flow (upper) and Greek Exposure (lower) */}
        <Panel>
          <PanelGroup direction="vertical">
            {/* Dark Pool Flow (upper half of the right pane) */}
            <Panel>
              <div className="window-wrapper">
                <div className="window-title">
                  Dark Pool Flow
                  <div className="dark-pool-buttons">
                    <button
                      className="dark-pool-button"
                      onClick={() => updateDarkPoolUrl('all-time')}
                    >
                      All-Time Dark Pool
                    </button>
                    <button
                      className="dark-pool-button"
                      onClick={() => updateDarkPoolUrl('YTD')}
                    >
                      YTD Dark Pool
                    </button>
                  </div>
                </div>
                <iframe
                  src={
                    darkPoolTimeframe === 'all-time'
                      ? `https://unusualwhales.com/dark-pool-flow?limit=50&newer_than=946684800000&older_than=1893456000000&order=Size&ticker_symbol=${currentStockSymbol}`
                      : `https://unusualwhales.com/dark-pool-flow?limit=50&newer_than=1704096000000&older_than=1735718340000&order=Size&ticker_symbol=${currentStockSymbol}`
                  }
                  title="Dark Pool Flow"
                />
              </div>
            </Panel>

            <PanelResizeHandle className="resize-handle" />

            {/* Greek Exposure (lower half of the right pane) */}
            <Panel>
              <div className="window-wrapper">
                <div className="window-title">Greek Exposure</div>
                <iframe
                  src={`https://unusualwhales.com/stock/${currentStockSymbol}/greek-exposure?tab=Gamma`}
                  title="Greek Exposure"
                />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default MainContent;
