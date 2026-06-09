"""
Splunk HEC (HTTP Event Collector) Integration Module
Handles all communication with the Splunk SIEM backend.
"""
import requests
import uuid
import logging
import urllib3
from django.conf import settings

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
logger = logging.getLogger('detector')

# Read from Django settings (which reads from env vars with fallbacks)
SPLUNK_HEC_URL = getattr(settings, 'SPLUNK_HEC_URL', 'http://localhost:8088/services/collector/event')
SPLUNK_HEC_TOKEN = getattr(settings, 'SPLUNK_HEC_TOKEN', 'YOUR_HEC_TOKEN_HERE')


def _get_headers():
    """Build standard HEC request headers."""
    return {
        "Authorization": f"Splunk {SPLUNK_HEC_TOKEN}",
        "Content-Type": "application/json",
        "X-Splunk-Request-Channel": str(uuid.uuid4()),
    }


def send_to_splunk(event_data, sourcetype="django_detector"):
    """
    Send an event to Splunk via HEC.
    Returns the JSON response dict on success, or an error dict on failure.
    """
    headers = _get_headers()
    payload = {
        "event": event_data,
        "sourcetype": sourcetype,
    }

    try:
        response = requests.post(
            SPLUNK_HEC_URL,
            headers=headers,
            json=payload,
            verify=False,
            timeout=5,
        )
        result = response.json()

        if response.status_code == 200 and result.get("code") == 0:
            logger.info("Splunk HEC: Event sent successfully")
            return result
        else:
            logger.warning(
                "Splunk HEC: Non-OK response %s — %s",
                response.status_code, result,
            )
            return {
                "error": "Splunk rejected event",
                "status_code": response.status_code,
                "detail": result,
            }

    except requests.exceptions.ConnectionError:
        logger.error("Splunk HEC: Connection refused — is Splunk running?")
        return {"error": "Connection refused — Splunk may not be running", "code": -1}
    except requests.exceptions.Timeout:
        logger.error("Splunk HEC: Request timed out")
        return {"error": "Request timed out", "code": -2}
    except Exception as e:
        logger.exception("Splunk HEC: Unexpected error")
        return {"error": str(e), "code": -3}


def check_splunk_health():
    """
    Quick connectivity test to Splunk HEC.
    Returns dict with 'status' ('connected' | 'error') and optional details.
    """
    try:
        resp = requests.post(
            SPLUNK_HEC_URL,
            headers=_get_headers(),
            json={"event": "health_check"},
            verify=False,
            timeout=3,
        )
        if resp.status_code == 200:
            return {"status": "connected", "hec_url": SPLUNK_HEC_URL}
        return {
            "status": "error",
            "hec_url": SPLUNK_HEC_URL,
            "status_code": resp.status_code,
            "detail": resp.text[:200],
        }
    except requests.exceptions.ConnectionError:
        return {"status": "error", "hec_url": SPLUNK_HEC_URL, "detail": "Connection refused"}
    except Exception as e:
        return {"status": "error", "hec_url": SPLUNK_HEC_URL, "detail": str(e)}
