import { chromium } from 'playwright';
import * as fs from 'fs-extra';
import { AbiMember } from './types';

/**
 * Class for scraping ABI members data
 */
export class AbiMembersScraper {
  /**
   * Scrape ABI members data from the website
   * @returns Promise resolving to an array of ABI members
   */
  public async scrapeMembers(): Promise<AbiMember[]> {
    console.log('Starting ABI members scraper...');
    
    // Launch the browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Array to store all members
    const allMembers: AbiMember[] = [];
    
    try {
      // Get the total number of pages
      await page.goto('https://www.abi.org.uk/about-the-abi/abi-members/?p=1');
      
      // Extract total number of members and calculate total pages
      const totalText = await page.locator('.pagination-summary').first().textContent();
      const totalMembers = totalText ? parseInt(totalText.match(/of (\d+)/)?.[1] || '0') : 0;
      const totalPages = Math.ceil(totalMembers / 10);
      
      console.log(`Found ${totalMembers} members across ${totalPages} pages`);
      
      // Loop through all pages
      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        console.log(`Processing page ${currentPage} of ${totalPages}`);
        
        // Navigate to the page
        await page.goto(`https://www.abi.org.uk/about-the-abi/abi-members/?p=${currentPage}`);
        
        // Wait for the member details to load
        await page.waitForSelector('.member-details-inner');
        
        // Extract member details from the current page
        const memberElements = await page.locator('.member-details-inner').all();
        
        for (const memberElement of memberElements) {
          const member: AbiMember = {
            name: (await memberElement.locator('h3').textContent() || '').trim()
          };
          
          // Extract group if available
          const groupElement = await memberElement.locator('dt:has-text("Group") + dd').count();
          if (groupElement > 0) {
            member.group = (await memberElement.locator('dt:has-text("Group") + dd').textContent() || '').trim();
          }
          
          // Extract address if available
          const addressElement = await memberElement.locator('dt:has-text("Address") + dd').count();
          if (addressElement > 0) {
            const addressHtml = await memberElement.locator('dt:has-text("Address") + dd').innerHTML();
            member.address = addressHtml.replace(/<br>/g, '\n').trim();
          }
          
          // Extract telephone if available
          const telephoneElement = await memberElement.locator('dt:has-text("Telephone") + dd').count();
          if (telephoneElement > 0) {
            member.telephone = (await memberElement.locator('dt:has-text("Telephone") + dd').textContent() || '').trim();
          }
          
          // Extract website if available
          const websiteElement = await memberElement.locator('.member-website').count();
          if (websiteElement > 0) {
            member.website = await memberElement.locator('.member-website').getAttribute('href') || undefined;
          }
          
          allMembers.push(member);
        }
      }
      
      return allMembers;
    } catch (error) {
      console.error('Error scraping ABI members:', error);
      throw error;
    } finally {
      // Close the browser
      await browser.close();
    }
  }

  /**
   * Generate markdown content from ABI members data
   * @param members Array of ABI members
   * @returns Markdown string
   */
  public generateMarkdown(members: AbiMember[]): string {
    let markdown = '# ABI Members\n\n';
    markdown += `Total members: ${members.length}\n\n`;
    
    members.forEach((member, index) => {
      markdown += `## ${index + 1}. ${member.name}\n\n`;
      
      if (member.group) {
        markdown += `**Group:** ${member.group}\n\n`;
      }
      
      if (member.address) {
        markdown += `**Address:**\n\`\`\`\n${member.address}\n\`\`\`\n\n`;
      }
      
      if (member.telephone) {
        markdown += `**Telephone:** ${member.telephone}\n\n`;
      }
      
      if (member.website) {
        markdown += `**Website:** [${member.website}](${member.website})\n\n`;
      }
      
      markdown += '---\n\n';
    });
    
    return markdown;
  }

  /**
   * Save ABI members data to a JSON file
   * @param members Array of ABI members
   * @param filePath Path to save the JSON file
   */
  public async saveToJson(members: AbiMember[], filePath: string): Promise<void> {
    // Create a formatted JSON string with 2-space indentation for readability
    const jsonContent = JSON.stringify({
      totalMembers: members.length,
      members: members
    }, null, 2);
    
    // Write to file
    await fs.writeFile(filePath, jsonContent);
  }

  /**
   * Save ABI members data to a Markdown file
   * @param members Array of ABI members
   * @param filePath Path to save the Markdown file
   */
  public async saveToMarkdown(members: AbiMember[], filePath: string): Promise<void> {
    const markdown = this.generateMarkdown(members);
    await fs.writeFile(filePath, markdown);
  }
} 