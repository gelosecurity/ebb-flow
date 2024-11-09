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
      url: `https://unusualwhales.com/dark-pool-flow?limit=50&newer_than=1704096000000&older_than=1735718340000&order=Prem&ticker_symbol={symbol}`,
      title: 'Dark Pool Flow',
    },
    {
      url: `https://unusualwhales.com/lit-flow?limit=50&ticker_symbol={symbol}`,
      title: 'Lit Pool Flow',
    },
    {
      url: `https://unusualwhales.com/stock/{symbol}/greek-exposure?tab=Gamma`,
      title: 'Greek Exposure',
    },
  ];

  const [windowConfigs, setWindowConfigs] = useState(defaultConfigs);
  const [newWindowUrl, setNewWindowUrl] = useState('');
  const [newWindowTitle, setNewWindowTitle] = useState('');

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

  const renderPanels = () => {
    const numPanels = windowConfigs.length;
    const columns = Math.ceil(Math.sqrt(numPanels));
    const rows = Math.ceil(numPanels / columns);

    return (
      <PanelGroup direction="vertical">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {rowIndex > 0 && <PanelResizeHandle className="resize-handle" />}
            <Panel>
              <PanelGroup direction="horizontal">
                {Array.from({ length: columns }).map((_, colIndex) => {
                  const index = rowIndex * columns + colIndex;
                  if (index >= numPanels) return null;
                  const config = windowConfigs[index];
                  return (
                    <React.Fragment key={colIndex}>
                      {colIndex > 0 && <PanelResizeHandle className="resize-handle" />}
                      <Panel>
                        <div className="window-wrapper">
                          <div className="window-title">{config.title}</div>
                          <button className="remove-window" onClick={() => removeWindow(index)}>×</button>
                          <iframe
                            src={config.url.replace('{symbol}', currentStockSymbol)}
                            title={config.title}
                          />
                        </div>
                      </Panel>
                    </React.Fragment>
                  );
                })}
              </PanelGroup>
            </Panel>
          </React.Fragment>
        ))}
      </PanelGroup>
    );
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
        <button onClick={addNewWindow}>Add Window</button>
        <button onClick={resetToDefault} className="reset-to-default">Reset to Default</button>
      </div>
      <div className="panel-container">
        {renderPanels()}
      </div>
    </div>
  );
};

export default MainContent;
