import time
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from scraper import WebScraper

class WixScraper(WebScraper):
    """Scraper for Wix Blog."""
    
    def get_links(self, keyword):
        """Get the first 5 article URLs from Wix Blog search results."""
        self.get(f"https://www.wix.com/blog/search-results?q={keyword}")
        time.sleep(5)  # Wait for page to load

        blogs = []
        try:
            # Find article title links (updated selector based on Wix blog structure)
            link_elements = self.find_elements(By.CSS_SELECTOR, "a[data-hook='item-title']")
            for link in link_elements[:5]:  # Limit to first 5
                try:
                    href = link.get_attribute("href")
                    if href and href not in blogs:
                        blogs.append(href)
                except NoSuchElementException:
                    continue  # Skip if no href found
        except Exception as e:
            return [{"error": f"Failed to get links: {str(e)}"}]

        return blogs[:1]  # Return up to 5 links

    def get_data(self, keyword):
        """Collect data from the first 5 articles for a given keyword."""
        self.data = []  # Reset self.data
        
        try:
            blogs = self.get_links(keyword)
            if not blogs:
                self.data = [{"url": "", "content": "No links found for this keyword"}]
                return
        except Exception as e:
            self.data = [{"url": "", "content": f"Failed to get links: {str(e)}"}]
            return

        for blog in blogs:
            article = {"url": blog, "content": ""}
            try:
                self.get(blog)
                time.sleep(5)  # Wait for article to load
                
                # Extract content from blog post container
                content_container = self.find_element(By.CSS_SELECTOR, "div.blog-post-content")
                tags_to_extract = ["p", "h1", "h2", "h3", "a"]
                combined_text = []

                for tag_name in tags_to_extract:
                    elements = content_container.find_elements(By.TAG_NAME, tag_name)
                    for element in elements:
                        text = element.text.strip()
                        if text:
                            if tag_name == "a":
                                href = element.get_attribute("href")
                                combined_text.append(f"{text} ({href})")
                            else:
                                combined_text.append(text)

                if combined_text:
                    article["content"] = " ".join(combined_text)
                else:
                    article["content"] = "No content found in blog-post-content"

                self.data.append(article)
            except NoSuchElementException:
                self.data.append({"url": blog, "content": "No div with class='blog-post-content' found"})
            except Exception as e:
                self.data.append({"url": blog, "content": f"Error: {str(e)}"})

        # If no data collected, add a placeholder
        if not self.data:
            self.data = [{"url": "", "content": "No data found for this keyword"}]