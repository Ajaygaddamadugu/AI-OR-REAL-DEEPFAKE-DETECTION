import React from 'react';
import { Shield, AlertTriangle, HelpCircle, CheckCircle, XCircle } from 'lucide-react';

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

interface AnalysisResultsProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onNewAnalysis }) => {
  const getResultColor = (prediction: string) => {
    switch (prediction) {
      case 'Real':
        return 'green';
      case 'AI-generated':
        return 'red';
      case 'Uncertain':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getResultIcon = (prediction: string) => {
    switch (prediction) {
      case 'Real':
        return CheckCircle;
      case 'AI-generated':
        return XCircle;
      case 'Uncertain':
        return HelpCircle;
      default:
        return Shield;
    }
  };

  const color = getResultColor(result.prediction);
  const Icon = getResultIcon(result.prediction);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
        <button
          onClick={onNewAnalysis}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Analyze New Video
        </button>
      </div>

      {/* Main Result */}
      <div className={`p-6 rounded-lg border-2 mb-6 ${
        color === 'green' 
          ? 'bg-green-50 border-green-200' 
          : color === 'red' 
            ? 'bg-red-50 border-red-200'
            : color === 'yellow'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center space-x-3 mb-4">
          <Icon className={`w-8 h-8 ${
            color === 'green' 
              ? 'text-green-600' 
              : color === 'red' 
                ? 'text-red-600'
                : color === 'yellow'
                  ? 'text-yellow-600'
                  : 'text-gray-600'
          }`} />
          <div>
            <h4 className={`text-xl font-bold ${
              color === 'green' 
                ? 'text-green-900' 
                : color === 'red' 
                  ? 'text-red-900'
                  : color === 'yellow'
                    ? 'text-yellow-900'
                    : 'text-gray-900'
            }`}>
              {result.prediction}
            </h4>
            <p className={`text-sm ${
              color === 'green' 
                ? 'text-green-700' 
                : color === 'red' 
                  ? 'text-red-700'
                  : color === 'yellow'
                    ? 'text-yellow-700'
                    : 'text-gray-700'
            }`}>
              Confidence: {result.confidence}%
            </p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-4">
          <div className="bg-white bg-opacity-50 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                color === 'green' 
                  ? 'bg-green-600' 
                  : color === 'red' 
                    ? 'bg-red-600'
                    : color === 'yellow'
                      ? 'bg-yellow-600'
                      : 'bg-gray-600'
              }`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        <p className={`text-sm leading-relaxed ${
          color === 'green' 
            ? 'text-green-800' 
            : color === 'red' 
              ? 'text-red-800'
              : color === 'yellow'
                ? 'text-yellow-800'
                : 'text-gray-800'
        }`}>
          {result.explanation}
        </p>
      </div>

      {/* Frame Analysis Details */}
      {result.frameAnalysis && (
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-900">Frame Analysis Details</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Frames Analyzed</p>
              <p className="text-2xl font-bold text-gray-900">{result.frameAnalysis.totalFrames}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Suspicious Frames</p>
              <p className="text-2xl font-bold text-red-600">{result.frameAnalysis.suspiciousFrames}</p>
            </div>
          </div>

          {result.frameAnalysis.artifacts.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Detected Artifacts:</h5>
              <div className="space-y-1">
                {result.frameAnalysis.artifacts.map((artifact, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{artifact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};