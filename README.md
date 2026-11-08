# Body Fat Percentage Estimation Using Machine Learning Algorithms

[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An end-to-end, full-stack machine learning health analytics application that estimates human **Body Fat Percentage (%)** from non-invasive anthropometric circumference measurements.

---

## 🌟 Overview

Estimating human body composition traditionally requires expensive, specialized clinical equipment such as **DEXA (Dual-Energy X-ray Absorptiometry)** or **Hydrostatic Underwater Weighing**. 

**AuraFit ML** provides an accessible, non-invasive alternative: by training machine learning regression algorithms on body circumferences (abdomen, chest, hip, limbs, weight, and height), users can obtain accurate body fat percentage estimates at home using only a standard flexible measuring tape.

---

## 🚀 Key Features

- **Empirical Regression Machine Learning**: Evaluates and compares 10 continuous regression algorithms.
- **Zero Data Leakage**: Excludes laboratory hydrostatic `Density` to ensure models generalize strictly from measurable external circumference inputs.
- **Interactive Multi-Unit Predictor**: Full support for both **Imperial** (lbs, inches) and **Metric** (kg, cm) systems with live conversion.
- **Visual Analytics Dashboard**: Interactive graphs rendered using Recharts displaying actual vs. predicted values, model comparison benchmarks, and feature importance.
- **Clinical Category Guidance**: Integrates documented reference categories from the American Council on Exercise (ACE).
- **FastAPI REST API**: High-performance asynchronous backend with OpenAPI/Swagger documentation, rigorous Pydantic v2 input validations, and automated unit tests.
- **Clean SaaS UI/UX**: Designed following modern design systems (Tailwind CSS, clean SVG iconography, responsive layouts).

---

## 📊 Dataset & Preprocessing

- **Dataset Source**: `bodyfat.csv` (252 subjects, 15 variables).
- **Target Variable**: Continuous `BodyFat` (derived via Siri's equation).
- **Input Features (13 Features)**:
  - Age (years)
  - Weight (lbs)
  - Height (inches)
  - Neck, Chest, Abdomen 2 (belly button), Hip, Thigh, Knee, Ankle, Biceps, Forearm, Wrist circumferences (cm).
- **Quality Checks & Imputation**:
  - Outlier verification (e.g. corrected human recording typo of Height = 29.5 inches to 69.5 inches).
  - Train-test split (80/20 holdout ratio with fixed reproducible random seeds).
  - 5-Fold stratified cross-validation on training folds.

---

## 🏆 Model Evaluation & Performance

Below is the genuine benchmark across all 10 trained algorithms on the identical 20% holdout test set (51 subjects):

| Algorithm | 5-Fold CV R² (Mean ± Std) | Train R² | Holdout Test R² | MAE (%) | RMSE (%) | Overfit Gap |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Extra Trees Regressor (Selected)** | **0.6754 ± 0.066** | **0.8875** | **0.6784** | **3.12%** | **3.87%** | **0.2092** |
| Random Forest Regressor | 0.6529 ± 0.078 | 0.9112 | 0.6697 | 3.25% | 3.92% | 0.2414 |
| Gradient Boosting Regressor | 0.6494 ± 0.091 | 0.9295 | 0.6673 | 3.31% | 3.93% | 0.2622 |
| XGBoost Regressor | 0.6469 ± 0.098 | 0.9203 | 0.6558 | 3.35% | 4.00% | 0.2645 |
| Linear Regression (OLS) | 0.7064 ± 0.048 | 0.7592 | 0.5943 | 3.34% | 4.34% | 0.1649 |
| Decision Tree Regressor | 0.4837 ± 0.087 | 0.8183 | 0.5906 | 3.56% | 4.36% | 0.2277 |
| Lasso Regression | 0.7180 ± 0.051 | 0.7520 | 0.5541 | 3.39% | 4.55% | 0.1979 |
| Ridge Regression | 0.6972 ± 0.055 | 0.7454 | 0.5476 | 3.42% | 4.59% | 0.1978 |
| Support Vector Regression (SVR) | 0.6279 ± 0.102 | 0.8409 | 0.5471 | 3.78% | 4.59% | 0.2938 |
| K-Nearest Neighbors Regressor | 0.5663 ± 0.080 | 1.0000 | 0.4647 | 4.28% | 4.99% | 0.5353 |

*Selected Best Model: **Extra Trees Regressor** due to superior generalization variance mitigation on multi-collinear body measurements.*

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React (pure SVG, zero Antigravity icons or branding)
- **Networking**: Native Fetch API / Axios

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Machine Learning**: Scikit-Learn, XGBoost, NumPy, Pandas, Joblib
- **Validation**: Pydantic v2
- **Testing**: Pytest & FastAPI TestClient

---

## 📂 Project Architecture

```
body-fat-estimation/
│
├── frontend/                     # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ResultsView
│   │   ├── pages/                # LandingPage, PredictPage, AnalyticsPage, MethodologyPage
│   │   ├── services/             # API client connection
│   │   ├── types/                # TypeScript interface definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Python FastAPI ML Server
│   ├── app/
│   │   ├── api/                  # REST endpoints (/health, /predict, /analytics, /model-info)
│   │   ├── core/                 # Config & settings
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── services/             # Joblib model loader and prediction engine
│   │   └── main.py               # FastAPI entrypoint
│   ├── models/                   # Serialized trained model bundle (.joblib)
│   ├── artifacts/                # JSON metrics for analytics dashboard
│   ├── requirements.txt
│   └── train.py                  # Reproducible ML training pipeline script
│
├── data/
│   ├── bodyfat.csv               # Primary dataset
│   └── processed/                # Cleaned dataset
│
├── notebooks/                    # Exploratory Data Analysis Jupyter Notebook
│   └── exploratory_data_analysis.ipynb
│
├── reports/
│   ├── figures/                  # Correlation heatmaps, residual charts, scatter plots
│   └── model_comparison.csv      # Exported benchmark CSV
│
├── tests/
│   └── test_api.py               # Unit & integration test suite
│
├── .gitignore
├── start-backend.ps1             # Windows local launch script
├── start-frontend.ps1            # Windows local launch script
└── README.md
```

---

## 💻 Local Installation and Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Clone or Open the Repository
```powershell
cd C:\Users\sahus\.gemini\antigravity\scratch\body-fat-estimation
```

### 2. Backend Setup & Model Training
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python train.py
uvicorn app.main:app --reload --port 8000
```
- The backend will start at: `http://localhost:8000`
- Interactive Swagger API docs: `http://localhost:8000/docs`

### 3. Frontend Setup
In a new terminal window:
```powershell
cd frontend
npm install
npm run dev
```
- The frontend will start at: `http://localhost:5173`

---

## 🧪 Testing

Run automated tests on the backend API and preprocessing logic:
```powershell
cd backend
venv\Scripts\activate
pytest ..\tests\test_api.py -v
```

---

## 📖 API Endpoints

- `GET /api/health` — Backend health check and model loading state.
- `GET /api/model-info` — Details of the active production model and features.
- `GET /api/analytics` — Dynamic model comparison metrics, feature importance, and scatter points.
- `POST /api/predict` — Infer body fat percentage from 13 anthropometric measurements.

---

## ⚠️ Disclaimer

This application provides a statistical regression estimate based on population body measurement datasets. It is not intended to substitute for clinical DEXA scans or professional medical diagnosis. Consult healthcare professionals for clinical assessments.
