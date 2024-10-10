document.addEventListener('DOMContentLoaded', function () {
  const stockInput = document.getElementById('stock-input');
  const loadBtn = document.getElementById('load-btn');
  const openAllBtn = document.getElementById('open-all-btn');

  const tradingviewLink = document.getElementById('tradingview-link');
  const xLink = document.getElementById('x-link');
  const stocktwitsLink = document.getElementById('stocktwits-link'); // Added StockTwits
  const seekingAlphaLink = document.getElementById('seekingalpha-link');
  const openInsiderLink = document.getElementById('openinsider-link');
  const fintelSiLink = document.getElementById('fintel-si-link');
  const fintelIaLink = document.getElementById('fintel-ia-link');
  const whalewisdomLink = document.getElementById('whalewisdom-link');
  const googleNewsLink = document.getElementById('google-news-link');

  let currentStockSymbol = 'SPY'; // Default stock symbol

  // Function to load stock data
  function loadStock() {
    let inputSymbol = stockInput.value.trim().toUpperCase() || 'SPY';
    currentStockSymbol = inputSymbol.replace(/^\$/, '');
    loadWindows(currentStockSymbol);
  }

  // Existing event listener for the Load button
  loadBtn.addEventListener('click', function () {
    loadStock();
  });

  // New event listener for Enter key press on stock input
  stockInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission if it's in a form
      loadStock();
    }
  });

  // Add event listeners to links
  tradingviewLink.addEventListener('click', function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: `https://www.tradingview.com/chart/?symbol=${currentStockSymbol}` });
  });

  xLink.addEventListener('click', function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: `https://x.com/search?q=%24${currentStockSymbol}&src=typed_query` });
  });

  stocktwitsLink.addEventListener('click', function (e) { // Added event listener for StockTwits
    e.preventDefault();
    chrome.tabs.create({ url: `https://stocktwits.com/symbol/${currentStockSymbol}` });
  });

  seekingAlphaLink.addEventListener('click', function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: `https://seekingalpha.com/symbol/${currentStockSymbol}` });
  });

  openInsiderLink.addEventListener('click', function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: `http://openinsider.com/search?q=${currentStockSymbol}` });
  });

  fintelSiLink.addEventListener('click', function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: `https://fintel.io/ss/us/${currentStockSymbol.toLowerCase()}` });
  });

  fintelIaLink.addEventListener('click', function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: `https://fintel.io/so/us/${currentStockSymbol.toLowerCase()}` });
  });

  whalewisdomLink.addEventListener('click', function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: `https://whalewisdom.com/stock/${currentStockSymbol.toLowerCase()}` });
  });

  googleNewsLink.addEventListener('click', function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent('$' + currentStockSymbol)}+news` });
  });

  // Event listener for Open All button
  openAllBtn.addEventListener('click', function () {
    const urls = [
      `https://www.tradingview.com/chart/?symbol=${currentStockSymbol}`,
      `https://x.com/search?q=%24${currentStockSymbol}&src=typed_query`,
      `https://stocktwits.com/symbol/${currentStockSymbol}`, // Added StockTwits
      `https://seekingalpha.com/symbol/${currentStockSymbol}`,
      `http://openinsider.com/search?q=${currentStockSymbol}`,
      `https://fintel.io/ss/us/${currentStockSymbol.toLowerCase()}`,
      `https://fintel.io/so/us/${currentStockSymbol.toLowerCase()}`,
      `https://whalewisdom.com/stock/${currentStockSymbol.toLowerCase()}`,
      `https://www.google.com/search?q=${encodeURIComponent('$' + currentStockSymbol)}+news`
    ];

    urls.forEach(url => {
      chrome.tabs.create({ url: url });
    });
  });

  // Initial load
  loadWindows(currentStockSymbol);

  // Add event listener for window resize to adjust window sizes dynamically
  window.addEventListener('resize', function () {
    loadWindows(currentStockSymbol);
  });

  function loadWindows(stockSymbol) {
    const windowsContainer = document.getElementById('windows-container');
    windowsContainer.innerHTML = ''; // Clear previous windows

    const windowConfigs = [
      {
        url: `https://unusualwhales.com/option-charts/ticker-flow?ticker_symbol=${stockSymbol}`,
        title: 'Option Flow',
      },
      {
        url: `https://unusualwhales.com/dark-pool-flow?limit=50&ticker_symbol=${stockSymbol}&order=Prem`,
        title: 'Dark Pool Flow',
      },
      {
        url: `https://unusualwhales.com/lit-flow?limit=50&ticker_symbol=${stockSymbol}&order=Prem`,
        title: 'Lit Pool Flow',
      },
      {
        url: `https://unusualwhales.com/stock/${stockSymbol}/greek-exposure?tab=Gamma`,
        title: 'Greek Exposure',
      },
    ];

    const numWindows = windowConfigs.length;

    const columns = 2; // Number of columns
    const rows = Math.ceil(numWindows / columns);

    // Update grid template based on the number of windows
    windowsContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    windowsContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    windowConfigs.forEach((config) => {
      createEmbeddedWindow(config.url);
    });
  }

  function createEmbeddedWindow(url) {
    const windowDiv = document.createElement('div');
    windowDiv.className = 'embedded-window';

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.scrolling = "no"; // Disable internal scrolling

    windowDiv.appendChild(iframe);
    document.getElementById('windows-container').appendChild(windowDiv);
  }
});

