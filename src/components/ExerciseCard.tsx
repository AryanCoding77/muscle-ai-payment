type Exercise = {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  instructions: string[] | string;
};

type ExerciseCardProps = {
  exercise: Exercise;
  muscleRating: number;
};

import { useState } from "react";

export default function ExerciseCard({
  exercise,
  muscleRating,
}: ExerciseCardProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  // Determine badge color based on muscle rating
  const getBadgeColor = () => {
    if (muscleRating < 4) return "bg-red-100 text-red-800";
    if (muscleRating < 7) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getMuscleStatus = () => {
    if (muscleRating < 4) return "Needs Work";
    if (muscleRating < 7) return "Average";
    return "Good";
  };

  // Format instructions as bullet points if they are in array format
  const renderInstructions = () => {
    if (Array.isArray(exercise.instructions)) {
      return (
        <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
          {exercise.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      );
    }

    // If it's a string (some APIs return instructions as a single string)
    if (typeof exercise.instructions === "string") {
      return (
        <p className="mt-2 text-sm text-gray-600">{exercise.instructions}</p>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Exercise GIF */}
      <div className="w-full h-48 relative bg-gray-100">
        <img
          src={exercise.gifUrl}
          alt={`${exercise.name} demonstration`}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        {/* Exercise header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-gray-900">{exercise.name}</h3>
          <span
            className={`text-xs font-medium rounded-full px-2 py-0.5 ${getBadgeColor()}`}
          >
            {getMuscleStatus()}
          </span>
        </div>

        {/* Info tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Target muscle */}
          <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-0.5">
            Target: {exercise.target}
          </span>

          {/* Equipment */}
          <span className="text-xs bg-purple-100 text-purple-800 rounded px-2 py-0.5">
            Equipment: {exercise.equipment}
          </span>
        </div>

        {/* Instructions toggle */}
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full text-left mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none flex items-center"
        >
          <span>How to perform</span>
          <svg
            className={`ml-1 w-4 h-4 transition-transform ${
              showInstructions ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Collapsible instructions */}
        {showInstructions && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            {renderInstructions()}
          </div>
        )}
      </div>
    </div>
  );
}
