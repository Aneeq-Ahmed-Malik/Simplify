from fastapi import FastAPI
from scraper_factory import ScraperFactory
import threading
from typing import List
from transformers import pipeline
from queue import Queue
from concurrent.futures import ThreadPoolExecutor, as_completed


app = FastAPI()

def scrape_site(keyword: str, site: str, results: dict):
    """Helper function to scrape a single site and store results."""
    try:
        bot = ScraperFactory.create_scraper(site)
        bot.get_data(keyword)
        results[site] = bot.data
    except ValueError as e:
        results[site] = {"error": str(e)}
    finally:
        bot.quit()


@app.get("/scrape")
async def scrape_data(keyword: str, sites: str = "medium"):
    """
    Scrape data from multiple sites.
    :param keyword: Search keyword
    :param sites: Comma-separated list of sites (e.g., "medium,othersite")
    """
    # Split the sites string into a list
    site_list = [site.strip() for site in sites.split(",")]
    
    # Dictionary to store results from each thread
    results = {}
    
    # List to hold threads
    threads: List[threading.Thread] = []
    
    # Create and start a thread for each site
    for site in site_list:
        thread = threading.Thread(target=scrape_site, args=(keyword, site, results))
        threads.append(thread)
        thread.start()
    
    # Wait for all threads to complete
    for thread in threads:
        thread.join()
    
    # Return combined results
    return {"keyword": keyword, "sites": site_list, "results": results}

## Summarization ##

# Use a shared summarizer pipeline (CPU or GPU if available)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")  # device=0 for CUDA GPU

def summarize_chunk(text: str, max_length: int = 100, min_length: int = 30) -> str:
    """Summarize a single chunk of text."""
    try:
        if not text.strip():
            return "No valid content in chunk."
        if len(text.split()) < 5:
            return "Chunk is too short for meaningful summarization."
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return summary[0]["summary_text"] if summary else "Chunk failed to summarize."
    except Exception as e:
        return f"Error in chunk summarization: {str(e)}"

def chunk_text(text: str, max_chunk_size: int = 3000) -> List[str]:
    """Split text into manageable chunks."""
    return [text[i:i+max_chunk_size] for i in range(0, len(text), max_chunk_size)]


def summarize_content(text: str, max_length: int = 100, min_length: int = 30) -> str:
    if not text or not text.strip():
        return "No valid content provided for summarization."
    if len(text.split()) < 5:
        return "Input is too short for meaningful summarization."

    chunks = chunk_text(text)

    with ThreadPoolExecutor(max_workers=min(6, len(chunks))) as executor:
        summaries = list(executor.map(lambda chunk: summarize_chunk(chunk, max_length, min_length), chunks))

    return " ".join(summaries)

@app.post("/summarize")
async def summarize_data(body: dict):
    """
    Summarize raw text content sent in the request body.
    """
    content = body.get("content")
    if not content:
        return {"error": "Missing 'content' field in request body"}
    summary = summarize_content(content)
    return {"summary": summary}