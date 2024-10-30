import React, { useState, useEffect } from 'react';
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
  const [apiKey, setApiKey] = useState(localStorage.getItem('fmpApiKey') || '');
  const [companyData, setCompanyData] = useState(null);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [premiumInput, setPremiumInput] = useState('');
  const [premiumValue, setPremiumValue] = useState(0);
  const [premiumRatio, setPremiumRatio] = useState(null);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (apiKey && currentStockSymbol) {
      fetchCompanyData(currentStockSymbol);
    }
  }, [apiKey, currentStockSymbol]);

  const handleLoadStock = () => {
    onLoadStock(inputSymbol || 'SPY');
    setInputSymbol('');
  };

  const handleApiKeySave = () => {
    localStorage.setItem('fmpApiKey', apiKey);
  };

  const fetchCompanyData = async (symbol) => {
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKey}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setCompanyData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const formatMarketCap = (value) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)} trillion USD`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)} billion USD`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)} million USD`;
    } else {
      return `$${value.toLocaleString()} USD`;
    }
  };

  const getShortDescription = (description, limit = 100) => {
    if (!description) return '';
    if (description.length <= limit) {
      return description;
    }
    return `${description.substring(0, limit)}...`;
  };

  const openLink = (url) => {
    window.open(url.replace('{symbol}', currentStockSymbol), '_blank');
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
  ];

  const parseNumberInput = (input) => {
    input = input.replace(/,/g, '').replace(/\s+/g, '').toLowerCase();
    const regex = /^([0-9]+(\.[0-9]+)?)([kmbt])?$/;
    const match = input.match(regex);
    if (match) {
      let number = parseFloat(match[1]);
      const suffix = match[3];
      switch (suffix) {
        case 'k':
          number *= 1e3;
          break;
        case 'm':
          number *= 1e6;
          break;
        case 'b':
          number *= 1e9;
          break;
        case 't':
          number *= 1e12;
          break;
        default:
          break;
      }
      return number;
    } else {
      return NaN;
    }
  };

  const handlePremiumInputChange = (input) => {
    if (!input) {
      // If input is empty, reset premium value and input display
      setPremiumInput('');
      setPremiumValue(0);
    } else {
      const parsedValue = parseNumberInput(input);
      if (!isNaN(parsedValue)) {
        setPremiumInput(parsedValue.toLocaleString()); // Keep the user's raw input to display
        setPremiumValue(parsedValue); // Store the raw number for calculations
      } else {
        // If parsing fails, do not update the premiumValue to NaN
        setPremiumInput(input);
      }
    }
  };

  const calculatePremiumRatio = () => {
    if (companyData && companyData.mktCap && !isNaN(premiumValue)) {
      const ratio = (premiumValue / companyData.mktCap) * 100;
      setPremiumRatio(ratio.toFixed(2)); // Calculate and update ratio

      const calculatedScore = (ratio * 100).toFixed(2); // Scale up ratio for score representation
      setScore(calculatedScore);
    } else {
      setPremiumRatio(null);
      setScore(null);
    }
  };

  return (
    <div className="sidebar" style={{ width: '250px', padding: '1rem' }}>
      <h4>ebb&flow</h4>

      <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={inputSymbol}
          onChange={(e) => setInputSymbol(e.target.value)}
          placeholder="$SPY"
          onKeyPress={(e) => e.key === 'Enter' && handleLoadStock()}
          className="ticker-input"
          style={{ height: '2rem', flexGrow: 1 }}
        />
        <button onClick={handleLoadStock} className="load-btn" style={{ height: '2.2rem', width: '100%' }}>Load</button>
      </div>

      {companyData && (
        <div className="company-info" style={{ border: '1px solid #444', padding: '0.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <img
              src={`https://financialmodelingprep.com/image-stock/${companyData.symbol}.png?apikey=${apiKey}`}
              alt="Company Logo"
              className="company-logo"
              style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }}
            />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{companyData.companyName} ({companyData.symbol})</h3>
          </div>
          <p style={{ margin: '0.3rem 0' }}><strong>Market Cap:</strong> {formatMarketCap(companyData.mktCap)}</p>
          <p style={{ margin: '0.3rem 0' }}><strong>Industry:</strong> {companyData.industry}</p>
          <p style={{ margin: '0.3rem 0' }}>
            <strong>Description:</strong> {isDescriptionExpanded ? companyData.description : getShortDescription(companyData.description)}
            {companyData.description && companyData.description.length > 100 && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3498db',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  marginLeft: '0.5rem'
                }}
              >
                {isDescriptionExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </p>
        </div>
      )}

      {companyData && (
        <div className="premium-calculator" style={{ border: '1px solid #444', padding: '0.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h4>Premium/Market Cap Calculator</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={premiumInput}
              onChange={(e) => handlePremiumInputChange(e.target.value)}
              placeholder="100k"
              className="premium-input"
              style={{ height: '2rem', flexGrow: 1 }}
            />
            <button onClick={calculatePremiumRatio} className="load-btn" style={{ height: '2.2rem', width: '100%' }}>Calculate</button>
          </div>
          {premiumRatio !== null && !isNaN(premiumRatio) && (
            <>
              <p style={{ margin: '0.3rem 0' }}><strong>Score:</strong> {score}</p>
              <p style={{ margin: '0.3rem 0' }}><strong>Premium/Market Cap Ratio:</strong> {premiumRatio}%</p>
            </>
          )}
        </div>
      )}

      <div className="quick-links" style={{ border: '1px solid #444', padding: '0.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h4>Quick Links</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href="#"
              onClick={() => openLink(link.url)}
              title={link.title}
              style={{ textAlign: 'center' }}
            >
              {link.logo ? (
                <img src={link.logo} alt={link.title} className="quicklink-logo" style={{ width: '2rem', height: '2rem', cursor: 'pointer' }} />
              ) : (
                <i className={link.icon} style={{ fontSize: '2rem', cursor: 'pointer' }}></i>
              )}
            </a>
          ))}
        </div>
        <button onClick={() => quickLinks.forEach(link => openLink(link.url))} className="load-btn" style={{ width: '100%' }}>Open All</button>
      </div>

      {/* API Key Section without border */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setIsApiKeyVisible(!isApiKeyVisible)} className="load-btn" style={{ width: '100%' }}>
          {isApiKeyVisible ? 'Hide API Key' : 'Show API Key'}
        </button>
        {isApiKeyVisible && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API Key"
              className="api-key-input"
              style={{ height: '2rem', flexGrow: 1 }}
            />
            <button onClick={handleApiKeySave} className="load-btn" style={{ height: '2.2rem' }}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

