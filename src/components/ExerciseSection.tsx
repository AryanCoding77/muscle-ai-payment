import { useEffect, useState } from "react";
import { MuscleData } from "../types/muscle";
import { getExercisesForMuscles } from "../services/exerciseDbService";
import ExerciseCard from "./ExerciseCard";

type Exercise = {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  instructions: string[] | string;
};

type ExerciseSectionProps = {
  muscles: MuscleData[];
};

export default function ExerciseSection({ muscles }: ExerciseSectionProps) {
  const [exercisesByMuscle, setExercisesByMuscle] = useState<
    Record<string, Exercise[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "bad" | "avg" | "good">(
    "all"
  );
  const [expandedMuscles, setExpandedMuscles] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    async function fetchExercises() {
      try {
        setIsLoading(true);
        const exercises = await getExercisesForMuscles(muscles, 3);
        setExercisesByMuscle(exercises);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setError("Failed to load exercises. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    if (muscles.length > 0) {
      fetchExercises();
    }
  }, [muscles]);

  // Initialize expanded state for muscles
  useEffect(() => {
    if (muscles.length > 0) {
      // By default, expand muscles that need work (rating <= 5)
      const initialExpandedState: Record<string, boolean> = {};
      muscles.forEach((muscle) => {
        initialExpandedState[muscle.name] = muscle.rating <= 5;
      });
      setExpandedMuscles(initialExpandedState);
    }
  }, [muscles]);

  // Filter muscles based on active tab
  const getFilteredMuscles = (): MuscleData[] => {
    if (activeTab === "all") return muscles;
    if (activeTab === "bad") return muscles.filter((m) => m.rating <= 5);
    if (activeTab === "avg")
      return muscles.filter((m) => m.rating > 5 && m.rating < 7);
    if (activeTab === "good") return muscles.filter((m) => m.rating >= 7);
    return muscles;
  };

  const filteredMuscles = getFilteredMuscles();

  // Get tab class based on active state
  const getTabClass = (tabName: "all" | "bad" | "avg" | "good") => {
    const baseClass = "px-4 py-2 font-medium text-sm rounded-t-lg";
    const activeClass = "bg-white text-blue-600 border-b-2 border-blue-600";
    const inactiveClass = "text-gray-500 hover:text-gray-700 hover:bg-gray-100";

    return `${baseClass} ${
      activeTab === tabName ? activeClass : inactiveClass
    }`;
  };

  // Toggle muscle section expansion
  const toggleMuscleExpansion = (muscleName: string) => {
    setExpandedMuscles((prev) => ({
      ...prev,
      [muscleName]: !prev[muscleName],
    }));
  };

  // Get indicator color based on muscle rating
  const getRatingColor = (rating: number): string => {
    if (rating <= 5) return "bg-red-500";
    if (rating < 7) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (muscles.length === 0) {
    return null;
  }

  // Count muscles by rating category
  const needsWorkCount = muscles.filter((m) => m.rating <= 5).length;
  const averageCount = muscles.filter(
    (m) => m.rating > 5 && m.rating < 7
  ).length;
  const goodCount = muscles.filter((m) => m.rating >= 7).length;

  return (
    <section className="mt-10 mb-16">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Recommended Exercises
      </h2>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          className={getTabClass("all")}
          onClick={() => setActiveTab("all")}
        >
          All Muscles
        </button>
        <button
          className={getTabClass("bad")}
          onClick={() => setActiveTab("bad")}
        >
          Needs Work {needsWorkCount > 0 && `(${needsWorkCount})`}
        </button>
        <button
          className={getTabClass("avg")}
          onClick={() => setActiveTab("avg")}
        >
          Average {averageCount > 0 && `(${averageCount})`}
        </button>
        <button
          className={getTabClass("good")}
          onClick={() => setActiveTab("good")}
        >
          Good {goodCount > 0 && `(${goodCount})`}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 rounded-lg text-red-600">
          {error}
        </div>
      ) : filteredMuscles.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-600">
          No muscles found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMuscles.map((muscle) => (
            <div
              key={muscle.name}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Muscle header - always visible */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleMuscleExpansion(muscle.name)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${getRatingColor(
                      muscle.rating
                    )}`}
                  ></div>
                  <h3 className="text-xl font-semibold">
                    {muscle.name}
                    <span
                      className="ml-2 text-xs font-medium px-2.5 py-0.5 rounded-full 
                      bg-gray-100 text-gray-800"
                    >
                      {muscle.rating.toFixed(1)}
                    </span>
                  </h3>
                </div>
                <div className="flex items-center">
                  {exercisesByMuscle[muscle.name]?.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-0.5 mr-2">
                      {exercisesByMuscle[muscle.name].length} exercises
                    </span>
                  )}
                  {/* Expand/collapse arrow */}
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedMuscles[muscle.name] ? "transform rotate-180" : ""
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
                </div>
              </div>

              {/* Exercises content - shown only when expanded */}
              {expandedMuscles[muscle.name] && (
                <div className="p-4 pt-2 border-t border-gray-100">
                  {exercisesByMuscle[muscle.name]?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {exercisesByMuscle[muscle.name].map((exercise) => (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          muscleRating={muscle.rating}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-md text-gray-500 mt-4">
                      No exercises found for {muscle.name}.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
