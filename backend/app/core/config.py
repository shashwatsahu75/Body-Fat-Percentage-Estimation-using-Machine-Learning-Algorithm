"""
Application Configuration Settings
"""

import os
from pydantic import BaseModel


class Settings(BaseModel):
    APP_NAME: str = "Body Fat Percentage Estimation API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    MODELS_DIR: str = os.path.join(BASE_DIR, "models")
    ARTIFACTS_DIR: str = os.path.join(BASE_DIR, "artifacts")
    BEST_MODEL_PATH: str = os.path.join(MODELS_DIR, "best_model.joblib")
    ANALYTICS_PATH: str = os.path.join(ARTIFACTS_DIR, "analytics_data.json")


settings = Settings()
