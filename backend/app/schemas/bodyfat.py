"""
Pydantic Data Schemas for Body Fat Estimation
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    model_loaded: bool


class BodyMeasurementInput(BaseModel):
    Age: float = Field(..., ge=10, le=120, description="Age in years (10 - 120)")
    Weight: float = Field(..., ge=50, le=500, description="Weight in lbs (50 - 500 lbs)")
    Height: float = Field(..., ge=40, le=95, description="Height in inches (40 - 95 inches)")
    Neck: float = Field(..., ge=20, le=70, description="Neck circumference in cm (20 - 70 cm)")
    Chest: float = Field(..., ge=50, le=170, description="Chest circumference in cm (50 - 170 cm)")
    Abdomen: float = Field(..., ge=50, le=180, description="Abdomen 2 circumference in cm (50 - 180 cm)")
    Hip: float = Field(..., ge=60, le=180, description="Hip circumference in cm (60 - 180 cm)")
    Thigh: float = Field(..., ge=30, le=100, description="Thigh circumference in cm (30 - 100 cm)")
    Knee: float = Field(..., ge=20, le=60, description="Knee circumference in cm (20 - 60 cm)")
    Ankle: float = Field(..., ge=15, le=45, description="Ankle circumference in cm (15 - 45 cm)")
    Biceps: float = Field(..., ge=18, le=65, description="Extended biceps circumference in cm (18 - 65 cm)")
    Forearm: float = Field(..., ge=15, le=50, description="Forearm circumference in cm (15 - 50 cm)")
    Wrist: float = Field(..., ge=10, le=30, description="Wrist circumference in cm (10 - 30 cm)")


class PredictionResponse(BaseModel):
    success: bool
    prediction: float
    model: str
    unit: str
    category: Optional[str] = None
    input_summary: Dict[str, float]


class ModelInfoResponse(BaseModel):
    model_name: str
    model_type: str
    features: List[str]
    target: str
    metrics: Dict[str, Any]
    feature_importance: Optional[Dict[str, float]] = None


class AnalyticsResponse(BaseModel):
    dataset_summary: Dict[str, Any]
    best_model: Dict[str, Any]
    all_models: List[Dict[str, Any]]
    actual_vs_predicted: List[Dict[str, float]]
    correlations: Dict[str, float]
