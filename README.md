# ABI Members

A TypeScript package to scrape and process information about ABI (Association of British Insurers) members from their website.

## Features

- Scrapes all ABI members data from the [ABI members page](https://www.abi.org.uk/about-the-abi/abi-members/)
- Handles pagination automatically
- Extracts member name, group, address, telephone, and website
- Generates both a well-formatted Markdown file and a structured JSON file with all the data
- Can be used as a library in your own projects or as a command-line tool

## Installation

### As a dependency in your project

```bash
npm install abi-members
```

### As a global command-line tool

```bash
npm install -g abi-members
```

## Usage

### As a library

```typescript
import { AbiMembersScraper, AbiMember } from 'abi-members';

async function example() {
  // Create a new scraper instance
  const scraper = new AbiMembersScraper();
  
  // Scrape members
  const members: AbiMember[] = await scraper.scrapeMembers();
  
  // Do something with the members data
  console.log(`Found ${members.length} ABI members`);
  
  // Generate and save markdown
  await scraper.saveToMarkdown(members, 'output.md');
  
  // Save to JSON
  await scraper.saveToJson(members, 'output.json');
  
  // Or generate markdown without saving
  const markdown = scraper.generateMarkdown(members);
  console.log(markdown);
}

example().catch(console.error);
```

### As a command-line tool

If installed globally:

```bash
abi-members
```

This will:
1. Launch a headless browser
2. Navigate to the ABI members page
3. Scrape all member data across all pages
4. Generate a Markdown file (`abiMembers.md`) and a JSON file (`abiMembers.json`) with the results in the current directory

## API Reference

### AbiMembersScraper

The main class for scraping ABI members data.

#### Methods

- `scrapeMembers(): Promise<AbiMember[]>` - Scrapes ABI members data from the website
- `generateMarkdown(members: AbiMember[]): string` - Generates markdown content from ABI members data
- `saveToJson(members: AbiMember[], filePath: string): Promise<void>` - Saves ABI members data to a JSON file
- `saveToMarkdown(members: AbiMember[], filePath: string): Promise<void>` - Saves ABI members data to a Markdown file

### AbiMember

Interface representing an ABI member.

```typescript
interface AbiMember {
  name: string;
  group?: string;
  address?: string;
  telephone?: string;
  website?: string;
}
```

## Output Format

### Markdown Output

The generated Markdown file has the following format:

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

The generated JSON file has the following structure:

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

## Requirements

- Node.js (v14 or higher)
- npm or yarn

## License

MIT 