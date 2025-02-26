#!/usr/bin/env node

import { AbiMembersScraper } from './scraper';

/**
 * Main CLI function to run the scraper
 */
async function main(): Promise<void> {
  const scraper = new AbiMembersScraper();
  
  try {
    // Scrape members
    const members = await scraper.scrapeMembers();
    
    // Save to files
    await scraper.saveToJson(members, 'abiMembers.json');
    await scraper.saveToMarkdown(members, 'abiMembers.md');
    
    console.log(`Successfully scraped ${members.length} ABI members and saved to abiMembers.md and abiMembers.json`);
    process.exit(0);
  } catch (error) {
    console.error('Unhandled error:', error);
    process.exit(1);
  }
}

// Run the CLI
main(); 