"""
Log Simulator / Attack Traffic Generator
Sends both normal and malicious activity to the Django detection API.
"""
import requests
import time
import random
from datetime import datetime

# ── Django now runs on port 8001 (Splunk keeps 8000) ──
BASE_URL = "http://localhost:8001/api/detect/"

NORMAL_ACTIVITIES = [
    "User logged in from trusted IP",
    "Opened internal HR document",
    "Browsed to mail.example.com",
    "Checked system updates",
    "Downloaded sales_report_Q3.pdf",
    "Closed remote session gracefully",
    "Service host routine system verification",
]

SUSPICIOUS_ACTIVITIES = [
    "Failed login attempt (x5)",
    "Executed powershell.exe -NoProfile -ExecutionPolicy Bypass",
    "powershell -windowstyle hidden -enc YwBhAGwAYwAuAGUAeABlAA==",
    "Downloaded unknown_script.ps1",
    "Ran nmap -sn 192.168.1.0/24",
    "cmd.exe /c mimikatz.exe privilege::debug",
]


def simulate_activity():
    while True:
        # 80% normal traffic, 20% hostile/anomalous
        if random.random() < 0.8:
            activity = random.choice(NORMAL_ACTIVITIES)
            user = f"sys_admin_{random.randint(10, 50)}"
        else:
            activity = random.choice(SUSPICIOUS_ACTIVITIES)
            user = f"attacker_{random.randint(1, 5)}"

        payload = {"user": user, "activity": activity}

        try:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] → {activity}")
            response = requests.post(BASE_URL, json=payload, timeout=5)
            resp_json = response.json()
            ai = resp_json.get('anomaly_status', '?')
            rule = resp_json.get('rule_status', '?')
            print(f"           AI: {ai} | Rule: {rule}")
        except requests.exceptions.ConnectionError:
            print("  ✗ Backend not running — is Django on port 8001?")
        except Exception as e:
            print(f"  ✗ Error: {e}")

        time.sleep(random.randint(2, 6))


if __name__ == "__main__":
    print("═" * 50)
    print("  SENTINEL AI — Log Simulator")
    print(f"  Target: {BASE_URL}")
    print("═" * 50)
    simulate_activity()
