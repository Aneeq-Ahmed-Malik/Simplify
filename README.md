# 🧠 Simplify — Scrape and Summarize Web Content

**Simplify** is a FastAPI-based backend that allows you to scrape content from selected blogging platforms — **Medium**, **Dev.to**, or **Wix** — based on a keyword, and returns a clean, concise **AI-generated summary** of the content.

## 🚀 Features

- 🔎 Scrapes articles and blog content based on a given keyword.
- 🌐 Choose from supported platforms:
  - `medium`
  - `devto`
  - `wix`
- 🤖 Summarizes long-form content using HuggingFace Transformers (`facebook/bart-large-cnn`).
- ⚡ Parallel processing to speed up scraping and summarization.
- 📄 Returns a clean summary + original article sources.

---

## 📦 Tech Stack

- **Python 3.9+**
- **FastAPI** - Web framework
- **HuggingFace Transformers** - Summarization
- **BeautifulSoup / Selenium** - Web scraping (via ScraperFactory)
- **ThreadPoolExecutor** - For concurrent processing
- **CORS Middleware** - Cross-origin support for frontend integration

---

## 📥 Installation

```bash
# Clone the repo
git clone https://github.com/Aneeq-Ahmed-Malik/Simplify.git
cd Simplify

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
