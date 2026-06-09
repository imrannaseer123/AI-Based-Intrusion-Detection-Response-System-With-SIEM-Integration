# AI-Based Intrusion Detection & Response System with SIEM Integration

## Overview

This repository contains a full‑stack AI‑powered Intrusion Detection and Response (IDR) system that integrates with a Security Information and Event Management (SIEM) platform. The solution combines:

- **Backend** built with Django (Python) for data ingestion, processing, and API services.
- **Frontend** built with Vite + React, providing a modern, responsive UI for monitoring alerts, logs, and KPIs.
- **AI Engine** that analyses network traffic, detects anomalies, and triggers automated response actions.
- **SIEM Integration** (e.g., Splunk) for centralized logging, correlation, and advanced analytics.

The project is designed to be deployed on‑premise or in the cloud and includes Docker support for easy orchestration.

---

## Features

- Real‑time traffic capture and preprocessing.
- Machine‑learning models for anomaly detection (unsupervised & supervised).
- Automated response actions (block IP, isolate host, send alerts).
- Dashboard with live metrics, alerts, and log views.
- Integration with external SIEM (Splunk) for enriched context.
- Docker‑Compose setup for quick local development.
- Comprehensive test suite (unit & integration).

---

## Architecture Diagram

![Architecture Diagram](https://raw.githubusercontent.com/imrannaseer123/AI-Based-Intrusion-Detection-Response-System-With-SIEM-Integration/main/docs/architecture.png)

*The diagram illustrates the data flow from network sensors → AI engine → backend API → frontend UI and SIEM.*

---

## Getting Started

### Prerequisites

- **Python 3.10+** and **pip**
- **Node.js 18+** and **npm**
- **Docker & Docker‑Compose** (optional but recommended)
- A **GitHub** account with push access to this repository.

### Clone the Repository

```bash
git clone https://github.com/imrannaseer123/AI-Based-Intrusion-Detection-Response-System-With-SIEM-Integration.git
cd AI-Based-Intrusion-Detection-Response-System-With-SIEM-Integration
```

### Backend Setup

```bash
# Create virtual environment
python -m venv .venv
source .venv/Scripts/activate   # Windows PowerShell

# Install dependencies
pip install -r backend/requirements.txt

# Apply migrations and start the server
cd backend
python manage.py migrate
python manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000/`.

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The UI will be served at `http://localhost:5173/` (Vite dev server).

### Docker (All‑in‑One)

```bash
docker-compose up --build
```

This will spin up the backend, frontend, and a PostgreSQL database.

---

## Usage

1. **Login** – Use the default admin credentials (`admin / admin123`) or create a new user via the Django admin panel.
2. **Dashboard** – View live traffic statistics, anomaly scores, and active alerts.
3. **Alerts** – Click an alert to see detailed information and take actions (e.g., block IP).
4. **SIEM Integration** – Logs are forwarded to Splunk; configure the Splunk HEC endpoint in `backend/.env`.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Make your changes and ensure all tests pass.
4. Submit a Pull Request with a clear description of the changes.

### Code Style

- Python: Follow **PEP8** (use `flake8`).
- JavaScript/React: Follow **Airbnb** style guide (use `eslint`).

---

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests (if any)
cd ../frontend
npm test
```

---

## License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

## Contact

- **Author**: Imran Naseer
- **Email**: imran@example.com
- **GitHub**: [imrannaseer123](https://github.com/imrannaseer123)
