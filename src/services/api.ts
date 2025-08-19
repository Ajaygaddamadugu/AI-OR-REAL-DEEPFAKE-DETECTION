export interface AnalysisResult {
  prediction: 'AI-generated' | 'Real' | 'Uncertain';
  confidence: number;
  explanation: string;
  frameAnalysis?: {
    totalFrames: number;
    suspiciousFrames: number;
    artifacts: string[];
  };
}

export interface ProgressCallback {
  (stage: 'uploading' | 'extracting' | 'analyzing' | 'complete', progress: number): void;
}

class DeepfakeDetectionAPI {
  private baseUrl: string;

  constructor() {
    // Replace with your actual deepfake detection backend URL
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  }

  async analyzeVideo(file: File, onProgress?: ProgressCallback): Promise<AnalysisResult> {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', file);

      // Start upload
      onProgress?.('uploading', 0);

      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if the response supports streaming for progress updates
      if (response.body) {
        return this.handleStreamingResponse(response, onProgress);
      } else {
        // Fallback for non-streaming responses
        return this.handleRegularResponse(response, onProgress);
      }
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to analyze video. Please try again.');
    }
  }

  private async handleStreamingResponse(response: Response, onProgress?: ProgressCallback): Promise<AnalysisResult> {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let result: AnalysisResult | null = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              
              if (data.type === 'progress') {
                onProgress?.(data.stage, data.progress);
              } else if (data.type === 'result') {
                result = data.result;
                onProgress?.('complete', 100);
              }
            } catch (e) {
              console.warn('Failed to parse streaming data:', line);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (!result) {
      throw new Error('No result received from analysis');
    }

    return result;
  }

  private async handleRegularResponse(response: Response, onProgress?: ProgressCallback): Promise<AnalysisResult> {
    // Simulate progress for non-streaming APIs
    const simulateProgress = async () => {
      const stages: Array<{ stage: 'uploading' | 'extracting' | 'analyzing', duration: number }> = [
        { stage: 'uploading', duration: 1000 },
        { stage: 'extracting', duration: 2000 },
        { stage: 'analyzing', duration: 3000 }
      ];

      for (const { stage, duration } of stages) {
        const steps = 20;
        const stepDuration = duration / steps;
        
        for (let i = 0; i <= steps; i++) {
          const progress = (i / steps) * 100;
          onProgress?.(stage, progress);
          await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
      }
    };

    // Start progress simulation
    const progressPromise = simulateProgress();
    
    // Get the actual result
    const result = await response.json();
    
    // Wait for progress simulation to complete
    await progressPromise;
    
    onProgress?.('complete', 100);
    
    return result;
  }

  // Mock method for testing - remove this when connecting to real backend
  async mockAnalyzeVideo(file: File, onProgress?: ProgressCallback): Promise<AnalysisResult> {
    // Simulate the analysis process
    const stages: Array<{ stage: 'uploading' | 'extracting' | 'analyzing', duration: number }> = [
      { stage: 'uploading', duration: 1500 },
      { stage: 'extracting', duration: 2000 },
      { stage: 'analyzing', duration: 3000 }
    ];

    for (const { stage, duration } of stages) {
      const steps = 20;
      const stepDuration = duration / steps;
      
      for (let i = 0; i <= steps; i++) {
        const progress = (i / steps) * 100;
        onProgress?.(stage, progress);
        await new Promise(resolve => setTimeout(resolve, stepDuration));
      }
    }

    onProgress?.('complete', 100);

    // Return mock result
    const mockResults: AnalysisResult[] = [
      {
        prediction: 'AI-generated',
        confidence: 87,
        explanation: 'Multiple frames showed unnatural facial movements, inconsistent lighting patterns, and warped edges around the subject\'s face, indicating AI generation.',
        frameAnalysis: {
          totalFrames: 10,
          suspiciousFrames: 7,
          artifacts: [
            'Unnatural eye blinking patterns',
            'Inconsistent skin texture',
            'Warped facial edges',
            'Background inconsistencies'
          ]
        }
      },
      {
        prediction: 'Real',
        confidence: 92,
        explanation: 'Analysis shows consistent lighting, natural facial movements, and authentic skin texture throughout all frames with no detectable AI artifacts.',
        frameAnalysis: {
          totalFrames: 10,
          suspiciousFrames: 0,
          artifacts: []
        }
      },
      {
        prediction: 'Uncertain',
        confidence: 64,
        explanation: 'Video quality was insufficient for reliable detection. Some frames showed potential artifacts, but results are inconclusive.',
        frameAnalysis: {
          totalFrames: 8,
          suspiciousFrames: 2,
          artifacts: [
            'Low video quality affecting analysis'
          ]
        }
      }
    ];

    return mockResults[Math.floor(Math.random() * mockResults.length)];
  }
}

export const deepfakeAPI = new DeepfakeDetectionAPI();