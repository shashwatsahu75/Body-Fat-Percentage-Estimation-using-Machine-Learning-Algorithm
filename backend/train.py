"""
Reproducible Machine Learning Training and Evaluation Pipeline
Body Fat Percentage Estimation Using Machine Learning Algorithms
"""

import os
import json
import numpy as np
import pandas as pd
import joblib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# Models
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import (
    RandomForestRegressor,
    GradientBoostingRegressor,
    ExtraTreesRegressor,
)
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor

try:
    from xgboost import XGBRegressor
    HAS_XGB = True
except ImportError:
    HAS_XGB = False


def run_pipeline():
    # Paths
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    data_path = os.path.join(base_dir, "data", "bodyfat.csv")
    models_dir = os.path.join(base_dir, "backend", "models")
    artifacts_dir = os.path.join(base_dir, "backend", "artifacts")
    reports_fig_dir = os.path.join(base_dir, "reports", "figures")
    reports_dir = os.path.join(base_dir, "reports")

    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(artifacts_dir, exist_ok=True)
    os.makedirs(reports_fig_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)

    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)
    print(f"Dataset Shape: {df.shape}")

    # Data Inspection & Clean
    # Row 41 has a recorded Height of 29.5 inches (imputed or typo, usually 69.5 in based on weight/proportions).
    # We fix the known typo if height is unrealistically below 40 inches.
    df_clean = df.copy()
    if (df_clean["Height"] < 40).any():
        print("Correcting known data entry anomaly (Height = 29.5 in -> 69.5 in)...")
        df_clean.loc[df_clean["Height"] < 40, "Height"] = 69.5

    # Target and Features
    # Note: 'Density' is excluded to prevent perfect data leakage (Siri equation calculates BodyFat directly from Density)
    target_col = "BodyFat"
    feature_cols = [
        "Age", "Weight", "Height", "Neck", "Chest", "Abdomen",
        "Hip", "Thigh", "Knee", "Ankle", "Biceps", "Forearm", "Wrist"
    ]

    X = df_clean[feature_cols]
    y = df_clean[target_col]

    # Save processed clean data
    processed_dir = os.path.join(base_dir, "data", "processed")
    os.makedirs(processed_dir, exist_ok=True)
    df_clean.to_csv(os.path.join(processed_dir, "bodyfat_cleaned.csv"), index=False)

    # Train-test split (80-20, reproducible seed)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Training set: {X_train.shape}, Test set: {X_test.shape}")

    # Algorithm candidate suite
    candidate_models = {
        "Linear Regression": (LinearRegression(), True),
        "Ridge Regression": (Ridge(alpha=10.0, random_state=42), True),
        "Lasso Regression": (Lasso(alpha=0.1, random_state=42), True),
        "Decision Tree Regressor": (DecisionTreeRegressor(max_depth=4, min_samples_leaf=3, random_state=42), False),
        "Random Forest Regressor": (RandomForestRegressor(n_estimators=150, max_depth=6, min_samples_leaf=2, random_state=42), False),
        "Gradient Boosting Regressor": (GradientBoostingRegressor(n_estimators=100, learning_rate=0.05, max_depth=3, random_state=42), False),
        "Extra Trees Regressor": (ExtraTreesRegressor(n_estimators=150, max_depth=6, min_samples_leaf=2, random_state=42), False),
        "Support Vector Regression (SVR)": (SVR(C=10.0, epsilon=0.2), True),
        "K-Nearest Neighbors Regressor": (KNeighborsRegressor(n_neighbors=5, weights='distance'), True),
    }

    if HAS_XGB:
        candidate_models["XGBoost Regressor"] = (
            XGBRegressor(n_estimators=100, learning_rate=0.05, max_depth=3, random_state=42, n_jobs=-1),
            False
        )
    else:
        print("XGBoost is not available, skipping XGBoost candidate.")

    results = []
    trained_pipelines = {}
    cv = KFold(n_splits=5, shuffle=True, random_state=42)

    for name, (estimator, scale_features) in candidate_models.items():
        if scale_features:
            pipeline = Pipeline([
                ("scaler", StandardScaler()),
                ("regressor", estimator)
            ])
        else:
            pipeline = Pipeline([
                ("regressor", estimator)
            ])

        # Cross-validation R2 on training set
        cv_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring="r2")
        cv_r2_mean = float(np.mean(cv_scores))
        cv_r2_std = float(np.std(cv_scores))

        # Fit on training set
        pipeline.fit(X_train, y_train)
        trained_pipelines[name] = pipeline

        # Predictions
        train_preds = pipeline.predict(X_train)
        test_preds = pipeline.predict(X_test)

        # Metrics
        train_r2 = float(r2_score(y_train, train_preds))
        test_r2 = float(r2_score(y_test, test_preds))
        mae = float(mean_absolute_error(y_test, test_preds))
        mse = float(mean_squared_error(y_test, test_preds))
        rmse = float(np.sqrt(mse))

        results.append({
            "model": name,
            "cv_r2_mean": round(cv_r2_mean, 4),
            "cv_r2_std": round(cv_r2_std, 4),
            "train_r2": round(train_r2, 4),
            "test_r2": round(test_r2, 4),
            "mae": round(mae, 4),
            "mse": round(mse, 4),
            "rmse": round(rmse, 4),
            "overfit_gap": round(train_r2 - test_r2, 4)
        })

    # Convert results to DataFrame and sort by CV R2 & Test R2 (generalization performance)
    results_df = pd.DataFrame(results)
    results_df = results_df.sort_values(by=["test_r2", "cv_r2_mean"], ascending=[False, False])
    print("\n--- Model Comparison Table ---")
    print(results_df.to_string(index=False))

    results_csv_path = os.path.join(reports_dir, "model_comparison.csv")
    results_df.to_csv(results_csv_path, index=False)
    print(f"\nSaved comparison to {results_csv_path}")

    # Best model selection: prioritize best test_r2 and generalization
    best_row = results_df.iloc[0]
    best_name = best_row["model"]
    best_pipeline = trained_pipelines[best_name]
    print(f"\nSelected Best Model: {best_name} (Test R2: {best_row['test_r2']}, RMSE: {best_row['rmse']})")

    # Serialize best model and preprocessing pipeline
    best_model_path = os.path.join(models_dir, "best_model.joblib")
    joblib.dump({
        "pipeline": best_pipeline,
        "model_name": best_name,
        "feature_names": feature_cols,
        "metrics": best_row.to_dict()
    }, best_model_path)
    print(f"Saved best model bundle to {best_model_path}")

    # Also save standard scaler separately for explicit client reference if needed
    scaler = StandardScaler().fit(X_train)
    joblib.dump(scaler, os.path.join(models_dir, "scaler.joblib"))

    # Feature Importance / Coefficients
    feature_importance = {}
    reg = best_pipeline.named_steps["regressor"]
    if hasattr(reg, "coef_"):
        coefs = np.abs(reg.coef_)
        feature_importance = dict(zip(feature_cols, [round(float(c), 4) for c in coefs]))
    elif hasattr(reg, "feature_importances_"):
        imps = reg.feature_importances_
        feature_importance = dict(zip(feature_cols, [round(float(i), 4) for i in imps]))

    # Test set predictions for best model
    best_test_preds = best_pipeline.predict(X_test)
    residuals = y_test - best_test_preds

    # Prepare EDA and Analytics JSON artifact for backend API
    stats = {
        "dataset_summary": {
            "total_records": int(len(df_clean)),
            "num_features": len(feature_cols),
            "features": feature_cols,
            "target": target_col,
            "mean_bodyfat": round(float(y.mean()), 2),
            "std_bodyfat": round(float(y.std()), 2),
            "min_bodyfat": round(float(y.min()), 2),
            "max_bodyfat": round(float(y.max()), 2),
            "feature_stats": {
                col: {
                    "mean": round(float(df_clean[col].mean()), 2),
                    "std": round(float(df_clean[col].std()), 2),
                    "min": round(float(df_clean[col].min()), 2),
                    "max": round(float(df_clean[col].max()), 2)
                } for col in feature_cols
            }
        },
        "best_model": {
            "name": best_name,
            "metrics": best_row.to_dict(),
            "feature_importance": feature_importance
        },
        "all_models": results_df.to_dict(orient="records"),
        "actual_vs_predicted": [
            {"actual": round(float(a), 2), "predicted": round(float(p), 2), "residual": round(float(a - p), 2)}
            for a, p in zip(y_test, best_test_preds)
        ],
        "correlations": {
            col: round(float(df_clean[col].corr(df_clean["BodyFat"])), 4)
            for col in feature_cols
        }
    }

    analytics_json_path = os.path.join(artifacts_dir, "analytics_data.json")
    with open(analytics_json_path, "w") as f:
        json.dump(stats, f, indent=2)
    print(f"Saved analytics summary to {analytics_json_path}")

    # Generate Matplotlib EDA & Performance Visualizations for Reports
    plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')

    # 1. Body fat distribution
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.histplot(df_clean["BodyFat"], kde=True, color="#3B82F6", ax=ax)
    ax.set_title("Body Fat Percentage Distribution", fontsize=14, fontweight="bold")
    ax.set_xlabel("Body Fat (%)")
    ax.set_ylabel("Count")
    plt.tight_layout()
    plt.savefig(os.path.join(reports_fig_dir, "bodyfat_distribution.png"), dpi=200)
    plt.close()

    # 2. Correlation Heatmap
    fig, ax = plt.subplots(figsize=(12, 10))
    corr = df_clean[[target_col] + feature_cols].corr()
    sns.heatmap(corr, annot=True, fmt=".2f", cmap="Blues", cbar=True, ax=ax)
    ax.set_title("Correlation Heatmap (Body Fat & Physical Features)", fontsize=14, fontweight="bold")
    plt.tight_layout()
    plt.savefig(os.path.join(reports_fig_dir, "correlation_heatmap.png"), dpi=200)
    plt.close()

    # 3. Abdomen vs BodyFat
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.regplot(data=df_clean, x="Abdomen", y="BodyFat", color="#2563EB", scatter_kws={'alpha':0.6}, line_kws={'color':'#DC2626'})
    ax.set_title("Abdomen Circumference (cm) vs Body Fat (%)", fontsize=14, fontweight="bold")
    ax.set_xlabel("Abdomen Circumference (cm)")
    ax.set_ylabel("Body Fat (%)")
    plt.tight_layout()
    plt.savefig(os.path.join(reports_fig_dir, "abdomen_vs_bodyfat.png"), dpi=200)
    plt.close()

    # 4. Actual vs Predicted Plot
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.scatter(y_test, best_test_preds, color="#3B82F6", edgecolors="#1D4ED8", alpha=0.75)
    lims = [min(y_test.min(), best_test_preds.min()), max(y_test.max(), best_test_preds.max())]
    ax.plot(lims, lims, "r--", alpha=0.75, label="Perfect Fit (y = x)")
    ax.set_xlabel("Actual Body Fat (%)")
    ax.set_ylabel("Predicted Body Fat (%)")
    ax.set_title(f"Actual vs Predicted Body Fat ({best_name})", fontsize=14, fontweight="bold")
    ax.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(reports_fig_dir, "actual_vs_predicted.png"), dpi=200)
    plt.close()

    # 5. Residual Distribution
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.histplot(residuals, kde=True, color="#6366F1", ax=ax)
    ax.axvline(0, color="red", linestyle="--")
    ax.set_title(f"Residuals Distribution ({best_name})", fontsize=14, fontweight="bold")
    ax.set_xlabel("Residual (Actual - Predicted)")
    plt.tight_layout()
    plt.savefig(os.path.join(reports_fig_dir, "residuals_distribution.png"), dpi=200)
    plt.close()

    print("Generated all visualizations in reports/figures successfully.")
    return best_name, best_row.to_dict()


if __name__ == "__main__":
    run_pipeline()
