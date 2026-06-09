# AI-Based Intrusion Detection & Response System
## Complete Setup & Run Guide

---

## Port Map

| Service          | Port  | Purpose                        |
|------------------|-------|--------------------------------|
| Splunk Web UI    | 8000  | Splunk dashboard               |
| Django Backend   | 8001  | REST API + AI detection engine |
| Splunk HEC       | 8088  | HTTP Event Collector endpoint  |
| React Frontend   | 5173  | Vite dev server (dashboard)    |

---

## Folder Structure

```
E:\my projects\Ai 4 cyb sec int3 proj\
│
├── backend\
│   ├── core\
│   │   ├── settings.py          # Django config + Splunk env vars + logging
│   │   ├── ...
```
All details same as previously. To run:

1. Reactivate the Django environment: `cd backend` `.\venv\Scripts\activate`
2. Install pip dependencies: `pip install -r requirements.txt` (this will install django etc).
3. `python manage.py makemigrations detector`
4. `python manage.py migrate`
5. `python manage.py runserver` (runs on 8001)

Frontend `cd frontend` and `npm run dev`.
Log simulator: `python backend/detector/monitor.py`
