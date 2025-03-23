# wix_scraper.py
import time
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from scraper import WebScraper

class WixScraper(WebScraper):
    """Scraper for Wix Blog."""
    def get_links(self, keyword):
        """Search Wix Blog and return the top 6 article URLs."""
        self.get(f"https://www.wix.com/blog/search-results?q={keyword}")
        self.maximize_window()
        time.sleep(5)  

        try:
            links = self.find_elements(by=By.CSS_SELECTOR, value="a[data-hook='item-title']")
            return [link.get_attribute("href") for link in links][:6]
        except NoSuchElementException:
            return []

    def get_data(self, keyword):
        self.data = []

        try:
            blogs = self.get_links(keyword)
        except Exception as e:
            self.data = [{"url": "", "content": f"Failed to get links: {str(e)}"}]
            return

        for blog in blogs:
            article = {"url": blog, "content": ""}
            try:
                self.get(blog)
                time.sleep(5)

                try:
                    heading = self.find_element(By.CSS_SELECTOR, "h1.font_7").text
                except:
                    heading = "Heading not found"
                article["content"] += heading + "\n"

                try:
                    text_elements = self.find_elements(By.XPATH, "//*[self::p or self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]")
                    full_text_lines = [element.text for element in text_elements if element.text.strip()]
                    
                    header_markers = ["Categories ▼", "Resources ▼", "Wix.com"]
                    related_posts_marker = "Related Posts"
                    footer_marker = "Was this article helpful?"
                    
                    start_idx = 0
                    end_idx = len(full_text_lines)
                    for i, line in enumerate(full_text_lines):
                        if any(marker in line for marker in header_markers):
                            start_idx = i + 1
                        if related_posts_marker in line or footer_marker in line:
                            end_idx = i
                            break
                    
                    main_content = "\n".join(full_text_lines[start_idx:end_idx])
                    article["content"] += main_content
                except:
                    article["content"] += "Content not found"

                self.data.append(article)
            except Exception as e:
                self.data.append({"url": blog, "content": f"Error: {str(e)}"})

        if not self.data:
            self.data = [{"url": "", "content": "No data found for this keyword"}]