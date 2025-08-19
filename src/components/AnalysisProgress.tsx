import React from 'react';
import { Loader2, Eye, Brain, CheckCircle } from 'lucide-react';

interface AnalysisProgressProps {
  stage: 'uploading' | 'extracting' | 'analyzing' | 'complete';
  progress: number;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ stage, progress }) => {
  const stages = [
    { key: 'uploading', label: 'Uploading video', icon: Loader2 },
    { key: 'extracting', label: 'Extracting frames', icon: Eye },
    { key: 'analyzing', label: 'Analyzing for AI artifacts', icon: Brain },
    { key: 'complete', label: 'Analysis complete', icon: CheckCircle }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Analysis Progress</h3>
      
      <div className="space-y-4">
        {stages.map((stageInfo, index) => {
          const Icon = stageInfo.icon;
          const isActive = index === currentStageIndex;
          const isComplete = index < currentStageIndex;
          const isPending = index > currentStageIndex;
          
          return (
            <div key={stageInfo.key} className="flex items-center space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isComplete 
                  ? 'bg-green-100 text-green-600' 
                  : isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {isActive && stageInfo.key !== 'complete' ? (
                  <Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isComplete || isActive ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {stageInfo.label}
                </p>
              </div>
              
              {isActive && stage !== 'complete' && (
                <div className="text-sm text-blue-600 font-medium">
                  {progress}%
                </div>
              )}
              
              {isComplete && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          );
        })}
      </div>
      
      {stage !== 'complete' && (
        <div className="mt-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};