import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

# Feature extraction: Length, contains_exe, contains_powershell, contains_encoded
def extract_features(activity_str):
    activity_str = activity_str.lower()
    length = len(activity_str)
    has_ps = 1 if 'powershell' in activity_str or 'pwsh' in activity_str else 0
    has_exe = 1 if '.exe' in activity_str else 0
    has_encoded = 1 if '-enc' in activity_str or 'base64' in activity_str else 0
    has_script = 1 if '.sh' in activity_str or '.bat' in activity_str or '.ps1' in activity_str else 0
    
    return [length, has_ps, has_exe, has_encoded, has_script]

# Mock training logic for Isolation Forest.
# A real scenario would load a pretrained joblib payload. 
X_train_normal = [
    extract_features("User logged in successfully"),
    extract_features("Opened document report.docx"),
    extract_features("Browsed to internal portal"),
    extract_features("Downloaded invoice.pdf"),
    extract_features("System update check")
]

# Increase basic variation pool
for _ in range(15):
    X_train_normal.append(extract_features("Normal user background process generated randomly"))

clf = IsolationForest(random_state=42, contamination=0.1)
clf.fit(X_train_normal)

def detect_anomaly(activity):
    features = extract_features(activity)
    
    # Overrides for immediate extreme flags 
    if features[3] == 1: # Encoded commands strongly associated with malware
        return "High Risk"
        
    pred = clf.predict([features])
    
    if pred[0] == -1: # Anomaly detected by ML mode
        if features[1] == 1 or features[2] == 1: 
            return "High Risk"
        return "Suspicious"
        
    return "Normal"
