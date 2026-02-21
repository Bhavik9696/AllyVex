import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def web_search(query: str, max_results: int = 3) -> str:
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
            # Truncate content to 200 characters per result
            content = r.get('content', '')[:200]
            formatted += f"\n[{i}] {r.get('title', '')}\n"
            formatted += f"    URL: {r.get('url', '')}\n"
            formatted += f"    {content}\n"

        return formatted.strip()

    except Exception as e:
        return f"Search failed: {str(e)}"


def multi_search(queries: list[str]) -> str:
    all_results = ""
    for query in queries:
        all_results += f"\n=== {query} ===\n"
        all_results += web_search(query, max_results=2)  # Reduced to 2 per query
    return all_results.strip()