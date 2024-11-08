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
import unusualwhalesLogo from '../assets/UW_icon.png';
import finvizLogo from '../assets/finviz.png';
import fintelLogo from '../assets/fintel.png';

const Sidebar = ({ currentStockSymbol, onLoadStock }) => {
  const [inputSymbol, setInputSymbol] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('fmpApiKey') || '');
  const [aletheiaApiKey, setAletheiaApiKey] = useState(localStorage.getItem('aletheiaApiKey') || '');
  const [companyData, setCompanyData] = useState(null);
  const [priceData, setPriceData] = useState(null);
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

  useEffect(() => {
    if (aletheiaApiKey && currentStockSymbol) {
      fetchAletheiaData(currentStockSymbol);
    }
  }, [aletheiaApiKey, currentStockSymbol]);

  const handleLoadStock = () => {
    onLoadStock(inputSymbol || 'SPY');
    setInputSymbol('');
  };

  const handleApiKeySave = () => {
    localStorage.setItem('fmpApiKey', apiKey);
  };

  const handleAletheiaApiKeySave = () => {
    localStorage.setItem('aletheiaApiKey', aletheiaApiKey);
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

  const fetchAletheiaData = async (symbol) => {
    try {
      const response = await fetch(`https://api.aletheiaapi.com/StockData?symbol=${symbol}`, {
        headers: {
          'key': aletheiaApiKey,
          'Accept-Version': '2',
        },
      });
      const data = await response.json();

      setPriceData({
        price: data.Price,
        change: data.Change,
        changePercent: data.ChangePercent ? data.ChangePercent * 100 : 0,
      });

      setCompanyData((prev) => ({
        ...prev,
        earningsDate: data.EarningsDate ? formatDate(data.EarningsDate, true) : null,
        dividendDate: data.DividendDate ? formatDate(data.DividendDate) : null,
        shortPercentOfFloat: data.ShortPercentOfFloat ? (data.ShortPercentOfFloat * 100).toFixed(2) : null,
      }));
    } catch (error) {
      console.error('Error fetching Aletheia data:', error);
    }
  };

  const formatMarketCap = (value) => {
    if (!value) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)} trillion USD`;
    else if (value >= 1e9) return `$${(value / 1e9).toFixed(2)} billion USD`;
    else if (value >= 1e6) return `$${(value / 1e6).toFixed(2)} million USD`;
    else return `$${value.toLocaleString()} USD`;
  };

  const formatDate = (dateStr, isEarnings = false) => {
    const date = new Date(dateStr);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    return isEarnings ? `${formattedDate} ${dateStr.includes('00:00:00') ? 'Premarket' : 'Afterhours'}` : formattedDate;
  };

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
      setPremiumInput('');
      setPremiumValue(0);
    } else {
      const parsedValue = parseNumberInput(input);
      if (!isNaN(parsedValue)) {
        setPremiumInput(parsedValue.toLocaleString());
        setPremiumValue(parsedValue);
      } else {
        setPremiumInput(input);
      }
    }
  };

  const calculatePremiumRatio = () => {
    if (companyData && companyData.mktCap && !isNaN(premiumValue)) {
      const ratio = (premiumValue / companyData.mktCap) * 100;
      setPremiumRatio(ratio.toFixed(2));
      const calculatedScore = (ratio * 100).toFixed(2);
      setScore(calculatedScore);
    } else {
      setPremiumRatio(null);
      setScore(null);
    }
  };

  // Define the quickLinks array
  const quickLinks = [
    { logo: tradingviewLogo, url: 'https://www.tradingview.com/chart/?symbol={symbol}', title: 'TradingView Chart' },
    { logo: unusualwhalesLogo, url: 'https://unusualwhales.com/stock/{symbol}/seasonality', title: 'UW Seasonality' },
    { logo: unusualwhalesLogo, url: 'https://unusualwhales.com/stock/{symbol}/institutions', title: 'UW Institutions' },
    { logo: twitterLogo, url: 'https://x.com/search?q=%24{symbol}&src=typed_query', title: 'X (Twitter)' },
    { logo: stocktwitsLogo, url: 'https://stocktwits.com/symbol/{symbol}', title: 'StockTwits' },
    { logo: seekingalphaLogo, url: 'https://seekingalpha.com/symbol/{symbol}', title: 'SeekingAlpha' },
    { logo: openinsiderLogo, url: 'http://openinsider.com/search?q={symbol}', title: 'OpenInsider' },
    { logo: whalewisdomLogo, url: 'https://whalewisdom.com/stock/{symbol}', title: 'WhaleWisdom' },
    { logo: googleLogo, url: 'https://www.google.com/search?q=%24{symbol}+news', title: 'Google News' },
    { logo: googleLogo, url: 'https://www.google.com/search?q={symbol}+investor+letter+investment+case', title: 'Google Investor Letter' },
    { logo: fintelLogo, url: 'https://fintel.io/ss/us/{symbol}', title: 'Fintel Short Interest' },
    { logo: fintelLogo, url: 'https://fintel.io/so/us/{symbol}', title: 'Institutional Accumulation' },
    { logo: finvizLogo, url: 'https://finviz.com/quote.ashx?t={symbol}', title: 'Finviz Overview' },
  ];

  const openAllLinks = () => {
    const tradingViewLink = quickLinks.find(link => link.title === 'TradingView Chart');
    const otherLinks = quickLinks.filter(link => link.title !== 'TradingView Chart');

    otherLinks.forEach(link => {
      window.open(link.url.replace('{symbol}', currentStockSymbol), '_blank');
    });

    if (tradingViewLink) {
      window.open(tradingViewLink.url.replace('{symbol}', currentStockSymbol), '_blank');
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

          {priceData && (
            <p style={{ fontSize: '1rem', margin: '0.3rem 0' }}>
              <span style={{ color: '#FFFFFF' }}>${priceData.price.toFixed(2)}</span>
              {' '}
              <span style={{ color: priceData.change >= 0 ? '#00FF00' : '#FF0000' }}>
                {priceData.change >= 0 ? `+${priceData.change.toFixed(2)}` : priceData.change.toFixed(2)}
              </span>
              {' '}
              <span style={{ color: priceData.changePercent >= 0 ? '#00FF00' : '#FF0000' }}>
                ({priceData.changePercent >= 0 ? `+${priceData.changePercent.toFixed(2)}` : priceData.changePercent.toFixed(2)}%)
              </span>
            </p>
          )}

          <p style={{ margin: '0.3rem 0' }}><strong>Market Cap:</strong> {formatMarketCap(companyData.mktCap)}</p>
          <p style={{ margin: '0.3rem 0' }}><strong>Industry:</strong> {companyData.industry || 'N/A'}</p>
          {companyData.earningsDate && <p style={{ margin: '0.3rem 0' }}><strong>Next Earnings Date:</strong> {companyData.earningsDate}</p>}
          {companyData.dividendDate && <p style={{ margin: '0.3rem 0' }}><strong>Next Dividend Date:</strong> {companyData.dividendDate}</p>}
          {companyData.shortPercentOfFloat && <p style={{ margin: '0.3rem 0' }}><strong>Short % of Float:</strong> {companyData.shortPercentOfFloat}%</p>}
          <p style={{ margin: '0.3rem 0' }}><strong>Description:</strong> {isDescriptionExpanded ? companyData.description : `${companyData.description.substring(0, 100)}...`}
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
              onClick={() => window.open(link.url.replace('{symbol}', currentStockSymbol), '_blank')}
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
        <button onClick={openAllLinks} className="load-btn" style={{ width: '100%' }}>Open All</button>
      </div>

      {/* API Key Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setIsApiKeyVisible(!isApiKeyVisible)} className="load-btn" style={{ width: '100%' }}>
          {isApiKeyVisible ? 'Hide API Keys' : 'Show API Keys'}
        </button>
        {isApiKeyVisible && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Financial Model Prep API Key"
                className="api-key-input"
                style={{ height: '2rem', flexGrow: 1 }}
              />
              <button onClick={handleApiKeySave} className="load-btn" style={{ height: '2.2rem' }}>Save</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="text"
                value={aletheiaApiKey}
                onChange={(e) => setAletheiaApiKey(e.target.value)}
                placeholder="Aletheia API Key"
                className="api-key-input"
                style={{ height: '2rem', flexGrow: 1 }}
              />
              <button onClick={handleAletheiaApiKeySave} className="load-btn" style={{ height: '2.2rem' }}>Save</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

