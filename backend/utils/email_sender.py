"""
backend/utils/email_sender.py

Scrapes a contact email from a URL, sends the outreach email,
and exposes a FastAPI router for the frontend "Send Email" button.

Mount in main.py:
    from utils.email_sender import router
    app.include_router(router)
"""

import os
import re
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

load_dotenv()
logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")

# ─────────────────────────────────────────────
# 1. EMAIL SCRAPING
# ─────────────────────────────────────────────

EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

CONTACT_PATH_HINTS = [
    "/contact",
    "/contact-us",
    "/about/contact",
    "/support",
    "/about",
    "/team",
]


def _fetch_html(url: str, timeout: int = 10) -> str | None:
    headers = {"User-Agent": "Mozilla/5.0 (compatible; AllyVex/1.0)"}
    try:
        resp = requests.get(url, headers=headers, timeout=timeout)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        logging.warning(f"Could not fetch {url}: {e}")
        return None


def _extract_emails_from_html(html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    candidates = set()

    for tag in soup.find_all("a", href=True):
        href = tag["href"]
        if href.startswith("mailto:"):
            addr = href[7:].split("?")[0].strip()
            if EMAIL_REGEX.match(addr):
                candidates.add(addr.lower())

    for match in EMAIL_REGEX.findall(soup.get_text()):
        candidates.add(match.lower())

    noise = {"example.com", "yourdomain.com", "domain.com", "email.com"}
    return [e for e in candidates if not any(n in e for n in noise)]


def scrape_contact_email(base_url: str) -> str | None:
    parsed = urlparse(base_url)
    origin = f"{parsed.scheme}://{parsed.netloc}"

    urls_to_try = [urljoin(origin, path) for path in CONTACT_PATH_HINTS]
    urls_to_try.append(origin)
    urls_to_try.append(base_url)

    all_emails: list[str] = []

    for url in urls_to_try:
        logging.info(f"Scanning for emails: {url}")
        html = _fetch_html(url)
        if not html:
            continue
        found = _extract_emails_from_html(html)
        if found:
            all_emails.extend(found)
            break

    if not all_emails:
        logging.warning("No email addresses found on the site.")
        return None

    priority_keywords = ["contact", "info", "hello", "sales", "support", "team"]
    for keyword in priority_keywords:
        for email in all_emails:
            if keyword in email:
                logging.info(f"Selected priority email: {email}")
                return email

    logging.info(f"Selected email: {all_emails[0]}")
    return all_emails[0]


# ─────────────────────────────────────────────
# 2. EMAIL SENDING
# ─────────────────────────────────────────────

def send_email(
    to_address: str,
    subject: str,
    body: str,
    smtp_host: str = "smtp.gmail.com",
    smtp_port: int = 587,
) -> bool:
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")

    if not sender_email or not sender_password:
        raise EnvironmentError(
            "SENDER_EMAIL and SENDER_PASSWORD must be set in your .env file."
        )

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_address
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_address, msg.as_string())
        logging.info(f"Email sent successfully to {to_address}")
        return True
    except Exception as e:
        logging.error(f"Failed to send email: {e}")
        return False


def send_outreach_from_search_result(url: str, outreach_email: dict) -> dict:
    subject = outreach_email.get("subject", "(No subject)")
    body = outreach_email.get("body", "")

    if not body:
        return {"scraped_email": None, "subject": subject,
                "success": False, "error": "Email body is empty."}

    scraped_email = scrape_contact_email(url)
    if not scraped_email:
        return {"scraped_email": None, "subject": subject,
                "success": False, "error": "Could not find a contact email on the target site."}

    success = send_email(to_address=scraped_email, subject=subject, body=body)

    return {
        "scraped_email": scraped_email,
        "subject": subject,
        "success": success,
        "error": None if success else "SMTP send failed — check logs.",
    }


# ─────────────────────────────────────────────
# 3. FASTAPI ROUTER  (for the Send Email button)
# ─────────────────────────────────────────────

router = APIRouter(prefix="/api", tags=["email"])


class SendEmailRequest(BaseModel):
    url: str
    subject: str
    body: str


class SendEmailResponse(BaseModel):
    success: bool
    scraped_email: str | None
    subject: str
    error: str | None


@router.post("/send-email", response_model=SendEmailResponse)
async def send_email_endpoint(payload: SendEmailRequest):
    result = send_outreach_from_search_result(
        url=payload.url,
        outreach_email={"subject": payload.subject, "body": payload.body},
    )
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    return SendEmailResponse(**result)