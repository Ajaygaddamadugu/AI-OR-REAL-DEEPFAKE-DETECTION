# Deepfake Detection Application

A professional deepfake detection system with React frontend and Python backend.

## Frontend (React + TypeScript)
- Modern UI with drag-and-drop video upload
- Real-time analysis progress tracking
- Detailed results with confidence scores
- Built with Vite, React, TypeScript, and Tailwind CSS

## Backend Setup

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Backend Server
```bash
python backend-example.py
```
The backend will start on `http://localhost:8000`

### 3. Replace Mock Analysis with Your Model

In `backend-example.py`, replace the `analyze_frames_for_deepfake()` function with your trained model:

```python
def analyze_frames_for_deepfake(frames):
    # Load your trained model
    model = torch.load('your_deepfake_model.pth')
    
    # Preprocess frames
    processed_frames = preprocess_frames(frames)
    
    # Run inference
    with torch.no_grad():
        predictions = model(processed_frames)
    
    # Process results
    return format_results(predictions)
```

## Environment Configuration

Update `.env` file with your backend URL:
```
VITE_API_URL=http://localhost:8000/api
```

For production, change to your deployed backend URL:
```
VITE_API_URL=https://your-backend-domain.com/api
```

## API Endpoints

- `POST /api/analyze` - Upload and analyze video
- `GET /api/health` - Health check

## Expected Response Format

```json
{
  "prediction": "Real" | "AI-generated" | "Uncertain",
  "confidence": 85,
  "explanation": "Analysis explanation...",
  "frameAnalysis": {
    "totalFrames": 10,
    "suspiciousFrames": 2,
    "artifacts": ["artifact1", "artifact2"]
  }
}
```

## Deployment

1. Deploy backend to cloud service (AWS, Google Cloud, Heroku)
2. Update VITE_API_URL in frontend
3. Deploy frontend to Netlify, Vercel, or similar

## Adding Your Trained Model

1. Save your PyTorch/TensorFlow model
2. Update the `analyze_frames_for_deepfake()` function
3. Add any required preprocessing steps
4. Ensure the response format matches the expected structure