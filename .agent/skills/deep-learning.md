---
name: Deep Learning Fundamentals
description: Core concepts and best practices for deep learning applications
---

# Deep Learning Fundamentals

## Neural Networks Basics

### 1. **Architecture Patterns**

```python
# Feedforward Network
class FeedForwardNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, output_size)
    
    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x
```

### 2. **Common Layers**

- **Dense/Linear**: Fully connected
- **Conv2D**: Image processing
- **LSTM/GRU**: Sequence data
- **Attention**: Transformer models
- **Dropout**: Regularization

## Training Best Practices

### 1. **Data Preparation**

```python
# Normalization
def normalize(data, mean, std):
    return (data - mean) / std

# Train/Val/Test Split
train_size = 0.7
val_size = 0.15
test_size = 0.15
```

### 2. **Loss Functions**

- **Classification**: CrossEntropyLoss
- **Regression**: MSELoss, MAELoss
- **Custom**: Implement for specific tasks

### 3. **Optimizers**

```python
# Adam (most common)
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# SGD with momentum
optimizer = torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.9)

# Learning rate scheduling
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer)
```

## Model Evaluation

### Metrics

- **Accuracy**: Overall correctness
- **Precision/Recall**: Class imbalance
- **F1 Score**: Harmonic mean
- **AUC-ROC**: Classification quality

## Deployment

### Model Serving

```python
# Save model
torch.save(model.state_dict(), 'model.pth')

# Load for inference
model.load_state_dict(torch.load('model.pth'))
model.eval()

# Inference
with torch.no_grad():
    output = model(input_tensor)
```

## Resources

- PyTorch Documentation
- TensorFlow Guides
- Papers with Code
