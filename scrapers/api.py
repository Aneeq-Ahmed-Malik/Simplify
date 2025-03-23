from fastapi import FastAPI
from scraper_factory import ScraperFactory
import threading
from typing import List

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


# Api should give the following output:
# {
#   "keyword": "design",
#   "sites": ["medium", "wix", "othersite"],
#   "results": {
#     "medium": [
#       {
#         "url": "https://medium.com/design-tips/modern-design",
#         "content": "Modern design trends are shaping the future of UX."
#       },
#       {
#         "url": "https://medium.com/creativity/design-inspiration",
#         "content": "Finding inspiration is key to great design."
#       }
#     ],
#     "wix": [
#       {
#         "url": "https://www.wix.com/blog/design-ideas",
#         "content": "Design your website with these creative ideas from Wix."
#       },
#       {
#         "url": "https://www.wix.com/tips/design-trends",
#         "content": "Top design trends to watch in 2025."
#       }
#       // Up to 10 entries, based on placeholder logic...
#     ],
#     "othersite": []
#   }
# }