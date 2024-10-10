import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ currentStockSymbol, onLoadStock }) => {
  const [inputSymbol, setInputSymbol] = useState('');

  const handleLoadStock = () => {
    onLoadStock(inputSymbol || 'SPY');
    setInputSymbol('');
  };

  const openLink = (url) => {
    if (chrome && chrome.tabs) {
      chrome.tabs.create({ url: url.replace('{symbol}', currentStockSymbol) });
    } else {
      window.open(url.replace('{symbol}', currentStockSymbol), '_blank');
    }
  };

  const quickLinks = [
    { icon: 'fa-solid fa-chart-line', url: 'https://www.tradingview.com/chart/?symbol={symbol}', title: 'TradingView Chart' },
    { icon: 'fab fa-twitter', url: 'https://x.com/search?q=%24{symbol}&src=typed_query', title: 'X (Twitter)' },
    { icon: 'fa-solid fa-comments-dollar', url: 'https://stocktwits.com/symbol/{symbol}', title: 'StockTwits' },
    { icon: 'fa-solid fa-magnifying-glass-dollar', url: 'https://seekingalpha.com/symbol/{symbol}', title: 'SeekingAlpha' },
    { icon: 'fa-solid fa-user-secret', url: 'http://openinsider.com/search?q={symbol}', title: 'OpenInsider' },
    { icon: 'fa-solid fa-fish-fins', url: 'https://whalewisdom.com/stock/{symbol}', title: 'WhaleWisdom' },
    { icon: 'fab fa-google', url: 'https://www.google.com/search?q=%24{symbol}+news', title: 'Google News' },
    { icon: 'fa-solid fa-chart-column', url: 'https://fintel.io/ss/us/{symbol}', title: 'Fintel Short Interest' },
    { icon: 'fa-solid fa-building-columns', url: 'https://fintel.io/so/us/{symbol}', title: 'Fintel Institutional Accumulation' },
  ];

  return (
    <div className="sidebar">
      <h4>ebb&flow</h4>
      <div className="input-field">
        <input
          type="text"
          value={inputSymbol}
          onChange={(e) => setInputSymbol(e.target.value)}
          placeholder="$SPY"
          onKeyPress={(e) => e.key === 'Enter' && handleLoadStock()}
        />
        <button onClick={handleLoadStock} className="load-btn">Load</button>
      </div>
      <div className="quick-links-label">Quick Links</div>
      <div className="links-container">
        {quickLinks.map((link, index) => (
          <a key={index} href="#" onClick={() => openLink(link.url)} title={link.title}>
            <i className={link.icon}></i>
          </a>
        ))}
      </div>
      <button onClick={() => quickLinks.forEach(link => openLink(link.url))} className="open-all-btn">All</button>
    </div>
  );
};

export default Sidebar;