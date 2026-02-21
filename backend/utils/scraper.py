import httpx
from bs4 import BeautifulSoup

def scrape_website(url: str) -> str:
    """
    Fetches a company URL and returns clean readable text.
    Returns empty string if scraping fails — doc_generator handles fallback.
    """
    if not url.startswith("http"):
        url = "https://" + url

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    try:
        response = httpx.get(
            url,
            headers=headers,
            timeout=15,
            follow_redirects=True
        )
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Remove all noise
        for tag in soup(["script", "style", "nav", "footer",
                         "header", "aside", "form", "iframe",
                         "noscript", "svg", "img"]):
            tag.decompose()

        text = soup.get_text(separator="\n", strip=True)
        lines = [line.strip() for line in text.splitlines() if line.strip()]

        # Cap at 200 lines to stay within token limits
        return "\n".join(lines[:200])

    except Exception as e:
        print(f"  [SCRAPER] Failed to scrape {url}: {str(e)}")
        return ""