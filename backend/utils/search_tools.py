import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def web_search(query: str, max_results: int = 5) -> str:
    """
    Searches the web using Tavily and returns formatted results
    as a plain string to inject into model prompts.
    """
    try:
        response = tavily_client.search(
            query=query,
            search_depth="basic",
            max_results=max_results
        )
        results = response.get("results", [])
        if not results:
            return "No results found."

        formatted = ""
        for i, r in enumerate(results, 1):
            formatted += f"\n[{i}] {r.get('title', 'No title')}\n"
            formatted += f"    URL: {r.get('url', '')}\n"
            formatted += f"    {r.get('content', '')}\n"

        return formatted.strip()

    except Exception as e:
        return f"Search failed: {str(e)}"


def multi_search(queries: list[str]) -> str:
    """
    Runs multiple searches and combines all results.
    Use this when an agent needs to cover multiple angles.
    """
    all_results = ""
    for query in queries:
        all_results += f"\n\n=== Search: {query} ===\n"
        all_results += web_search(query)
    return all_results.strip()