"""
API Integration and Preprocessing Unit Tests
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True


def test_model_info_endpoint():
    response = client.get("/api/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "metrics" in data
    assert len(data["features"]) == 13


def test_analytics_endpoint():
    response = client.get("/api/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "all_models" in data
    assert len(data["all_models"]) >= 9
    assert "dataset_summary" in data


def test_predict_endpoint_valid():
    sample_payload = {
        "Age": 23,
        "Weight": 154.25,
        "Height": 67.75,
        "Neck": 36.2,
        "Chest": 93.1,
        "Abdomen": 85.2,
        "Hip": 94.5,
        "Thigh": 59.0,
        "Knee": 37.3,
        "Ankle": 21.9,
        "Biceps": 32.0,
        "Forearm": 27.4,
        "Wrist": 17.1
    }
    response = client.post("/api/predict", json=sample_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["prediction"], float)
    assert 2.0 <= data["prediction"] <= 60.0


def test_predict_endpoint_invalid_input():
    # Empty payload
    response = client.post("/api/predict", json={})
    assert response.status_code == 422

    # Negative / out-of-range value
    bad_payload = {
        "Age": -5,
        "Weight": 154.25,
        "Height": 67.75,
        "Neck": 36.2,
        "Chest": 93.1,
        "Abdomen": 85.2,
        "Hip": 94.5,
        "Thigh": 59.0,
        "Knee": 37.3,
        "Ankle": 21.9,
        "Biceps": 32.0,
        "Forearm": 27.4,
        "Wrist": 17.1
    }
    response = client.post("/api/predict", json=bad_payload)
    assert response.status_code == 422
