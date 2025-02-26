"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const playwright_1 = require("playwright");
const fs = __importStar(require("fs-extra"));
/**
 * Main function to scrape ABI members data
 */
async function scrapeAbiMembers() {
    console.log('Starting ABI members scraper...');
    // Launch the browser
    const browser = await playwright_1.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    // Array to store all members
    const allMembers = [];
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
                const member = {
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
        // Generate markdown content
        const markdownContent = generateMarkdown(allMembers);
        // Write to markdown file
        await fs.writeFile('abiMembers.md', markdownContent);
        // Write to JSON file
        await writeJsonFile(allMembers, 'abiMembers.json');
        console.log(`Successfully scraped ${allMembers.length} ABI members and saved to abiMembers.md and abiMembers.json`);
    }
    catch (error) {
        console.error('Error scraping ABI members:', error);
    }
    finally {
        // Close the browser
        await browser.close();
    }
}
/**
 * Generate markdown content from ABI members data
 */
function generateMarkdown(members) {
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
 * Write ABI members data to a JSON file
 */
async function writeJsonFile(members, filePath) {
    // Create a formatted JSON string with 2-space indentation for readability
    const jsonContent = JSON.stringify({
        totalMembers: members.length,
        members: members
    }, null, 2);
    // Write to file
    await fs.writeFile(filePath, jsonContent);
}
// Run the scraper
scrapeAbiMembers()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
