export interface BodyMeasurements {
  Age: number;
  Weight: number; // lbs
  Height: number; // inches
  Neck: number; // cm
  Chest: number; // cm
  Abdomen: number; // cm
  Hip: number; // cm
  Thigh: number; // cm
  Knee: number; // cm
  Ankle: number; // cm
  Biceps: number; // cm
  Forearm: number; // cm
  Wrist: number; // cm
}

export interface PredictionResult {
  success: boolean;
  prediction: number;
  model: string;
  unit: string;
  category: string;
  input_summary: BodyMeasurements;
}

export interface ModelMetric {
  model: string;
  cv_r2_mean: number;
  cv_r2_std: number;
  train_r2: number;
  test_r2: number;
  mae: number;
  mse: number;
  rmse: number;
  overfit_gap: number;
}

export interface AnalyticsData {
  dataset_summary: {
    total_records: number;
    num_features: number;
    features: string[];
    target: string;
    mean_bodyfat: number;
    std_bodyfat: number;
    min_bodyfat: number;
    max_bodyfat: number;
    feature_stats: Record<string, { mean: number; std: number; min: number; max: number }>;
  };
  best_model: {
    name: string;
    metrics: ModelMetric;
    feature_importance: Record<string, number>;
  };
  all_models: ModelMetric[];
  actual_vs_predicted: Array<{ actual: number; predicted: number; residual: number }>;
  correlations: Record<string, number>;
}
