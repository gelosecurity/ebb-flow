import React, { useState } from 'react';
import './Sidebar.css';

// Import logos
import tradingviewLogo from '../assets/tradingview.png';
import twitterLogo from '../assets/Twitter-X-Logo.png';
import stocktwitsLogo from '../assets/stocktwits.webp';
import seekingalphaLogo from '../assets/seekingalpha.png';
import openinsiderLogo from '../assets/openinsider.png';
import whalewisdomLogo from '../assets/whalewisdom.png';
import googleLogo from '../assets/Google_News_icon.png';


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
    { logo: tradingviewLogo, url: 'https://www.tradingview.com/chart/?symbol={symbol}', title: 'TradingView Chart' },
    { logo: twitterLogo, url: 'https://x.com/search?q=%24{symbol}&src=typed_query', title: 'X (Twitter)' },
    { logo: stocktwitsLogo, url: 'https://stocktwits.com/symbol/{symbol}', title: 'StockTwits' },
    { logo: seekingalphaLogo, url: 'https://seekingalpha.com/symbol/{symbol}', title: 'SeekingAlpha' },
    { logo: openinsiderLogo, url: 'http://openinsider.com/search?q={symbol}', title: 'OpenInsider' },
    { logo: whalewisdomLogo, url: 'https://whalewisdom.com/stock/{symbol}', title: 'WhaleWisdom' },
    { logo: googleLogo, url: 'https://www.google.com/search?q=%24{symbol}+news', title: 'Google News' },
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
            {link.logo ? (
              <img src={link.logo} alt={link.title} className="quicklink-logo" />
            ) : (
              <i className={link.icon}></i>
            )}
          </a>
        ))}
      </div>
      <button onClick={() => quickLinks.forEach(link => openLink(link.url))} className="open-all-btn">All</button>
    </div>
  );
};

export default Sidebar;