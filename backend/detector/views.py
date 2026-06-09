import logging
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Log, Alert
from .serializers import LogSerializer, AlertSerializer
from .splunk_integration import send_to_splunk, check_splunk_health
from .anomaly import detect_anomaly
from .rules import evaluate_rules

logger = logging.getLogger('detector')


# ─── ViewSets ─────────────────────────────────────────────────────────

class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all().order_by('-timestamp')
    serializer_class = LogSerializer


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all().order_by('-timestamp')
    serializer_class = AlertSerializer


# ─── Health Check ─────────────────────────────────────────────────────

@api_view(['GET'])
def health_view(request):
    """System health check — verifies Django + Splunk connectivity."""
    splunk = check_splunk_health()
    return Response({
        "django": "running",
        "port": request.META.get('SERVER_PORT', 'unknown'),
        "splunk": splunk,
        "ai_engine": "loaded",
        "rule_engine": "loaded",
    }, status=status.HTTP_200_OK)


# ─── Detection Pipeline ──────────────────────────────────────────────

@api_view(['POST'])
def detect_view(request):
    """
    Main detection endpoint.
    1. Logs the activity to DB
    2. Runs AI anomaly detection
    3. Runs rule-based detection
    4. Creates alert if suspicious
    5. Forwards to Splunk HEC
    """
    data = request.data
    activity = data.get('activity', '')
    user = data.get('user', 'system')

    # 1. Log to DB
    log = Log.objects.create(user=user, activity=activity, severity='info')
    logger.info("New event from %s: %s", user, activity[:80])

    # 2. AI Anomaly Detection
    anomaly_status = detect_anomaly(activity)

    # 3. Rule-based Detection
    rule_status = evaluate_rules(activity)

    is_suspicious = anomaly_status != 'Normal' or rule_status != 'Normal'

    alert = None
    if is_suspicious:
        log.severity = 'high' if anomaly_status == 'High Risk' or rule_status == 'High Risk' else 'warning'
        log.save()

        risk_level = 'High' if anomaly_status == 'High Risk' or rule_status == 'High Risk' else 'Medium'
        alert_msg = f"AI: {anomaly_status} | Rules: {rule_status} | {activity}"

        alert = Alert.objects.create(
            alert_type='Malicious Activity',
            risk_level=risk_level,
            message=alert_msg,
        )
        logger.warning("ALERT generated: %s [%s]", risk_level, activity[:60])

    # 4. Send to Splunk
    splunk_payload = {
        'user': user,
        'activity': activity,
        'ai_analysis': anomaly_status,
        'rule_analysis': rule_status,
        'suspicious': is_suspicious,
    }
    splunk_resp = send_to_splunk(splunk_payload)

    response_data = {
        'log': LogSerializer(log).data,
        'anomaly_status': anomaly_status,
        'rule_status': rule_status,
        'splunk_response': splunk_resp,
    }

    if alert:
        response_data['alert'] = AlertSerializer(alert).data

    return Response(response_data, status=status.HTTP_200_OK)


# ─── Manual Splunk Push ──────────────────────────────────────────────

@api_view(['POST'])
def send_to_splunk_view(request):
    """Manually push arbitrary data to Splunk HEC."""
    data = request.data
    response = send_to_splunk(data)
    if response and response.get('code') == 0:
        return Response({"status": "Success", "splunk_response": response}, status=status.HTTP_200_OK)
    return Response({"status": "Failed", "splunk_response": response}, status=status.HTTP_400_BAD_REQUEST)
