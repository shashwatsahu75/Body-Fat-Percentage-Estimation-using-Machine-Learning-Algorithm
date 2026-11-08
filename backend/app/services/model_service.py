"""
Machine Learning Model Service and Prediction Engine
"""

import os
import json
import joblib
import pandas as pd
from app.core.config import settings


class ModelService:
    def __init__(self):
        self.model_data = None
        self.pipeline = None
        self.model_name = "Not Loaded"
        self.feature_names = []
        self.metrics = {}
        self.analytics_data = None
        self.load_artifacts()

    def load_artifacts(self):
        if os.path.exists(settings.BEST_MODEL_PATH):
            try:
                self.model_data = joblib.load(settings.BEST_MODEL_PATH)
                self.pipeline = self.model_data["pipeline"]
                self.model_name = self.model_data["model_name"]
                self.feature_names = self.model_data["feature_names"]
                self.metrics = self.model_data["metrics"]
            except Exception as e:
                print(f"Error loading model: {e}")

        if os.path.exists(settings.ANALYTICS_PATH):
            try:
                with open(settings.ANALYTICS_PATH, "r") as f:
                    self.analytics_data = json.load(f)
            except Exception as e:
                print(f"Error loading analytics data: {e}")

    def is_loaded(self) -> bool:
        return self.pipeline is not None

    def predict(self, input_dict: dict) -> float:
        if not self.is_loaded():
            raise RuntimeError("Machine learning model is not loaded.")

        # Ensure exact column ordering as used in training
        df_input = pd.DataFrame([[input_dict[col] for col in self.feature_names]], columns=self.feature_names)
        raw_pred = self.pipeline.predict(df_input)[0]
        # Body fat percentage cannot be lower than 2% physiologically
        prediction = max(2.0, round(float(raw_pred), 2))
        return prediction

    def get_info(self) -> dict:
        feature_importance = None
        if self.analytics_data and "best_model" in self.analytics_data:
            feature_importance = self.analytics_data["best_model"].get("feature_importance")

        return {
            "model_name": self.model_name,
            "model_type": type(self.pipeline.named_steps["regressor"]).__name__ if self.pipeline else "Unknown",
            "features": self.feature_names,
            "target": "BodyFat (%)",
            "metrics": self.metrics,
            "feature_importance": feature_importance
        }

    def get_analytics(self) -> dict:
        if self.analytics_data:
            return self.analytics_data
        raise FileNotFoundError("Analytics artifacts not found. Please train models first.")


model_service = ModelService()
