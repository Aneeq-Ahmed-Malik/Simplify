# Web Scraper API Documentation

This document describes the API provided by `api.py` in the `scrapers/` directory. The API allows users to scrape blog data from multiple websites concurrently using a FastAPI endpoint.

## Endpoint

- **URL**: `/scrape`
- **Method**: `GET`
- **Description**: Scrapes blog data from specified websites for a given keyword.

### Query Parameters

| Parameter | Type   | Required | Default  | Description                          |
|-----------|--------|----------|----------|--------------------------------------|
| `keyword` | string | Yes      | N/A      | The search keyword (e.g., "design"). |
| `sites`   | string | No       | "medium" | Comma-separated list of sites to scrape (e.g., "medium,wix"). |

### Supported Sites

- `medium`: Scrapes Medium.com using `MediumScraper`.
- `wix`: Scrapes a hypothetical Wix site using `WixScraper`.
- `othersite`: Placeholder scraper (returns empty results).

### Response Format

The API returns a JSON object with the following structure:

```json
{
  "keyword": "string",           // The search keyword provided in the query
  "sites": ["string", ...],      // Array of sites requested
  "results": {
    "site_name": [              // Key is the site name (e.g., "medium", "wix")
      {
        "url": "string",         // Blog URL
        "content": "string"      // Concatenated content from the blog
      },
      // ... up to 10 entries per site
    ],
    "another_site": [
      // Same structure, or error object if failed
      {"error": "string"}        // Error message if scraping failed
    ]
  }
}