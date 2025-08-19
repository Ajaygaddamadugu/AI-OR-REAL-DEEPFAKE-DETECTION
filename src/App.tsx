import React, { useState } from 'react';
import { Shield, Github, ExternalLink } from 'lucide-react';
import { VideoUpload } from './components/VideoUpload';
import { AnalysisProgress } from './components/AnalysisProgress';
import { AnalysisResults, AnalysisResult } from './components/AnalysisResults';
import { deepfakeAPI } from './services/api';

type AppState = 'upload' | 'analyzing' | 'results';
type AnalysisStage = 'uploading' | 'extracting' | 'analyzing' | 'complete';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('uploading');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoSelect = (file: File) => {
    setSelectedVideo(file);
    setError(null);
  };

  const handleClearVideo = () => {
    setSelectedVideo(null);
    setState('upload');
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedVideo) return;

    setState('analyzing');
    setError(null);
    setProgress(0);

    try {
      const analysisResult = await deepfakeAPI.mockAnalyzeVideo(selectedVideo, (stage, progress) => {
        setAnalysisStage(stage);
        setProgress(progress);
      });

      setResult(analysisResult);
      setState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState('upload');
    }
  };

  const handleNewAnalysis = () => {
    setSelectedVideo(null);
    setState('upload');
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DeepFake Detector</h1>
                <p className="text-sm text-gray-500">AI-powered video authenticity analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://scintillating-raindrop-399ab5.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Detect AI-Generated Videos with Confidence
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload any video to analyze it for deepfake artifacts using advanced AI detection algorithms. 
            Get detailed insights about authenticity and confidence levels.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Main Interface */}
        <div className="space-y-6">
          {state === 'upload' && (
            <>
              <VideoUpload
                onVideoSelect={handleVideoSelect}
                selectedVideo={selectedVideo}
                onClearVideo={handleClearVideo}
                isAnalyzing={false}
              />
              
              {selectedVideo && (
                <div className="flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Analyze Video
                  </button>
                </div>
              )}
            </>
          )}

          {state === 'analyzing' && (
            <>
              <VideoUpload
                onVideoSelect={handleVideoSelect}
                selectedVideo={selectedVideo}
                onClearVideo={handleClearVideo}
                isAnalyzing={true}
              />
              
              <AnalysisProgress
                stage={analysisStage}
                progress={progress}
              />
            </>
          )}

          {state === 'results' && result && (
            <AnalysisResults
              result={result}
              onNewAnalysis={handleNewAnalysis}
            />
          )}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Frame Extraction</h4>
              <p className="text-sm text-gray-600">
                We extract up to 10 evenly spaced frames from your video for analysis
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-600">
                Advanced algorithms detect artifacts like unnatural movements and inconsistencies
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Results</h4>
              <p className="text-sm text-gray-600">
                Get a confidence score and detailed explanation of the analysis
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 DeepFake Detector. Built with advanced AI detection algorithms.</p>
            <p className="mt-2">
              <strong>Note:</strong> This tool provides analysis based on current detection methods. 
              Results should be considered alongside other verification methods.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;