from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend compatibility

@app.route('/api/logs/', methods=['GET'])
def get_logs():
    return jsonify([
        {
            "id": 1,
            "timestamp": datetime.now().isoformat(),
            "message": "User login successful",
            "severity": "info",
            "source": "192.168.1.10"
        },
        {
            "id": 2,
            "timestamp": datetime.now().isoformat(),
            "message": "Multiple failed login attempts detected",
            "severity": "warning",
            "source": "192.168.1.15"
        },
        {
            "id": 3,
            "timestamp": datetime.now().isoformat(),
            "message": "Suspicious payload injected",
            "severity": "critical",
            "source": "192.168.1.22"
        }
    ])

@app.route('/api/alerts/', methods=['GET'])
def get_alerts():
    return jsonify([
        {
            "id": 101,
            "timestamp": datetime.now().isoformat(),
            "description": "Brute force attack signature detected",
            "severity": "high"
        },
        {
            "id": 102,
            "timestamp": datetime.now().isoformat(),
            "description": "Unusual internal traffic pattern",
            "severity": "medium"
        }
    ])

@app.route('/api/health/', methods=['GET'])
def get_health():
    return jsonify({
        "status": "ok",
        "splunk": {
            "status": "connected"
        }
    })

if __name__ == '__main__':
    print("Starting backend on port 8001...")
    # The frontend App.jsx expects the API on port 8001
    app.run(host='0.0.0.0', port=8001, debug=True)
