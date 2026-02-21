import os
from groq import Groq
from tavily import TavilyClient
from dotenv import load_dotenv
from utils.scraper import scrape_website

load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

GENERATOR_PROMPT = """
You are a business analyst. You have been given content about a company from
two sources — their own website and external news or articles about them.

Your job is to produce a clean structured client profile document that will be
used by AI sales agents to find the right CUSTOMERS and BUSINESS PARTNERS for this company.

Structure your output exactly as follows:

COMPANY NAME:
<name>

WHAT THEY DO:
<core product or service in 2-3 plain English sentences>

WHO THEY SELL TO:
<ideal customer profile — company size, industry, decision maker role>

PROBLEMS THEY SOLVE:
<3-5 specific problems they address for customers>

KEY STRENGTHS:
<3-5 differentiators that make them competitive>

VALUE PROPOSITION:
<why customers choose them over alternatives>

TECHNOLOGIES AND INTEGRATIONS:
<tech stack, platforms, or tools they work with>

IDEAL CUSTOMER SCALE:
<what size companies are their best customers — employee count, revenue range, industry>

IDEAL PARTNER PROFILE:
<what kind of companies would make good business partners — complementary products,
shared customer base, integration potential>

RECENT DEVELOPMENTS:
<any recent news, launches, partnerships, or growth signals>

OUTPUT RULES:
- Use actual details from the content provided
- Do not invent anything not present in the source material
- Skip any section where no relevant information was found
- Write in plain professional English
- Maximum 400 words total
"""

def extract_company_name_from_url(url: str) -> str:
    name = url.replace("https://", "").replace("http://", "").replace("www.", "")
    name = name.split(".")[0].replace("-", " ").replace("_", " ").title()
    return name

def search_external_info(company_name: str) -> str:
    """
    Uses Tavily to find what the world says about this company —
    news, descriptions, reviews, recent developments.
    """
    try:
        results = []
        queries = [
            f"{company_name} product service what they do",
            f"{company_name} customers use case 2025"
        ]

        for query in queries:
            response = tavily_client.search(
                query=query,
                search_depth="basic",
                max_results=3
            )
            for r in response.get("results", []):
                content = r.get("content", "")[:300]
                title = r.get("title", "")
                source = r.get("url", "")
                results.append(f"[{title}]\n{content}\nSource: {source}")

        return "\n\n".join(results)

    except Exception as e:
        print(f"  [DOC_GEN] Tavily search failed: {str(e)}")
        return ""

def generate_client_info(url: str) -> str:
    """
    Main function. Takes a company URL, scrapes it, searches
    external sources, and generates a structured client profile.

    Returns the document as a plain text string.
    Raises ValueError if no content could be retrieved at all.
    """
    company_name = extract_company_name_from_url(url)

    # Step 1: Scrape their own website
    print(f"  [DOC_GEN] Scraping {url}...")
    scraped_content = scrape_website(url)

    if scraped_content:
        print(f"  [DOC_GEN] Website scraped successfully")
    else:
        print(f"  [DOC_GEN] Scraping failed — will rely on external search")

    # Step 2: Search for external information
    print(f"  [DOC_GEN] Searching external sources for {company_name}...")
    external_content = search_external_info(company_name)

    if external_content:
        print(f"  [DOC_GEN] External sources found")
    else:
        print(f"  [DOC_GEN] No external sources found")

    # Step 3: Fail loudly if both sources returned nothing
    if not scraped_content and not external_content:
        raise ValueError(
            f"Could not retrieve any content for {url}. "
            f"Check that the URL is correct and publicly accessible."
        )

    # Step 4: Combine both sources for the model
    combined_content = ""
    if scraped_content:
        combined_content += f"=== WEBSITE CONTENT ===\n{scraped_content}\n\n"
    if external_content:
        combined_content += f"=== EXTERNAL SOURCES ===\n{external_content}"

    # Step 5: Generate the structured document
    print(f"  [DOC_GEN] Generating client profile...")

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": GENERATOR_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Company URL: {url}\n"
                    f"Company Name: {company_name}\n\n"
                    f"{combined_content}\n\n"
                    f"Generate the structured client profile document."
                )
            }
        ],
        temperature=0.2,
        max_tokens=1000
    )

    document = response.choices[0].message.content.strip()
    print(f"  [DOC_GEN] Client profile generated successfully")
    return document