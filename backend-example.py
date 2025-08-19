"""
Example Python Flask Backend for Deepfake Detection
Install requirements: pip install flask flask-cors opencv-python torch torchvision pillow numpy

To run: python backend-example.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tempfile
import os
from werkzeug.utils import secure_filename
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend connection

# Configure upload settings
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'webm'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_frames(video_path, max_frames=10):
    """Extract evenly spaced frames from video"""
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    # Limit to first 30 seconds
    max_frame_count = min(total_frames, int(30 * fps))
    
    # Calculate frame indices to extract
    if max_frame_count <= max_frames:
        frame_indices = list(range(max_frame_count))
    else:
        step = max_frame_count // max_frames
        frame_indices = [i * step for i in range(max_frames)]
    
    frames = []
    for frame_idx in frame_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if ret:
            frames.append(frame)
    
    cap.release()
    return frames

def analyze_frames_for_deepfake(frames):
    """
    TODO: Replace this with your actual trained model
    This is a placeholder that returns mock results
    """
    
    # Simulate processing time
    time.sleep(2)
    
    # TODO: Load your trained PyTorch/TensorFlow model here
    # model = torch.load('your_deepfake_model.pth')
    # predictions = model.predict(frames)
    
    # Mock analysis - replace with real model inference
    suspicious_count = 0
    artifacts = []
    
    # Placeholder analysis logic
    if len(frames) > 5:
        suspicious_count = np.random.randint(0, len(frames) // 2)
        if suspicious_count > 0:
            artifacts = [
                "Inconsistent facial features detected",
                "Unnatural eye movement patterns",
                "Temporal inconsistencies in lighting"
            ]
    
    # Calculate confidence and prediction
    if suspicious_count == 0:
        prediction = "Real"
        confidence = np.random.randint(85, 95)
        explanation = "No significant AI artifacts detected. Natural facial movements and consistent lighting throughout frames."
    elif suspicious_count > len(frames) * 0.6:
        prediction = "AI-generated"
        confidence = np.random.randint(80, 95)
        explanation = f"Multiple suspicious artifacts detected in {suspicious_count} out of {len(frames)} frames, indicating likely AI generation."
    else:
        prediction = "Uncertain"
        confidence = np.random.randint(50, 70)
        explanation = f"Some suspicious patterns detected, but results are inconclusive. Quality may be insufficient for reliable detection."
    
    return {
        "prediction": prediction,
        "confidence": confidence,
        "explanation": explanation,
        "frameAnalysis": {
            "totalFrames": len(frames),
            "suspiciousFrames": suspicious_count,
            "artifacts": artifacts
        }
    }

@app.route('/api/analyze', methods=['POST'])
def analyze_video():
    try:
        # Check if video file is present
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        file = request.files['video']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Please upload MP4, AVI, MOV, or WebM'}), 400
        
        # Save uploaded file temporarily
        filename = secure_filename(file.filename)
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, filename)
        file.save(temp_path)
        
        try:
            # Extract frames from video
            frames = extract_frames(temp_path)
            
            if not frames:
                return jsonify({'error': 'Could not extract frames from video'}), 400
            
            # Analyze frames for deepfake detection
            result = analyze_frames_for_deepfake(frames)
            
            return jsonify(result)
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
            os.rmdir(temp_dir)
            
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Deepfake detection API is running'})

if __name__ == '__main__':
    print("Starting Deepfake Detection Backend...")
    print("Frontend should connect to: http://localhost:8000/api")
    app.run(host='0.0.0.0', port=8000, debug=True)