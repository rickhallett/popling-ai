import json
import glob
import os

def aggregate_json_files(output_filename="aggregated.json", sentiment_output_filename="sentiment_counts.txt"):
    # Get all JSON files in the same directory as the script
    json_files = glob.glob(os.path.join(os.path.dirname(__file__), "*.json"))
    
    # This will hold all messages from all chunks
    all_messages = []
    
    # Initialize a dictionary to count sentiment types
    sentiment_counts = {}

    for file in json_files:
        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)
            # Assuming each file is a list of objects
            if isinstance(data, list):
                all_messages.extend(data)
                
                # Count sentiment properties
                for item in data:
                    sentiment = item.get("sentiment")
                    if sentiment:
                        sentiment_counts[sentiment] = sentiment_counts.get(sentiment, 0) + 1
            else:
                # If a file doesn't contain a list at the top level, 
                # you might need to adjust this logic
                raise ValueError(f"{file} does not contain a JSON array at the root.")
    
    # Write the aggregated data to a single JSON file
    with open(output_filename, "w", encoding="utf-8") as out:
        json.dump(all_messages, out, ensure_ascii=False, indent=2)

    # Write the sentiment counts to a separate text file
    with open(sentiment_output_filename, "w", encoding="utf-8") as sentiment_out:
        for sentiment, count in sentiment_counts.items():
            sentiment_out.write(f"{sentiment}: {count}\n")

if __name__ == "__main__":
    aggregate_json_files()
