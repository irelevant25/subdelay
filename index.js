#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Main function
async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  // Check if we have the required arguments
  if (args.length !== 2) {
    console.error('Error: Missing required arguments');
    console.error('Usage: subdelay <filename> <delay_in_ms>');
    process.exit(1);
  }
  
  const filename = args[0];
  const delayMs = parseInt(args[1], 10);
  
  // Validate delay is a number
  if (isNaN(delayMs)) {
    console.error('Error: Delay must be a number in milliseconds');
    process.exit(1);
  }
  
  // Check if file exists
  if (!fs.existsSync(filename)) {
    console.error(`Error: File '${filename}' not found`);
    process.exit(1);
  }
  
  // Determine file extension and process accordingly
  const ext = path.extname(filename).toLowerCase();
  
  try {
    if (ext === '.srt') {
      await processSrtFile(filename, delayMs);
    } else if (ext === '.ass') {
      await processAssFile(filename, delayMs);
    } else {
      console.error(`Error: Unsupported file format '${ext}'. Only .srt and .ass files are supported.`);
      process.exit(1);
    }
    console.log(`Successfully shifted subtitles in '${filename}' by ${delayMs} ms`);
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
    process.exit(1);
  }
}

// Process SRT files
async function processSrtFile(filename, delayMs) {
  try {
    let content = fs.readFileSync(filename, 'utf8');
    
    // Regex to match time format in SRT (00:00:00,000 --> 00:00:00,000)
    const timeRegex = /(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/g;
    
    // Function to convert time strings to milliseconds
    const timeToMs = (h, m, s, ms) => {
      return parseInt(h, 10) * 3600000 + parseInt(m, 10) * 60000 + parseInt(s, 10) * 1000 + parseInt(ms, 10);
    };
    
    // Function to convert milliseconds to time strings
    const msToTime = (totalMs) => {
      // Ensure we don't have negative times
      totalMs = Math.max(0, totalMs);
      
      const h = Math.floor(totalMs / 3600000).toString().padStart(2, '0');
      const m = Math.floor((totalMs % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((totalMs % 60000) / 1000).toString().padStart(2, '0');
      const ms = Math.floor(totalMs % 1000).toString().padStart(3, '0');
      
      return `${h}:${m}:${s},${ms}`;
    };
    
    // Apply the time shift
    content = content.replace(timeRegex, (match, h1, m1, s1, ms1, h2, m2, s2, ms2) => {
      const startMs = timeToMs(h1, m1, s1, ms1) + delayMs;
      const endMs = timeToMs(h2, m2, s2, ms2) + delayMs;
      
      return `${msToTime(startMs)} --> ${msToTime(endMs)}`;
    });
    
    // Write the modified content back to the file
    fs.writeFileSync(filename, content, 'utf8');
    
  } catch (error) {
    throw new Error(`Failed to process SRT file: ${error.message}`);
  }
}

// Process ASS files
async function processAssFile(filename, delayMs) {
  try {
    let content = fs.readFileSync(filename, 'utf8');
    
    // In ASS files, timestamps are in the format h:mm:ss.cc (where cc is centiseconds)
    // Usually in the Dialogue lines: Dialogue: 0,0:01:30.00,0:01:35.00,Default,,0,0,0,,Text
    
    // Function to convert ASS time to milliseconds
    const assTimeToMs = (timeStr) => {
      const [h, m, rest] = timeStr.split(':');
      const [s, cs] = rest.split('.');
      
      return parseInt(h, 10) * 3600000 + 
             parseInt(m, 10) * 60000 + 
             parseInt(s, 10) * 1000 + 
             parseInt(cs, 10) * 10; // Convert centiseconds to milliseconds
    };
    
    // Function to convert milliseconds to ASS time format
    const msToAssTime = (totalMs) => {
      // Ensure we don't have negative times
      totalMs = Math.max(0, totalMs);
      
      const h = Math.floor(totalMs / 3600000);
      const m = Math.floor((totalMs % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((totalMs % 60000) / 1000).toString().padStart(2, '0');
      const cs = Math.floor((totalMs % 1000) / 10).toString().padStart(2, '0');
      
      return `${h}:${m}:${s}.${cs}`;
    };
    
    // Process each line in the file
    const lines = content.split('\n');
    const processedLines = lines.map(line => {
      // Only process Dialogue lines (where timestamps are)
      if (line.startsWith('Dialogue:')) {
        const parts = line.split(',');
        
        // Timestamps are in the 2nd (start) and 3rd (end) positions after Dialogue: format
        if (parts.length >= 4) {
          try {
            const startTimeStr = parts[1];
            const endTimeStr = parts[2];
            
            const startMs = assTimeToMs(startTimeStr) + delayMs;
            const endMs = assTimeToMs(endTimeStr) + delayMs;
            
            // Replace timestamps with shifted ones
            parts[1] = msToAssTime(startMs);
            parts[2] = msToAssTime(endMs);
            
            return parts.join(',');
          } catch (e) {
            console.warn(`Warning: Could not process line: ${line}`);
            return line;
          }
        }
      }
      return line;
    });
    
    // Write the modified content back to the file
    fs.writeFileSync(filename, processedLines.join('\n'), 'utf8');
    
  } catch (error) {
    throw new Error(`Failed to process ASS file: ${error.message}`);
  }
}

// Run the main function
main().catch(err => {
  console.error(err);
  process.exit(1);
});