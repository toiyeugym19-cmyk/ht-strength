---
name: Machine Learning Ops (MLOps)
description: Production ML workflows, model deployment, and monitoring
---

# MLOps Skill

## ML Pipeline

### 1. **Data Pipeline**
```python
# ETL Pattern
def extract_data(source):
    return pd.read_csv(source)

def transform_data(df):
    df = df.dropna()
    df = normalize(df)
    return df

def load_data(df, target):
    df.to_parquet(target)
```

### 2. **Model Training**
```python
# Experiment tracking
import mlflow

mlflow.start_run()
mlflow.log_param("lr", 0.001)
mlflow.log_param("epochs", 100)

model.fit(X_train, y_train)

mlflow.log_metric("accuracy", accuracy)
mlflow.sklearn.log_model(model, "model")
mlflow.end_run()
```

### 3. **Model Versioning**
```python
# Model registry
import mlflow.sklearn

mlflow.sklearn.log_model(
    model,
    "model",
    registered_model_name="GymMemberClassifier"
)
```

## Deployment Patterns

### 1. **REST API**
```python
from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load('model.pkl')

@app.post("/predict")
def predict(features: dict):
    X = preprocess(features)
    pred = model.predict([X])
    return {"prediction": int(pred[0])}
```

### 2. **Batch Inference**
```python
def batch_predict(input_path, output_path):
    df = pd.read_parquet(input_path)
    df['prediction'] = model.predict(df[features])
    df.to_parquet(output_path)
```

## Monitoring

### Key Metrics
- **Model drift**: Distribution changes
- **Data drift**: Input shift
- **Prediction distribution**: Output changes
- **Latency**: Response time
- **Error rate**: Failed predictions

## CI/CD for ML

```yaml
# .github/workflows/ml-pipeline.yml
name: ML Pipeline

on: [push]

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Train model
        run: python train.py
      - name: Evaluate
        run: python evaluate.py
      - name: Deploy if improved
        run: python deploy.py
```

## Tools

- **MLflow**: Experiment tracking
- **DVC**: Data versioning
- **Kubernetes**: Orchestration
- **FastAPI**: Model serving
- **Prometheus**: Monitoring
