const fs = require('fs');
const path = require('path');

function aggregateJsonFiles(outputFilename = 'aggregated.json', sentimentOutputFilename = 'sentiment_counts.txt') {
  // Get all JSON files in the same directory as the script
  const jsonFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.json'));

  // This will hold all messages from all chunks
  let allMessages = [];

  // Initialize a dictionary to count sentiment types
  const sentimentCounts = {};

  for (const file of jsonFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf-8'));

      // Assuming each file is a list of objects
      if (Array.isArray(data)) {
        allMessages.push(...data);

        // filter out messages that contain string omitted
        allMessages = allMessages.filter(message => !message.message.includes('omitted')).filter(message => !message.message.includes('deleted'));

        // Count sentiment properties
        data.forEach(item => {
          const sentiment = item.sentiment;
          const message = item.message;
          if (sentiment && !message.includes('omitted') && !message.includes('deleted')) {
            sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
          }
        });
      } else {
        // If a file doesn't contain a list at the top level,
        // you might need to adjust this logic
        throw new Error(`${file} does not contain a JSON array at the root.`);
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  // Write the aggregated data to a single JSON file
  fs.writeFileSync(
    path.join(__dirname, outputFilename),
    JSON.stringify(allMessages, null, 2),
    'utf-8'
  );

  // Write the sentiment counts to a separate text file
  const sentimentOutput = Object.entries(sentimentCounts)
    .map(([sentiment, count]) => `${sentiment}: ${count}`)
    .join('\n');

  fs.writeFileSync(path.join(__dirname, sentimentOutputFilename), sentimentOutput, 'utf-8');
}

// Run the function if this file is being executed directly
if (require.main === module) {
  aggregateJsonFiles();
}

module.exports = aggregateJsonFiles;
