import type { BodyMeasurements, PredictionResult, AnalyticsData } from '../types';

const API_BASE = 'http://localhost:8000/api';

export async function fetchHealth(): Promise<{ status: string; model_loaded: boolean }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend health check failed');
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics data');
  return res.json();
}

export async function predictBodyFat(payload: BodyMeasurements): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Prediction request failed.');
  }

  return res.json();
}
