# ABI Members Scraper

A TypeScript and Playwright-based scraper to extract information about ABI (Association of British Insurers) members from their website.

## Features

- Scrapes all ABI members data from the [ABI members page](https://www.abi.org.uk/about-the-abi/abi-members/)
- Handles pagination automatically
- Extracts member name, group, address, telephone, and website
- Generates both a well-formatted Markdown file and a structured JSON file with all the data

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone this repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage

To run the scraper:

```bash
npm start
```

This will:
1. Launch a headless browser
2. Navigate to the ABI members page
3. Scrape all member data across all pages
4. Generate a Markdown file (`abiMembers.md`) and a JSON file (`abiMembers.json`) with the results

## Output

### Markdown Output

The script generates a Markdown file (`abiMembers.md`) in the root directory with all the ABI members data in the following format:

```markdown
# ABI Members

Total members: 369

## 1. AA plc

**Address:**
```
Fanum House
Basing View
Basingstoke
RG21 4EA
```

**Telephone:** +44 345 607 6727

**Website:** [http://www.theaaplc.com/](http://www.theaaplc.com/)

---

## 2. AA Underwriting Insurance Company Limited

**Group:** AA plc

**Address:**
```
Unit 2/1, Waterport Place
2, Europort Road
PO Box 1338
Ocean Village
GX11 1AA
```

**Telephone:** +350 200 74570

---
```

### JSON Output

The script also generates a JSON file (`abiMembers.json`) with the following structure:

```json
{
  "totalMembers": 369,
  "members": [
    {
      "name": "AA plc",
      "address": "Fanum House\nBasing View\nBasingstoke\nRG21 4EA",
      "telephone": "+44 345 607 6727",
      "website": "http://www.theaaplc.com/"
    },
    {
      "name": "AA Underwriting Insurance Company Limited",
      "group": "AA plc",
      "address": "Unit 2/1, Waterport Place\n2, Europort Road\nPO Box 1338\nOcean Village\nGX11 1AA",
      "telephone": "+350 200 74570"
    },
    // ... more members
  ]
}
```

## License

MIT 