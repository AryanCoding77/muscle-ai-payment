"use client";
import { useState, useRef, useEffect } from "react";
import type { MuscleData } from "@/types/muscle";
import MuscleRadarChart from "./MuscleRadarChart";
import MuscleBarChart from "./MuscleBarChart";
import MuscleDistributionChart from "./MuscleDistributionChart";
import ExerciseSection from "./ExerciseSection";
import MuscleVisualizer from "./MuscleVisualizer";

interface AnalysisDashboardProps {
  data: MuscleData[];
  originalAnalysis: string | null;
  nonVisibleMuscles: string[];
}

const AnalysisDashboard = ({ 
  data, 
  originalAnalysis, 
  nonVisibleMuscles 
}: AnalysisDashboardProps) => {
  const [activeChart, setActiveChart] = useState<"radar" | "bar">("radar");
  const [sectionsInView, setSectionsInView] = useState<{[key: string]: boolean}>({
    overview: false,
    development: false,
    exercises: false
  });
  
  const overviewRef = useRef<HTMLDivElement>(null);
  const developmentRef = useRef<HTMLDivElement>(null);
  const exercisesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target.id) {
            setSectionsInView(prev => ({
              ...prev,
              [entry.target.id]: entry.isIntersecting
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    if (overviewRef.current) observer.observe(overviewRef.current);
    if (developmentRef.current) observer.observe(developmentRef.current);
    if (exercisesRef.current) observer.observe(exercisesRef.current);

    return () => {
      if (overviewRef.current) observer.unobserve(overviewRef.current);
      if (developmentRef.current) observer.unobserve(developmentRef.current);
      if (exercisesRef.current) observer.unobserve(exercisesRef.current);
    };
  }, []);

  // Helper functions
  const getSortedMuscles = (muscles: MuscleData[]): MuscleData[] => {
    return [...muscles].sort((a, b) => a.rating - b.rating);
  };

  const calculateAverageRating = (muscles: MuscleData[]): string => {
    if (muscles.length === 0) return "N/A";
    const avg = muscles.reduce((sum, muscle) => sum + muscle.rating, 0) / muscles.length;
    return avg.toFixed(1);
  };

  const getColorClass = (rating: number): string => {
    if (rating <= 3) return "text-red-600";
    if (rating <= 6) return "text-amber-500";
    return "text-emerald-600";
  };

  const getRatingColor = (rating: number): string => {
    if (rating <= 3) return "bg-red-500";
    if (rating <= 6) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const needsImprovementMuscles = data.filter(m => m.rating < 7);
  const wellDevelopedMuscles = data.filter(m => m.rating >= 7);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Main Analysis Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {/* Needs Improvement Card */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 border-l-4 border-l-red-500 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-lg min-h-[180px] sm:min-h-[200px]">
          <h3 className="text-base sm:text-lg font-semibold text-red-700 mb-2">
            Needs Improvement
          </h3>
          {needsImprovementMuscles.length > 0 ? (
            needsImprovementMuscles
              .slice(0, 3)
              .map((muscle, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center mb-2 p-2 bg-red-50 rounded-lg"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.15}s both`
                  }}
                >
                  <span className="font-medium text-gray-800 text-sm sm:text-base">{muscle.name}</span>
                  <span className="font-bold text-red-700 text-sm sm:text-base">{muscle.rating}/10</span>
                </div>
              ))
          ) : (
            <p className="text-gray-600 italic text-sm sm:text-base">No muscles need improvement</p>
          )}
          <p className="text-xs sm:text-sm text-gray-500 mt-3">
            {needsImprovementMuscles.length} of {data.length} muscles need focus
          </p>
        </div>

        {/* Overall Status Card */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 border-l-4 border-l-blue-500 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-lg min-h-[180px] sm:min-h-[200px] flex flex-col">
          <h3 className="text-base sm:text-lg font-semibold text-blue-700 mb-1">
            Overall Status
          </h3>
          <div className="flex items-center justify-center flex-col py-2 sm:py-3 flex-1">
            <div className="text-4xl sm:text-5xl font-bold text-blue-600">
              {calculateAverageRating(data)}<span className="text-xl sm:text-2xl">/10</span>
            </div>
            <p className="text-gray-600 text-center mt-2 text-sm sm:text-base">
              Average muscle development
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-3">
              {needsImprovementMuscles.length} of {data.length} muscles need focus
            </p>
          </div>
        </div>

        {/* Well Developed Card */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 border-l-4 border-l-green-500 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-lg sm:col-span-2 lg:col-span-1 min-h-[180px] sm:min-h-[200px]">
          <h3 className="text-base sm:text-lg font-semibold text-green-700 mb-2">
            Well Developed
          </h3>
          {wellDevelopedMuscles.length > 0 ? (
            wellDevelopedMuscles
              .slice(-3)
              .reverse()
              .map((muscle, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center mb-2 p-2 bg-green-50 rounded-lg"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.15}s both`
                  }}
                >
                  <span className="font-medium text-gray-800 text-sm sm:text-base">{muscle.name}</span>
                  <span className="font-bold text-green-700 text-sm sm:text-base">{muscle.rating}/10</span>
                </div>
              ))
          ) : (
            <p className="text-gray-600 italic text-sm sm:text-base">No well-developed muscles</p>
          )}
          <p className="text-xs sm:text-sm text-gray-500 mt-3">
            {wellDevelopedMuscles.length} of {data.length} muscles are well developed
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <div 
        id="overview" 
        ref={overviewRef}
        className={`mb-10 sm:mb-16 opacity-0 translate-y-6 transition-all duration-700 ${sectionsInView.overview ? 'opacity-100 translate-y-0' : ''}`}
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Muscle Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Visualization Panel */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Muscle Development Visualization
              </h3>
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveChart("radar")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
                    activeChart === "radar"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Radar
                </button>
                <button
                  onClick={() => setActiveChart("bar")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
                    activeChart === "bar"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
            <div className="transform transition-opacity duration-500 h-64 sm:h-80 flex items-center justify-center">
              <div className="w-full h-full">
                {activeChart === "radar" && <MuscleRadarChart data={data} />}
                {activeChart === "bar" && <MuscleBarChart data={data} />}
              </div>
            </div>
          </div>

          {/* Muscle Strength Distribution */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Muscle Strength Distribution
            </h3>
            <div className="h-64 sm:h-72 md:h-80 lg:h-96">
              <MuscleDistributionChart data={data} />
            </div>
          </div>
        </div>
      </div>

      {/* Development Section */}
      <div 
        id="development" 
        ref={developmentRef}
        className={`mb-10 sm:mb-16 opacity-0 translate-y-6 transition-all duration-700 ${sectionsInView.development ? 'opacity-100 translate-y-0' : ''}`}
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Muscle Development</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Muscle Rankings Panel */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Muscle Development Ranking
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3">
              {getSortedMuscles(data).map((muscle, index) => (
                <div 
                  key={index} 
                  className="flex flex-col"
                  style={{
                    animation: `slideIn 0.5s ease-out ${index * 0.07}s both`
                  }}
                >
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs sm:text-sm font-medium text-gray-800">{muscle.name}</span>
                    <span className={`text-xs sm:text-sm font-semibold ${getColorClass(muscle.rating)}`}>
                      {muscle.rating}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5 relative overflow-hidden">
                    <div
                      className={`${getRatingColor(muscle.rating)} h-2 sm:h-2.5 rounded-full transform transition-all duration-1000`}
                      style={{ 
                        width: '0%',
                        animation: `growWidth 1.5s ease-out ${index * 0.07}s forwards`,
                        '--width': `${Math.max(muscle.rating * 10, 5)}%` 
                      } as React.CSSProperties}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Visual Muscle Map */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Visual Muscle Map
            </h3>
            <div className="mb-4 flex flex-wrap gap-2 sm:gap-4 justify-center">
              <div className="flex items-center">
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-red-500 rounded-full mr-1.5"></div>
                <span className="text-gray-700 text-xs sm:text-sm">Needs Work (1-3)</span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-amber-500 rounded-full mr-1.5"></div>
                <span className="text-gray-700 text-xs sm:text-sm">Moderate (4-6)</span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-emerald-500 rounded-full mr-1.5"></div>
                <span className="text-gray-700 text-xs sm:text-sm">Strong (7-10)</span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gray-300 rounded-full mr-1.5"></div>
                <span className="text-gray-700 text-xs sm:text-sm">No Data</span>
              </div>
            </div>
            <div className="bg-gray-50 p-2 sm:p-4 rounded-lg border border-gray-200 h-[300px] sm:h-[400px] md:h-[500px] overflow-auto">
              <div className="flex justify-center items-center h-full">
                <div className="w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px]">
                  <MuscleVisualizer
                    data={data}
                    nonVisibleMuscles={nonVisibleMuscles}
                  />
                </div>
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-xs text-gray-500 text-center">
              Hover over or click muscles to see ratings and details
            </p>
          </div>
        </div>
      </div>

      {/* Exercises Section */}
      <div 
        id="exercises" 
        ref={exercisesRef}
        className={`mb-10 sm:mb-16 opacity-0 translate-y-6 transition-all duration-700 ${sectionsInView.exercises ? 'opacity-100 translate-y-0' : ''}`}
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recommended Exercises</h2>
        </div>
      
        <ExerciseSection muscles={data} />
      </div>

      {/* Non-visible muscles note */}
      {nonVisibleMuscles.length > 0 && (
        <div className="mb-6 sm:mb-8 bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-200 transform transition-all duration-500 hover:shadow-md hover:border-blue-300">
          <div className="flex space-x-2 sm:space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-blue-800">Muscles Not Visible in This Image</h4>
              <div className="mt-1 text-xs sm:text-sm text-blue-700">
                <p className="mb-1">The following muscles could not be properly assessed from this angle:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                  {nonVisibleMuscles.map((muscle, index) => (
                    <span 
                      key={index} 
                      className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md"
                      style={{
                        animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`
                      }}
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes growWidth {
          from {
            width: 0%;
          }
          to {
            width: var(--width, 0%);
          }
        }
      `}</style>
    </div>
  );
};

export default AnalysisDashboard; 