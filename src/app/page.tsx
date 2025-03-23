"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MuscleData } from "../types/muscle";
import MuscleRadarChart from "../components/MuscleRadarChart";
import MuscleBarChart from "../components/MuscleBarChart";
import MuscleDistributionChart from "../components/MuscleDistributionChart";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [parsedMuscles, setParsedMuscles] = useState<MuscleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeChart, setActiveChart] = useState<"radar" | "bar">("radar");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setAnalysis(null);
    setError(null);
    setParsedMuscles([]);

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Display the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      setError("Please select an image first");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", fileInputRef.current.files[0]);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze image");
      }

      if (!data.analysis) {
        throw new Error("No analysis data returned from model");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Parse the text analysis into structured data for visualization
  useEffect(() => {
    if (!analysis) return;

    try {
      // Simple regex-based parsing of the muscle data
      const muscleRegex =
        /\d+\.\s+\*\*([^*:]+)(?:\*\*)?:\s*(?:The .+?)?(?:Development:|Rating:)?\s*(\d+)\/10/g;
      const exerciseRegex =
        /\*\s+(?:Exercises to improve:|Suggested exercises:)(.*?)(?=\d+\.|$|\n\n)/gs;

      const muscles: MuscleData[] = [];
      let match;

      // Clone the analysis for regex operations
      let text = analysis;

      while ((match = muscleRegex.exec(text)) !== null) {
        const fullMatch = match[0];
        const muscleName = match[1].trim();
        const rating = parseInt(match[2], 10);

        // Get section text around this match to find exercises
        const sectionStart = text.lastIndexOf("**", match.index);
        const sectionEnd = text.indexOf("**", match.index + fullMatch.length);
        const section = text.substring(
          sectionStart !== -1 ? sectionStart : 0,
          sectionEnd !== -1 ? sectionEnd + 100 : text.length
        );

        // Find exercises in this section
        const exerciseLines = section
          .split("\n")
          .filter(
            (line) =>
              line.includes("* Exercises to improve:") ||
              line.includes("* Suggested exercises:")
          );

        let exercises: string[] = [];
        if (exerciseLines.length > 0) {
          const exercisesText = exerciseLines[0];
          exercises = exercisesText
            .replace(/.*?(?:Exercises to improve:|Suggested exercises:)/, "")
            .split(/,/)
            .map((ex) => ex.trim())
            .filter((ex) => ex.length > 0);
        }

        muscles.push({
          name: muscleName,
          rating,
          exercises,
        });
      }

      // If regex fails, try another approach (simple line-by-line parsing)
      if (muscles.length === 0) {
        const lines = analysis.split("\n");
        let currentMuscle: Partial<MuscleData> = {};

        for (const line of lines) {
          if (line.match(/^\d+\.\s+([^:]+):/)) {
            // Save previous muscle if it exists
            if (currentMuscle.name && currentMuscle.rating) {
              muscles.push({
                name: currentMuscle.name,
                rating: currentMuscle.rating,
                exercises: currentMuscle.exercises || [],
              });
            }

            // Start new muscle
            currentMuscle = {
              name: line.replace(/^\d+\.\s+([^:]+):.*$/, "$1").trim(),
              exercises: [],
            };
          } else if (line.match(/rating|development/i) && currentMuscle.name) {
            const ratingMatch = line.match(/(\d+)\s*\/\s*10/);
            if (ratingMatch) {
              currentMuscle.rating = parseInt(ratingMatch[1], 10);
            }
          } else if (line.match(/suggested exercises/i) && currentMuscle.name) {
            currentMuscle.exercises = currentMuscle.exercises || [];
          } else if (line.match(/^\s*[•\-\*]\s+/) && currentMuscle.exercises) {
            currentMuscle.exercises.push(
              line.replace(/^\s*[•\-\*]\s+/, "").trim()
            );
          }
        }

        // Add the last muscle if it exists
        if (currentMuscle.name && currentMuscle.rating) {
          muscles.push({
            name: currentMuscle.name,
            rating: currentMuscle.rating,
            exercises: currentMuscle.exercises || [],
          });
        }
      }

      // If the first approach fails, try a more structured approach for the specific format
      if (muscles.length === 0) {
        // Look for sections by body region
        const bodySections = analysis
          .split(/\*\*([^*]+):\*\*/g)
          .filter(
            (section) =>
              section.trim().length > 0 &&
              !section.includes("Based on the image")
          );

        for (let i = 0; i < bodySections.length; i += 2) {
          // Skip if we're at the end of the array or if this is not a section title
          if (i + 1 >= bodySections.length) continue;

          const sectionContent = bodySections[i + 1];

          // Extract muscles in this section using a different regex pattern
          const sectionMuscleRegex =
            /\d+\.\s+\*\*([^*:]+)\*\*\s+([^.]*).*?Development:\s*(\d+)\/10[^*]*/g;
          let muscleMatch;

          while (
            (muscleMatch = sectionMuscleRegex.exec(sectionContent)) !== null
          ) {
            const muscleName = muscleMatch[1].trim();
            const description = muscleMatch[2].trim();
            const rating = parseInt(muscleMatch[3], 10);

            // Extract exercises
            const exerciseMatch = sectionContent
              .substring(muscleMatch.index, muscleMatch.index + 300)
              .match(/\*\s+Exercises to improve:([^*]*)/);

            let exercises: string[] = [];
            if (exerciseMatch && exerciseMatch[1]) {
              exercises = exerciseMatch[1]
                .split(",")
                .map((ex) => ex.trim())
                .filter((ex) => ex.length > 0);
            }

            muscles.push({
              name: muscleName,
              rating,
              exercises,
            });
          }
        }
      }

      // If everything else fails, try a line-by-line approach
      if (muscles.length === 0) {
        console.log("Falling back to line-by-line parsing");
        const lines = analysis.split("\n");
        let currentMuscle: Partial<MuscleData> = {};

        for (const line of lines) {
          // Check if line contains a muscle name with rating
          const muscleRatingMatch = line.match(
            /\d+\.\s+\*\*([^*:]+)\*\*.*?(\d+)\/10/
          );
          if (muscleRatingMatch) {
            // Save the previous muscle if it exists
            if (currentMuscle.name && currentMuscle.rating) {
              muscles.push({
                name: currentMuscle.name,
                rating: currentMuscle.rating,
                exercises: currentMuscle.exercises || [],
              });
            }

            // Start a new muscle
            currentMuscle = {
              name: muscleRatingMatch[1].trim(),
              rating: parseInt(muscleRatingMatch[2], 10),
              exercises: [],
            };
          }
          // Look for exercise lines
          else if (
            line.includes("Exercises to improve:") &&
            currentMuscle.name
          ) {
            const exerciseText = line.replace(/.*Exercises to improve:\s*/, "");
            currentMuscle.exercises = exerciseText
              .split(",")
              .map((ex) => ex.trim())
              .filter((ex) => ex.length > 0);
          }
        }

        // Add the last muscle if it exists
        if (currentMuscle.name && currentMuscle.rating) {
          muscles.push({
            name: currentMuscle.name,
            rating: currentMuscle.rating,
            exercises: currentMuscle.exercises || [],
          });
        }
      }

      // Final fallback: direct pattern matching for muscle names and ratings
      if (muscles.length === 0) {
        console.log("Using final fallback pattern matching");

        // Define common muscle names to look for
        const commonMuscles = [
          "Biceps",
          "Triceps",
          "Pectorals",
          "Chest",
          "Deltoids",
          "Shoulders",
          "Quadriceps",
          "Quads",
          "Hamstrings",
          "Calves",
          "Abdominals",
          "Abs",
          "Obliques",
          "Latissimus",
          "Lats",
          "Trapezius",
          "Traps",
          "Rhomboids",
          "Forearms",
          "Glutes",
          "Erector Spinae",
          "Lower Back",
        ];

        // Look for these specific muscles and their ratings
        for (const muscle of commonMuscles) {
          // Create a regex to find this muscle name and a rating near it
          const muscleRegex = new RegExp(
            `(${muscle})[^\\d]+(\\d+)\\s*\\/\\s*10`,
            "i"
          );
          const match = analysis.match(muscleRegex);

          if (match) {
            const muscleName = match[1];
            const rating = parseInt(match[2], 10);

            // Check if we already have this muscle
            if (
              !muscles.some(
                (m) => m.name.toLowerCase() === muscleName.toLowerCase()
              )
            ) {
              muscles.push({
                name: muscleName,
                rating,
                exercises: [], // We won't try to parse exercises in this fallback
              });
            }
          }
        }

        // If we found some muscles, log it
        if (muscles.length > 0) {
          console.log("Extracted muscles using final fallback:", muscles);
        }
      }

      // Try a specific parser for the exact format in the example
      if (muscles.length === 0) {
        console.log("Trying example-specific format parser");

        const lines = analysis.split("\n");
        let currentMuscle: Partial<MuscleData> = {};
        let currentExercises: string[] = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          // Check for muscle name and rating pattern: "1. **Biceps:** Development: 6/10"
          const muscleMatch = line.match(
            /\d+\.\s+\*\*([^*:]+)\*\*.*?Development:\s*(\d+)\/10/
          );
          if (muscleMatch) {
            // Save previous muscle if exists
            if (currentMuscle.name && currentMuscle.rating) {
              muscles.push({
                name: currentMuscle.name,
                rating: currentMuscle.rating,
                exercises: [...currentExercises],
              });
              currentExercises = [];
            }

            currentMuscle = {
              name: muscleMatch[1].trim(),
              rating: parseInt(muscleMatch[2], 10),
            };
          }
          // If no muscle match, check for exercise lines
          else if (
            line.includes("* Exercises to improve:") &&
            currentMuscle.name
          ) {
            // Extract the exercises text
            const exercisesText = line.replace(
              /\*\s+Exercises to improve:\s*/,
              ""
            );
            currentExercises = exercisesText
              .split(",")
              .map((ex) => ex.trim())
              .filter((ex) => ex.length > 0);
          }
        }

        // Don't forget to add the last muscle
        if (currentMuscle.name && currentMuscle.rating) {
          muscles.push({
            name: currentMuscle.name,
            rating: currentMuscle.rating,
            exercises: [...currentExercises],
          });
        }
      }

      // Add specific parser for the format in the screenshot
      if (muscles.length === 0) {
        console.log("Trying screenshot-specific format parser");

        // Split the text into lines for easier processing
        const lines = analysis
          .split("\n")
          .filter((line) => line.trim().length > 0);

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          // Look for lines that contain a number, muscle name, and rating pattern
          // Format: "1. **Biceps:** The biceps seem... Development: 6/10"
          if (/^\d+\.\s+/.test(line) && line.includes("/10")) {
            // Extract muscle name - it's between ** markers or at the start of the numbered item
            let muscleName = "";
            const nameMatch = line.match(
              /\d+\.\s+(?:\*\*)?([^*:]+?)(?:\*\*)?:/
            );
            if (nameMatch) {
              muscleName = nameMatch[1].trim();
            }

            // Extract rating - it's a number followed by /10
            let rating = 0;
            const ratingMatch = line.match(/(\d+)\/10/);
            if (ratingMatch) {
              rating = parseInt(ratingMatch[1], 10);
            }

            // If we have both a name and rating, look for exercises in the next line
            if (muscleName && rating && i + 1 < lines.length) {
              const nextLine = lines[i + 1];
              let exercises: string[] = [];

              // Exercises are usually in the line that starts with *
              if (
                nextLine.startsWith("*") &&
                (nextLine.includes("Exercises to improve:") ||
                  nextLine.includes("Suggested exercises:"))
              ) {
                const exercisesText = nextLine.replace(
                  /.*?(?:Exercises to improve:|Suggested exercises:)\s*/,
                  ""
                );
                exercises = exercisesText
                  .split(/,|;/)
                  .map((ex) => ex.trim())
                  .filter((ex) => ex.length > 0);
              }

              muscles.push({
                name: muscleName,
                rating,
                exercises,
              });
            }
          }
        }
      }

      // Plain text format parser (no markdown)
      if (muscles.length === 0) {
        console.log("Trying plain text format parser");

        const lines = analysis
          .split("\n")
          .filter((line) => line.trim().length > 0);
        let currentMuscle: Partial<MuscleData> = {};

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          // Check for lines with numbered muscle patterns
          if (/^\d+\.\s+/.test(line)) {
            // Find muscle name followed by rating
            const plainTextMatch = line.match(
              /\d+\.\s+([^:]+)(?::[^0-9]*|[^0-9]*)(\d+)\s*\/\s*10/
            );

            if (plainTextMatch) {
              // Save previous muscle if it exists
              if (currentMuscle.name && currentMuscle.rating) {
                muscles.push({
                  name: currentMuscle.name,
                  rating: currentMuscle.rating,
                  exercises: currentMuscle.exercises || [],
                });
              }

              // Extract muscle name and rating
              const muscleName = plainTextMatch[1].trim();
              const rating = parseInt(plainTextMatch[2], 10);

              currentMuscle = {
                name: muscleName,
                rating: rating,
                exercises: [],
              };
            }
          }
          // Check for lines with exercise suggestions
          else if (currentMuscle.name && /exercises/i.test(line)) {
            // Extract everything after "exercises" or ":"
            const exerciseText = line.replace(/.*?(?:exercises|:)\s*/i, "");

            if (exerciseText.trim().length > 0) {
              currentMuscle.exercises = exerciseText
                .split(/,|;/)
                .map((ex) => ex.trim())
                .filter((ex) => ex.length > 0);
            }
          }
        }

        // Don't forget to add the last muscle
        if (currentMuscle.name && currentMuscle.rating) {
          muscles.push({
            name: currentMuscle.name,
            rating: currentMuscle.rating,
            exercises: currentMuscle.exercises || [],
          });
        }
      }

      // Log the final result
      console.log("Total muscles parsed:", muscles.length);
      if (muscles.length > 0) {
        console.log("Sample muscle data:", muscles[0]);
      } else {
        console.error("Could not parse any muscle data from the analysis text");
      }

      setParsedMuscles(muscles);
    } catch (err) {
      console.error("Error parsing muscle data:", err);
    }
  }, [analysis]);

  // Get sorted muscles by rating (ascending)
  const getSortedMuscles = (muscles: MuscleData[]) => {
    return [...muscles].sort((a, b) => a.rating - b.rating);
  };

  // Get muscles that need the most training (rating < 5)
  const getMusclesNeedingTraining = (muscles: MuscleData[]) => {
    return muscles.filter((muscle) => muscle.rating < 5);
  };

  // Get muscles with highest ratings (rating > 7)
  const getStrongMuscles = (muscles: MuscleData[]) => {
    return muscles.filter((muscle) => muscle.rating > 7);
  };

  // Color for muscle rating bars
  const getRatingColor = (rating: number) => {
    if (rating <= 3) return "bg-red-500";
    if (rating <= 6) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Get background color class for muscle cards
  const getMuscleCardColor = (rating: number) => {
    if (rating <= 3) return "bg-red-50 border-red-200";
    if (rating <= 6) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">
          Muscle Analysis AI
        </h1>
        <p className="text-lg mb-8 text-center">
          Upload a photo of your body to get an analysis of which muscles need
          more work
        </p>

        <div className="flex flex-col w-full max-w-2xl mb-8">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 border-blue-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-700">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or GIF</p>
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </label>
        </div>

        {selectedImage && (
          <div className="mt-8 flex flex-col items-center">
            <div className="relative w-full max-w-md h-96 mb-6 shadow-lg rounded-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt="Selected body image"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <button
              onClick={analyzeImage}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-md"
            >
              {isLoading ? "Analyzing..." : "Analyze Muscles"}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="mt-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg shadow">
            <p className="text-center">
              Analyzing your image... This may take a few moments.
            </p>
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow">
            <p>{error}</p>
          </div>
        )}

        {analysis && parsedMuscles.length > 0 && (
          <div className="mt-8 w-full max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Muscle Analysis Results
            </h2>

            {/* Muscle Summary Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Weakest Muscles */}
              <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-l-red-500">
                <h3 className="font-semibold text-lg mb-2 text-red-700">
                  Needs Most Improvement
                </h3>
                {parsedMuscles.length > 0 &&
                  getSortedMuscles(parsedMuscles)
                    .slice(0, 3)
                    .map((muscle, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between mb-2 p-2 bg-red-50 rounded"
                      >
                        <span className="font-medium">{muscle.name}</span>
                        <span className="text-red-700 font-bold">
                          {muscle.rating}/10
                        </span>
                      </div>
                    ))}
                {parsedMuscles.length === 0 && (
                  <p className="text-gray-500 italic">No data available</p>
                )}
              </div>

              {/* Overall Status */}
              <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-l-blue-500">
                <h3 className="font-semibold text-lg mb-2 text-blue-700">
                  Overall Status
                </h3>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-3xl font-bold text-blue-800 mb-2">
                    {parsedMuscles.length > 0
                      ? `${
                          Math.round(
                            (parsedMuscles.reduce(
                              (acc, m) => acc + m.rating,
                              0
                            ) /
                              parsedMuscles.length) *
                              10
                          ) / 10
                        }/10`
                      : "N/A"}
                  </div>
                  <p className="text-center text-gray-600">
                    Average muscle development
                  </p>
                  <p className="text-center mt-2">
                    <span className="font-medium">
                      {parsedMuscles.length > 0
                        ? `${
                            getMusclesNeedingTraining(parsedMuscles).length
                          } of ${parsedMuscles.length} muscles need focus`
                        : "No data"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Strongest Muscles */}
              <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-l-green-500">
                <h3 className="font-semibold text-lg mb-2 text-green-700">
                  Well Developed
                </h3>
                {parsedMuscles.length > 0 &&
                  getSortedMuscles(parsedMuscles)
                    .slice(-3)
                    .reverse()
                    .map((muscle, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between mb-2 p-2 bg-green-50 rounded"
                      >
                        <span className="font-medium">{muscle.name}</span>
                        <span className="text-green-700 font-bold">
                          {muscle.rating}/10
                        </span>
                      </div>
                    ))}
                {parsedMuscles.length === 0 && (
                  <p className="text-gray-500 italic">No data available</p>
                )}
              </div>
            </div>

            {/* Charts Section */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart Selection Tabs */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-medium mb-4 text-gray-800">
                  Muscle Development Visualization
                </h3>
                <div className="tabs flex mb-4">
                  <button
                    onClick={() => setActiveChart("radar")}
                    className={`px-4 py-2 ${
                      activeChart === "radar"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    } rounded-l-lg transition-colors`}
                  >
                    Radar Chart
                  </button>
                  <button
                    onClick={() => setActiveChart("bar")}
                    className={`px-4 py-2 ${
                      activeChart === "bar"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    } rounded-r-lg transition-colors`}
                  >
                    Bar Chart
                  </button>
                </div>

                {activeChart === "radar" && (
                  <MuscleRadarChart data={parsedMuscles} />
                )}
                {activeChart === "bar" && (
                  <MuscleBarChart data={parsedMuscles} />
                )}
              </div>

              {/* Muscle Distribution Pie Chart */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-medium mb-4 text-gray-800">
                  Muscle Strength Distribution
                </h3>
                <MuscleDistributionChart data={parsedMuscles} />
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-red-50 rounded border border-red-200">
                    <div className="font-medium">Weak (1-3)</div>
                    <div className="text-xl font-bold text-red-600">
                      {parsedMuscles.filter((m) => m.rating <= 3).length}
                    </div>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                    <div className="font-medium">Moderate (4-6)</div>
                    <div className="text-xl font-bold text-yellow-600">
                      {
                        parsedMuscles.filter(
                          (m) => m.rating > 3 && m.rating <= 6
                        ).length
                      }
                    </div>
                  </div>
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <div className="font-medium">Strong (7-10)</div>
                    <div className="text-xl font-bold text-green-600">
                      {parsedMuscles.filter((m) => m.rating > 6).length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Muscle Ranking Chart */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-medium mb-4 text-gray-800">
                Muscle Development Ranking
              </h3>
              <div className="space-y-3">
                {parsedMuscles.length > 0 &&
                  getSortedMuscles(parsedMuscles).map((muscle, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-1/4 md:w-1/5 pr-4">
                        <span
                          className={`text-sm font-medium ${
                            muscle.rating < 5
                              ? "text-red-700"
                              : muscle.rating > 7
                              ? "text-green-700"
                              : "text-yellow-700"
                          }`}
                        >
                          {muscle.name}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-5 flex items-center overflow-hidden">
                          <div
                            className={`${getRatingColor(
                              muscle.rating
                            )} h-5 rounded-full flex items-center justify-center text-xs text-white font-bold px-2 transition-all duration-500`}
                            style={{
                              width: `${Math.max(muscle.rating * 10, 15)}%`,
                            }}
                          >
                            {muscle.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {parsedMuscles.length === 0 && (
                  <p className="text-gray-500 italic">
                    No muscle data available
                  </p>
                )}
              </div>
            </div>

            {/* Visual Chart for Muscle Development */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-medium mb-4 text-gray-800">
                Detailed Muscle Ratings
              </h3>
              <div className="space-y-4">
                {parsedMuscles.map((muscle, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span className="text-base font-medium text-gray-700">
                        {muscle.name}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {muscle.rating}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`${getRatingColor(
                          muscle.rating
                        )} h-4 rounded-full transition-all duration-500`}
                        style={{ width: `${muscle.rating * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Training Plan */}
            {getMusclesNeedingTraining(parsedMuscles).length > 0 && (
              <div className="mb-8 p-6 bg-white rounded-lg shadow-lg border border-red-200">
                <h3 className="text-xl font-medium mb-4 text-red-800">
                  Priority Training Plan
                </h3>
                <p className="mb-4 text-gray-700">
                  These muscles need the most attention in your training
                  routine:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getMusclesNeedingTraining(parsedMuscles).map(
                    (muscle, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 ${getMuscleCardColor(
                          muscle.rating
                        )} shadow-sm`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-lg text-gray-800">
                            {muscle.name}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-white text-xs font-bold ${getRatingColor(
                              muscle.rating
                            )}`}
                          >
                            {muscle.rating}/10
                          </span>
                        </div>
                        <div className="space-y-2">
                          {muscle.exercises.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-700">
                              {muscle.exercises.map((exercise, i) => (
                                <li key={i} className="py-1">
                                  {exercise}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 italic">
                              No specific exercises recommended
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Exercise Recommendations */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-medium mb-4 text-gray-800">
                Complete Exercise Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parsedMuscles.map((muscle, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${getMuscleCardColor(
                      muscle.rating
                    )} shadow-sm`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-lg mb-2 text-gray-800">
                        {muscle.name}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-white text-xs font-bold ${getRatingColor(
                          muscle.rating
                        )}`}
                      >
                        {muscle.rating}/10
                      </span>
                    </div>
                    <div className="space-y-2">
                      {muscle.exercises.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700">
                          {muscle.exercises.map((exercise, i) => (
                            <li key={i} className="py-1">
                              {exercise}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">
                          No specific exercises recommended
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Original Analysis Text */}
            <div className="mt-6 p-6 bg-white rounded-lg shadow border border-gray-200">
              <details>
                <summary className="text-blue-600 font-medium cursor-pointer">
                  View Full Analysis Text
                </summary>
                <div className="mt-4 whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded">
                  {analysis}
                </div>
              </details>
            </div>
          </div>
        )}

        {/* When analysis exists but parsing failed */}
        {analysis && parsedMuscles.length === 0 && (
          <div className="mt-8 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Muscle Analysis Results
            </h2>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="whitespace-pre-line text-gray-800">
                {analysis}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
