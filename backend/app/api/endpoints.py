"""
FastAPI Route Endpoints
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.bodyfat import (
    HealthResponse,
    BodyMeasurementInput,
    PredictionResponse,
    ModelInfoResponse,
    AnalyticsResponse
)
from app.services.model_service import model_service
from app.core.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.VERSION,
        "model_loaded": model_service.is_loaded()
    }


@router.get("/model-info", response_model=ModelInfoResponse)
def get_model_info():
    if not model_service.is_loaded():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Machine learning model is not available."
        )
    return model_service.get_info()


@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics():
    try:
        return model_service.get_analytics()
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/predict", response_model=PredictionResponse)
def predict_body_fat(input_data: BodyMeasurementInput):
    if not model_service.is_loaded():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Machine learning model is currently unavailable."
        )

    try:
        data_dict = input_data.model_dump()
        prediction = model_service.predict(data_dict)

        # Reference Body Fat Ranges (American Council on Exercise - ACE guidelines for Men)
        # Essential: 2-5%, Athletes: 6-13%, Fitness: 14-17%, Average: 18-24%, Obese: 25%+
        category = "Average"
        if prediction < 6:
            category = "Essential Fat"
        elif prediction < 14:
            category = "Athletes"
        elif prediction < 18:
            category = "Fitness"
        elif prediction < 25:
            category = "Acceptable / Average"
        else:
            category = "Higher Range / Excess Fat"

        return {
            "success": True,
            "prediction": prediction,
            "model": model_service.model_name,
            "unit": "percentage",
            "category": category,
            "input_summary": data_dict
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )
