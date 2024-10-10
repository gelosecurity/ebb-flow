import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './MainContent.css';

const MainContent = ({ currentStockSymbol, isNotepadOpen }) => {
  const windowConfigs = [
    {
      url: `https://unusualwhales.com/option-charts/ticker-flow?ticker_symbol=${currentStockSymbol}`,
      title: 'Option Flow',
    },
    {
      url: `https://unusualwhales.com/dark-pool-flow?limit=50&ticker_symbol=${currentStockSymbol}&order=Prem`,
      title: 'Dark Pool Flow',
    },
    {
      url: `https://unusualwhales.com/lit-flow?limit=50&ticker_symbol=${currentStockSymbol}&order=Prem`,
      title: 'Lit Pool Flow',
    },
    {
      url: `https://unusualwhales.com/stock/${currentStockSymbol}/greek-exposure?tab=Gamma`,
      title: 'Greek Exposure',
    },
  ];

  return (
    <div className={`main-content ${isNotepadOpen ? 'notepad-open' : ''}`}>
      <PanelGroup direction="horizontal">
        <Panel minSize={20}>
          <PanelGroup direction="vertical">
            <Panel minSize={20}>
              <iframe src={windowConfigs[0].url} title={windowConfigs[0].title} />
            </Panel>
            <PanelResizeHandle className="resize-handle" />
            <Panel minSize={20}>
              <iframe src={windowConfigs[1].url} title={windowConfigs[1].title} />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel minSize={20}>
          <PanelGroup direction="vertical">
            <Panel minSize={20}>
              <iframe src={windowConfigs[2].url} title={windowConfigs[2].title} />
            </Panel>
            <PanelResizeHandle className="resize-handle" />
            <Panel minSize={20}>
              <iframe src={windowConfigs[3].url} title={windowConfigs[3].title} />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default MainContent;