================================================================================
     AI-BASED INTRUSION DETECTION & RESPONSE SYSTEM WITH SIEM INTEGRATION
================================================================================ 

Project Title  : AI-Based Intrusion Detection & Response System
Domain         : Cybersecurity / Network Security / SIEM
Tech Stack     : Django, React.js, Splunk Enterprise, Scikit-learn
Author         : @imrannaseer123
Status         : Production-Ready Prototype

================================================================================
 1. PROJECT OVERVIEW
================================================================================

This project is a full-stack cybersecurity system that monitors system activity,
detects intrusions using AI and rule-based engines, logs events to a SIEM
platform (Splunk), and displays everything on a real-time enterprise dashboard.

The system combines three detection approaches:
  - Machine Learning (Isolation Forest algorithm)
  - Static Rule Correlation Engine
  - Splunk SIEM event ingestion and analysis

When suspicious activity is detected, the system automatically:
  1. Logs the event to the database
  2. Forwards the event to Splunk via HTTP Event Collector (HEC)
  3. Generates an alert with risk classification
  4. Displays it on the React dashboard in real-time

================================================================================
 2. SYSTEM ARCHITECTURE
================================================================================

The system follows a layered pipeline architecture:

  +------------------+       +------------------+       +-----------------+
  | System Activity  | ----> | Django Backend   | ----> | Splunk SIEM     |
  | (monitor.py)     |       | (Port 8001)      |       | (HEC Port 8088) |
  +------------------+       +--------+---------+       +-----------------+
                                      |
                              +-------+--------+
                              |                |
                       +------+------+  +------+------+
                       | AI Engine   |  | Rule Engine |
                       | (Isolation  |  | (Static     |
                       |  Forest)    |  |  Rules)     |
                       +------+------+  +------+------+
                              |                |
                              +-------+--------+
                                      |
                              +-------+--------+
                              | Alert Pipeline |
                              | (Database)     |
                              +-------+--------+
                                      |
                              +-------+--------+
                              | React Frontend |
                              | (Port 5173)    |
                              +-+-----------+--+


================================================================================
 3. COMPLETE WORKFLOW
================================================================================

Step-by-step flow of how the system works:

STEP 1: EVENT GENERATION
  - The monitor.py script simulates real-world system activity
  - It generates both normal events (80%) and hostile events (20%)
  - Normal examples: "User logged in", "Opened HR document"
  - Hostile examples: "powershell -windowstyle hidden -enc ...",
                      "cmd.exe /c mimikatz.exe privilege::debug"
  - Each event is sent as a POST request to Django's /api/detect/ endpoint

STEP 2: DJANGO RECEIVES THE EVENT
  - The detect_view() function in views.py processes the incoming event
  - It first saves the raw event to the SQLite database (Log model)
  - Fields stored: user, activity, timestamp, severity

STEP 3: AI ANOMALY DETECTION
  - The activity string is passed to anomaly.py
  - Features are extracted from the text:
      * Length of the activity string
      * Contains "powershell" or "pwsh" (binary flag)
      * Contains ".exe" (binary flag)
      * Contains "-enc" or "base64" (binary flag)
      * Contains ".sh", ".bat", or ".ps1" (binary flag)
  - These features are fed into a pre-trained Isolation Forest model
  - The model classifies the event as:
      * "Normal"     — benign activity
      * "Suspicious" — unusual pattern detected
      * "High Risk"  — strong anomaly signal (e.g., encoded commands)

STEP 4: RULE-BASED DETECTION
  - The same activity string is passed to rules.py
  - Three categories of rules are evaluated:

    Rule 1 — Late-Night Activity:
      If the event occurs between 2:00 AM and 5:00 AM, flag as suspicious

    Rule 2 — Known Hostile Tools:
      If the activity contains keywords like "mimikatz", "bloodhound",
      "invoke-obfuscation", or "nmap -sn", flag as High Risk

    Rule 3 — Hidden Command Execution:
      If the activity contains "-windowstyle hidden" or "-w hidden",
      flag as High Risk

  - Output: "Normal", "Suspicious", or "High Risk"

STEP 5: ALERT GENERATION
  - If EITHER the AI engine OR the rule engine flags the event:
      * The log severity is upgraded (info -> warning or high)
      * A new Alert record is created in the database
      * Alert contains: alert_type, risk_level, message, timestamp
  - Risk levels: "Medium" or "High" depending on detection severity

STEP 6: SPLUNK SIEM INTEGRATION
  - Regardless of detection result, every event is forwarded to Splunk
  - The splunk_integration.py module sends a POST request to Splunk HEC:
      * URL: http://localhost:8088/services/collector/event
      * Headers include: Authorization token, X-Splunk-Request-Channel (UUID)
      * Payload includes: user, activity, ai_analysis, rule_analysis, suspicious flag
  - Splunk indexes the event for further search and correlation

STEP 7: FRONTEND DISPLAY
  - The React dashboard polls the Django API every 4 seconds
  - It fetches: GET /api/logs/, GET /api/alerts/, GET /api/health/
  - The dashboard displays:
      * KPI cards (total logs, active alerts, high risk count, system status)
      * Timeline chart (events over time vs anomalies)
      * Severity distribution bar chart
      * Filterable logs table with severity highlighting
      * Active alerts panel with color-coded risk cards
  - Status indicators show backend and Splunk connectivity in real-time


================================================================================
 4. TECHNOLOGY STACK
================================================================================

BACKEND:
  - Python 3.10+
  - Django (web framework)
  - Django REST Framework (API layer)
  - django-cors-headers (cross-origin requests)
  - SQLite (database)

MACHINE LEARNING:
  - Scikit-learn (Isolation Forest algorithm)
  - NumPy (numerical computation)
  - Pandas (data manipulation)

SIEM (Security Information & Event Management):
  - Splunk Enterprise
  - HTTP Event Collector (HEC) on port 8088
  - Token-based authentication
  - X-Splunk-Request-Channel header for data integrity

FRONTEND:
  - React.js 18 (functional components with hooks)
  - Tailwind CSS (utility-first styling)
  - Recharts (line charts, bar charts)
  - Framer Motion (subtle animations)
  - Lucide React (icon library)
  - Axios (HTTP client)
  - Vite (build tool and dev server)


================================================================================
 5. INTEGRATION DETAILS
================================================================================

5.1 DJANGO <-> SPLUNK INTEGRATION
---------------------------------
  Module: backend/detector/splunk_integration.py

  How it works:
    - Reads SPLUNK_HEC_URL and SPLUNK_HEC_TOKEN from Django settings
    - Django settings read these from environment variables with fallbacks
    - On each detection event, sends a JSON payload to Splunk HEC
    - Uses requests.post() with verify=False (for self-signed certs)
    - Timeout set to 5 seconds to prevent hanging
    - Returns parsed JSON response from Splunk (code: 0 = success)

  Headers sent:
    Authorization: Splunk <token>
    Content-Type: application/json
    X-Splunk-Request-Channel: <random-uuid>

  Health check:
    - check_splunk_health() function sends a test event to Splunk
    - Returns "connected" or "error" with details
    - Used by /api/health/ endpoint for live monitoring

5.2 DJANGO <-> REACT INTEGRATION
---------------------------------
  - React fetches data using Axios HTTP client
  - API base URL: http://localhost:8001/api
  - Polling interval: every 4 seconds using setInterval + useEffect
  - CORS is enabled on Django side (django-cors-headers, CORS_ALLOW_ALL_ORIGINS=True)
  - Data flows: Django REST API -> JSON response -> React state -> UI rendering

  API endpoints consumed by frontend:
    GET  /api/logs/     -> Populates logs table and chart data
    GET  /api/alerts/   -> Populates alert cards and KPI counters
    GET  /api/health/   -> Updates backend/Splunk status indicators

5.3 MONITOR <-> DJANGO INTEGRATION
-----------------------------------
  Module: backend/detector/monitor.py

  - Standalone Python script (runs independently)
  - Sends POST requests to http://localhost:8001/api/detect/
  - Payload format: {"user": "<name>", "activity": "<description>"}
  - 80% of events are normal, 20% are hostile (randomized)
  - Sends one event every 2-6 seconds (randomized interval)
  - Handles connection errors gracefully (prints warning if Django is down)

5.4 AI ENGINE INTEGRATION
--------------------------
  Module: backend/detector/anomaly.py

  - Isolation Forest model is trained at module import time
  - Training data: 20+ samples of normal behavior patterns
  - Contamination parameter: 0.1 (expects ~10% anomalies)
  - Feature vector: [length, has_powershell, has_exe, has_encoded, has_script]
  - Called synchronously from views.py during each /api/detect/ request
  - No external model file — model lives in memory

5.5 RULE ENGINE INTEGRATION
-----------------------------
  Module: backend/detector/rules.py

  - Imported and called directly from views.py
  - Takes activity string and optional timestamp
  - Returns classification string: "Normal", "Suspicious", or "High Risk"
  - Runs in sequence after AI detection — both results are combined


================================================================================
 6. PORT CONFIGURATION
================================================================================

  Service           Port    Notes
  -------           ----    -----
  Splunk Web UI     8000    Splunk's default management port
  Django Backend    8001    Changed from default 8000 to avoid Splunk conflict
  Splunk HEC        8088    HTTP Event Collector input endpoint
  React Frontend    5173    Vite development server default

  Why port 8001 for Django?
    Splunk Enterprise occupies port 8000 by default for its web UI.
    Running Django on 8000 would override Splunk's interface.
    The manage.py file auto-appends "8001" when running "runserver".


================================================================================
 7. DATABASE MODELS
================================================================================

  Log Model:
    - id         : Auto-increment primary key
    - user       : CharField (who performed the activity)
    - activity   : CharField (description of the event)
    - timestamp  : DateTimeField (auto-set on creation)
    - severity   : CharField (info / warning / high)

  Alert Model:
    - id         : Auto-increment primary key
    - alert_type : CharField (category of the alert)
    - risk_level : CharField (Low / Medium / High / Critical)
    - message    : TextField (detailed alert description)
    - timestamp  : DateTimeField (auto-set on creation)


================================================================================
 8. API ENDPOINTS
================================================================================

  Method   Endpoint              Description
  ------   --------              -----------
  GET      /api/health/          System health check + Splunk status
  GET      /api/logs/            List all logged events (newest first)
  GET      /api/alerts/          List all generated alerts (newest first)
  POST     /api/detect/          Submit activity for AI + rule analysis
  POST     /api/send-to-splunk/  Manually push arbitrary data to Splunk HEC

  /api/detect/ request format:
    {
      "user": "attacker_1",
      "activity": "powershell -windowstyle hidden -enc YwBhAGwAYwAuAGUAeABlAA=="
    }

  /api/detect/ response format:
    {
      "log": { ... },
      "anomaly_status": "High Risk",
      "rule_status": "High Risk",
      "splunk_response": { "text": "Success", "code": 0 },
      "alert": { ... }
    }


================================================================================
 9. FRONTEND COMPONENTS
================================================================================

  Component          File                          Purpose
  ---------          ----                          -------
  Sidebar            components/Sidebar.jsx        Left navigation panel
  Navbar             components/Navbar.jsx         Top bar with status & search
  KPICard            components/KPICard.jsx        Metric display cards
  TimelineChart      components/AlertsChart.jsx    Events over time (line chart)
  SeverityChart      components/AlertsChart.jsx    Severity breakdown (bar chart)
  LogsTable          components/LogsTable.jsx      Filterable event log table
  AlertsPanel        components/AlertsPanel.jsx    Active alerts with risk colors
  Dashboard          pages/Dashboard.jsx           Main dashboard page layout
  App                App.jsx                       Root layout + data fetching


================================================================================
 10. SETUP INSTRUCTIONS
================================================================================

  Prerequisites:
    - Python 3.10+
    - Node.js 18+
    - Splunk Enterprise (with HEC enabled on port 8088)

  Step 1: Start Splunk
    Splunk should already be running as a Windows service.

  Step 2: Start Django Backend
    cd "E:\my projects\Ai 4 cyb sec int3 proj\backend"
    .\venv\Scripts\Activate.ps1
    python manage.py runserver

  Step 3: Start React Frontend
    cd "E:\my projects\Ai 4 cyb sec int3 proj\frontend"
    npm run dev

  Step 4: Start Log Simulator
    cd "E:\my projects\Ai 4 cyb sec int3 proj\backend"
    .\venv\Scripts\Activate.ps1
    python detector/monitor.py

  Step 5: Open Dashboard
    http://localhost:5173


================================================================================
 11. LOGGING & DEBUGGING
================================================================================

  Django Logging:
    - Configured in settings.py under LOGGING dictionary
    - Outputs to console AND to backend/sentinel.log
    - Logger name: "detector"
    - Logs: Splunk connection events, detection results, errors

  Health Check:
    - GET http://localhost:8001/api/health/
    - Returns JSON with: django status, port, splunk status, engine status

  Common Issues:
    - "Backend not running" in monitor.py -> Start Django first (Step 2)
    - npm run dev fails -> Make sure you cd into frontend/ directory first
    - Splunk 404 on port 8000 -> That's expected, Django is on 8001
    - "Connection refused" in Splunk -> Check if Splunk service is running


================================================================================
 12. SECURITY FEATURES IMPLEMENTED
================================================================================

  1. Isolation Forest ML model for anomaly detection
  2. Rule-based detection for known attack patterns
  3. Splunk SIEM integration for enterprise event management
  4. Real-time alert generation with risk classification
  5. Token-based Splunk HEC authentication
  6. UUID-based request channel for data integrity
  7. Structured logging for audit trail
  8. Health monitoring endpoint for system status


================================================================================
 13. PROJECT WORKING SUMMARY
================================================================================

This AI-Based Intrusion Detection System operates as a continuous, automated 
security pipeline designed to protect enterprise networks. The workflow begins 
with the continuous monitoring of network and system activities, which is 
simulated in this environment by the monitor script. As data representing user 
actions—ranging from standard operations to malicious attacks like encoded PowerShell 
execution—flows into the system, it hits the Django backend API. 

Upon receiving an event, the system does not simply log it; it actively evaluates 
the threat level through a dual-engine analysis approach. First, the Machine 
Learning engine, powered by an Isolation Forest algorithm, mathematically 
deconstructs the log into features (such as character length or the presence 
of executable extensions) to determine if the pattern represents an anomaly 
compared to baseline normal behavior. Immediately after, a static Rule Engine 
cross-references the event against a hardcoded knowledge base of known adversarial 
tactics (like off-hours activity or specific hostile tools like Mimikatz).

If either engine flags the event as anomalous or malicious, the system instantly 
generates an Alert with a corresponding risk rating (Medium, High, or Critical). 
To ensure this data is visible to security analysts, two synchronous actions 
take place: an HTTP Event Collector (HEC) pushes the raw log and its AI analysis 
securely into Splunk Enterprise for long-term SIEM indexing, and the data is 
pushed to the React-based frontend. The enterprise dashboard on the frontend 
polls this data, populating live timeline charts, updating KPI metrics, and 
highlighting high-risk events in red, thereby allowing a Security Operations 
Center (SOC) to identify and react to threats within seconds of their occurrence.


================================================================================
                              END OF DOCUMENTATION
================================================================================
