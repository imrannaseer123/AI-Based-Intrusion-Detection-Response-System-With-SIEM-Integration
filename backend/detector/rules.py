from datetime import datetime

def evaluate_rules(activity, timestamp=None):
    if timestamp is None:
        timestamp = datetime.now()
        
    activity = activity.lower()
    
    # Rule 1: Late night activity (Between 2 AM and 5 AM)
    hour = timestamp.hour
    if 2 <= hour <= 5:
        return "Suspicious: Late-night activity"
        
    # Rule 2: Unknown/hostile scripts
    suspicious_keywords = ['mimikatz', 'invoke-obfuscation', 'bloodhound', 'nmap -sn']
    for kw in suspicious_keywords:
        if kw in activity:
            return "High Risk"
            
    # Rule 3: Hidden command execution
    if '-windowstyle hidden' in activity or '-w hidden' in activity:
        return "High Risk"
        
    return "Normal"
