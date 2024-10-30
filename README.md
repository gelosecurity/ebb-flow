# ebb&flow Chrome Extension

ebb&flow is a Chrome extension built with React and Vite that displays multiple stock-related windows for a given stock symbol.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Google Chrome browser

## Building the Project

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ebb-flow.git
   cd ebb-flow
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

   This will create a `dist` folder with the built files.

## Loading the Extension in Chrome

1. Open Google Chrome and navigate to `chrome://extensions`.

2. Enable "Developer mode" by toggling the switch in the top right corner.

3. Click "Load unpacked" and select the `dist` folder from your project directory.

4. The ebb&flow extension should now appear in your list of extensions.

## Using the Extension

1. Click on the ebb&flow icon in your Chrome toolbar to open the extension in a new tab.

2. Use the sidebar to enter a stock symbol and load related information. (or cmd+k on Mac, ctrl+k) on Windows

3. Utilize the resizable panels to view different stock-related data.

4. Use the notepad feature to jot down your analysis.

## API key
ebb-flow uses a bring-your-own-api-key model. Get a free api key below, and input it to retrieve data for the toolbar.

https://site.financialmodelingprep.com/


## Development

