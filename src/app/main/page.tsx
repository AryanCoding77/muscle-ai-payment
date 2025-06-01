"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MuscleData } from "../../types/muscle";
import MuscleRadarChart from "../../components/MuscleRadarChart";
import MuscleBarChart from "../../components/MuscleBarChart";
import MuscleDistributionChart from "../../components/MuscleDistributionChart";
import MuscleVisualizer from "../../components/MuscleVisualizer";
import ExerciseSection from "../../components/ExerciseSection";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import PricingPlans from "@/components/PricingPlans";
import toast from "react-hot-toast";
import QuotaDisplay from "@/components/QuotaDisplay";
import AnalysisDashboard from "@/components/AnalysisDashboard";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [parsedMuscles, setParsedMuscles] = useState<MuscleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeChart, setActiveChart] = useState<"radar" | "bar">("radar");
  const [nonVisibleMuscles, setNonVisibleMuscles] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const lastAnalysisTime = useRef<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, user } = useAuth0();
  const { userInfo } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Add smooth scroll behavior to the page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setAnalysis(null);
    setError(null);
    setParsedMuscles([]);
    setNonVisibleMuscles([]);
    setIsAnalyzing(false);
    lastAnalysisTime.current = 0; // Reset the cooldown timer for a new image

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
    if (!selectedImage) return;

    // Check if user has an active subscription
    if (!userInfo.subscription || userInfo.subscription.status !== "active") {
      toast.error(
        "You need an active subscription to analyze images. Please purchase a plan."
      );
      return;
    }

    setIsAnalyzing(true);

    if (!fileInputRef.current?.files?.[0]) {
      setError("Please select an image first");
      return;
    }

    // Implement a simple cooldown to prevent rapid fire requests
    const now = Date.now();
    const timeSinceLastAnalysis = now - lastAnalysisTime.current;
    if (timeSinceLastAnalysis < 1000) {
      // 1 second cooldown instead of 3
      // 3 seconds cooldown
      setError(
        `Please wait ${Math.ceil(
          (1000 - timeSinceLastAnalysis) / 1000
        )} seconds before analyzing again.`
      );
      return;
    }

    try {
      setIsLoading(true);
      setIsAnalyzing(true);
      setError(null);
      lastAnalysisTime.current = now;

      const formData = new FormData();
      formData.append("image", fileInputRef.current.files[0]);

      // Get the current user's ID for quota tracking
      const userId = user?.sub;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: userId ? { "x-user-id": userId } : {},
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Handle rate limiting
          throw new Error(
            data.error ||
              "Too many requests. Please wait a moment before trying again."
          );
        } else if (response.status === 403 && data.quota) {
          // Handle quota exceeded
          const resetDate = data.quota.resetDate 
            ? new Date(data.quota.resetDate).toLocaleDateString() 
            : 'next month';
            
          throw new Error(
            `${data.error || "Monthly quota exceeded"}. You've used ${data.quota.used} of ${data.quota.limit} analyses. Your quota will reset on ${resetDate}.`
          );
        } else if (data.isImageQuality) {
          // Handle image quality issues
          throw new Error(data.error);
        } else {
          throw new Error(data.error || "Failed to analyze image");
        }
      }

      if (!data.analysis) {
        throw new Error("No analysis data returned from model");
      }

      if (data.wasSafetyFiltered) {
        console.log(
          "Note: Safety filter was triggered but we've provided a useful analysis."
        );
      }

      if (data.modelUsed) {
        console.log(`Analysis generated using model: ${data.modelUsed}`);
      }
      
      // Display quota information if available
      if (data.quota) {
        toast.success(`Analyses remaining this month: ${data.quota.remaining}/${data.quota.limit}`);
      }

      // Check if response has standard format we expect
      if (
        data.analysis &&
        !data.analysis.includes("Development:") &&
        !data.analysis.match(/\d+\s*\/\s*10/)
      ) {
        console.warn("Warning: The analysis may not be in the expected format");

        // Try to repair the format if needed
        if (data.analysis.includes("**") && data.analysis.includes("*")) {
          // Looks like markdown, but might be missing the rating pattern
          const lines = data.analysis.split("\n");
          let repairedAnalysis = "";

          for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            // If we have a muscle name but no rating, add one
            if (
              line.match(/\d+\.\s+\*\*([^*:]+)\*\*/) &&
              !line.includes("Development:")
            ) {
              // Add a default rating
              line = line.replace(
                /\*\*([^*:]+)\*\*/,
                "**$1**: Development: 7/10"
              );
            }
            repairedAnalysis += line + "\n";
          }

          data.analysis = repairedAnalysis;
        }
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  // Parse the text analysis into structured data for visualization
  useEffect(() => {
    if (!analysis) return;

    try {
      // Extract a list of muscles that cannot be assessed from this angle
      const nonVisibleRegex =
        /(?:cannot|can't|not possible to|unable to|not visible|impossible to)\s+(?:assess|evaluate|analyze|see|view|rate|determine)\s+(?:the\s+)?([^.,]+)(?:\s+muscles?)?/g;

      let nonVisibleList: string[] = [];

      // Look for the specific section for non-visible muscles
      const sectionMatch = analysis.match(
        /muscles not visible in this image:?([\s\S]*?)(?=\d+\.|$)/i
      );

      if (sectionMatch && sectionMatch[1]) {
        // Extract from the dedicated section - this is the preferred method
        const muscleListItems = sectionMatch[1].match(/[-•*]\s*([^-\n]+)/g);
        if (muscleListItems) {
          muscleListItems.forEach((item) => {
            const cleanedMuscle = item.replace(/[-•*]\s*/, "").trim();
            if (
              cleanedMuscle &&
              cleanedMuscle !== "*" &&
              !nonVisibleList.includes(cleanedMuscle)
            ) {
              nonVisibleList.push(cleanedMuscle);
            }
          });
        } else {
          // If no bullet points, try line by line
          const muscleLines = sectionMatch[1]
            .split("\n")
            .filter((line) => line.trim().length > 0);
          muscleLines.forEach((line) => {
            const cleanedMuscle = line.trim();
            if (
              cleanedMuscle &&
              cleanedMuscle !== "*" &&
              !nonVisibleList.includes(cleanedMuscle)
            ) {
              nonVisibleList.push(cleanedMuscle);
            }
          });
        }
      } else {
        // Fallback to scanning the text for mentions of non-visible muscles
        let notVisibleMatch;
        const regex = new RegExp(nonVisibleRegex);
        while ((notVisibleMatch = regex.exec(analysis)) !== null) {
          if (notVisibleMatch[1]) {
            nonVisibleList.push(notVisibleMatch[1].trim());
          }
        }

        // Look for explicit statements about what can't be seen
        if (
          analysis.includes("not visible in this image") ||
          analysis.includes("cannot be assessed from this angle")
        ) {
          const notVisibleSection = analysis.split(
            /muscles (?:that )?(?:are )?(?:not visible|cannot be assessed)/i
          )[1];

          if (notVisibleSection) {
            const muscleList = notVisibleSection.match(
              /([A-Za-z\s()]+)(?:,|\.|\n|and)/g
            );

            if (muscleList) {
              muscleList.forEach((muscle) => {
                const cleanedMuscle = muscle.replace(/,|\.|and|\n/g, "").trim();
                if (cleanedMuscle && !nonVisibleList.includes(cleanedMuscle)) {
                  nonVisibleList.push(cleanedMuscle);
                }
              });
            }
          }
        }
      }

      // Filter out redundancies and clean up muscle names
      nonVisibleList = nonVisibleList
        .map((muscle) => muscle.replace(/^[-*•\s]+/, "").trim())
        .filter(
          (muscle, index, self) =>
            muscle.length > 0 &&
            muscle !== "*" &&
            !muscle.match(/^[*-•]$/) && // Filter out single characters that are just markers
            self.indexOf(muscle) === index
        );

      setNonVisibleMuscles(nonVisibleList);

      // Simple regex-based parsing of the muscle data
      const muscleRegex =
        /\d+\.\s+\*\*([^*:]+)(?:\*\*)?:\s*(?:The .+?)?(?:Development:|Rating:)?\s*(\d+)\/10/g;
      const exerciseRegex =
        /\*\s+(?:Exercises to improve:|Suggested exercises:)(.*?)(?=\d+\.|$|\n\n)/g;

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
  const getSortedMuscles = (muscles: MuscleData[]): MuscleData[] => {
    return [...muscles].sort((a, b) => a.rating - b.rating);
  };

  // Get muscles with highest ratings (rating > 7)
  const getStrongMuscles = (muscles: MuscleData[]) => {
    return muscles.filter((muscle) => muscle.rating > 7);
  };

  // Color for muscle rating bars
  const getRatingColor = (rating: number): string => {
    if (rating < 7) {
      return "bg-red-500";
    } else {
      return "bg-green-500";
    }
  };

  // Get background color class for muscle cards
  const getBadgeClass = (rating: number): string => {
    if (rating < 7) {
      return "bg-red-50 border-red-200";
    } else {
      return "bg-green-50 border-green-200";
    }
  };

  // Update the average rating calculation
  const calculateAverageRating = (muscles: MuscleData[]): number => {
    if (muscles.length === 0) return 0;
    const sum = muscles.reduce((total, muscle) => total + muscle.rating, 0);
    return Math.round((sum / muscles.length) * 10) / 10; // Round to 1 decimal place
  };

  const handleLogout = () => {
    logout({ 
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        {/* Proper header with app title and user menu */}
        <header className="bg-white border-b border-gray-200 py-4 px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.5 11.5h-1.8v-4h1.8c.6 0 1-.4 1-1s-.4-1-1-1h-2.6c-.1-1.3-.7-2.4-1.8-3.2-.4-.3-1.1-.2-1.4.2-.3.4-.2 1.1.2 1.4.6.4.9 1 .9 1.7v11.9c0 .7-.3 1.3-.9 1.7-.4.3-.5.9-.2 1.4.2.3.5.4.8.4.2 0 .4-.1.6-.2 1.1-.8 1.7-1.9 1.8-3.2h2.6c.6 0 1-.4 1-1s-.4-1-1-1h-1.8v-4h1.8c.6 0 1-.4 1-1s-.4-1-1-1zM3.5 11.5h1.8v-4H3.5c-.6 0-1 .4-1 1s.4 1 1 1h1.8v4H3.5c-.6 0-1 .4-1 1s.4 1 1 1h2.6c.1 1.3.7 2.4 1.8 3.2.2.1.4.2.6.2.3 0 .6-.1.8-.4.3-.4.2-1.1-.2-1.4-.6-.4-.9-1-.9-1.7V7.5c0-.7.3-1.3.9-1.7.4-.3.5-.9.2-1.4-.3-.4-.9-.5-1.4-.2-1.1.8-1.7 1.9-1.8 3.2H3.5c-.6 0-1 .4-1 1s.4 1 1 1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-blue-800">
              MuscleAI
            </h1>
          </div>

          {/* User Icon and Dropdown */}
          <div className="flex items-center space-x-6">
            {/* Only show quota display on medium screens and up */}
            <div className="hidden md:block">
              {userInfo.subscription && (
                <QuotaDisplay compact />
              )}
            </div>
            
            {/* Pricing Plans Button - only shown when user has no active subscription */}
            {(!userInfo.subscription ||
              userInfo.subscription.status !== "active") && <PricingPlans />}
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:bg-gray-100"
              >
                {userInfo?.picture ? (
                  <img
                    src={userInfo.picture}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover overflow-hidden"
                    style={{ aspectRatio: '1/1' }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {userInfo?.name || userInfo?.email}
                    </p>
                    <p className="text-xs text-gray-500">{userInfo?.email}</p>
                  </div>
                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => router.push("/my-plan")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>View My Plan</span>
                  </button>
                  <button
                    onClick={() => router.push("/feedback")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <span>Give Feedback</span>
                  </button>
                  <button
                    onClick={() => handleLogout()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 bg-gray-50 pt-8">
          <div className="z-10 max-w-5xl w-full items-center justify-center text-sm flex flex-col">
            <p className="text-lg mb-8 text-center text-gray-800">
              Upload a photo of your body to get an analysis of which muscles
              need more work
            </p>

            {!selectedImage && !isLoading && (
              <div className="flex justify-center mb-8">
                <div className="max-w-md">
                  <img
                    src="/muscle-illustration.svg"
                    alt="Muscle Analysis Illustration"
                    className="h-48 mx-auto mb-4 opacity-80"
                    onError={(e) => {
                      // Fallback if the SVG is not available
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0MzM4Y2EiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNiA4aDEydjhINnoiPjwvcGF0aD48cGF0aCBkPSJNMTggOGwzIDMtMyAzIj48L3BhdGg+PHBhdGggZD0iTTYgOGwtMy0zIDMtMyI+PC9wYXRoPjxwYXRoIGQ9Ik0xOCAyMFY4Ij48L3BhdGg+PHBhdGggZD0iTTYgMjBWOCI+PC9wYXRoPjwvc3ZnPg==";
                      e.currentTarget.classList.remove("h-48");
                      e.currentTarget.classList.add("h-24");
                    }}
                  />
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      Ready to analyze your muscles
                    </h3>
                    <p className="text-gray-800 mb-4">
                      Upload a clear photo showing your physique for a detailed
                      muscle analysis
                    </p>
                    <div className="flex justify-center gap-6 text-sm text-gray-800">
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-500 mb-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>Upload photo</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-500 mb-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                        <span>Get analysis</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-500 mb-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <span>View results</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col w-full max-w-2xl mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-medium mb-4 text-gray-800">
                  Upload Your Photo
                </h3>
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 border-blue-300 transition-all"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-12 h-12 mb-4 text-blue-500"
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
                    <p className="mb-2 text-sm text-gray-800">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-800">
                      PNG, JPG or GIF (Max 10MB)
                    </p>
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
            </div>

            {selectedImage && (
              <div className="mt-8 w-full max-w-2xl">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-medium mb-4 text-gray-800">
                    Image Preview
                  </h3>
                  <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-inner">
                    <Image
                      src={selectedImage}
                      alt="Selected body image"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={analyzeImage}
                      disabled={isLoading}
                      className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-md text-lg font-medium flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            ></path>
                          </svg>
                          Analyze Muscles
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-lg font-medium text-gray-800">
                    Analyzing your image...
                  </p>
                  <p className="text-sm text-gray-800 mt-2 text-center max-w-md">
                    This may take up to 10-15 seconds as our AI examines your
                    muscle development. Please don't refresh the page or submit
                    multiple requests.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <div className="mt-2 text-red-700">
                  <p>{error}</p>
                  {error.includes("wait") ||
                  error.includes("Too many requests") ? (
                    <p className="mt-2 text-sm">
                      The AI model has rate limits to prevent overuse. Please
                      wait a moment before trying again.
                    </p>
                  ) : null}
                  {error ===
                  "An analysis is already in progress. Please wait." ? (
                    <p className="mt-2 text-sm">
                      Your previous analysis request is still being processed.
                      Please be patient.
                    </p>
                  ) : null}
                  {error.includes("image quality") ||
                  error.includes("clearer, higher resolution") ? (
                    <p className="mt-2 text-sm">
                      Try uploading a photo with better lighting, less blur, and
                      focused clearly on the subject. The AI needs to see muscle
                      details clearly to analyze them properly.
                    </p>
                  ) : null}
                </div>
                {(error.includes("wait") ||
                  error.includes("Too many requests") ||
                  error ===
                    "An analysis is already in progress. Please wait." ||
                  error.includes("image quality") ||
                  error.includes("clearer, higher resolution")) && (
                  <button
                    className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                    onClick={() => setError(null)}
                  >
                    Dismiss
                  </button>
                )}
              </div>
            )}

            {analysis && parsedMuscles.length > 0 && (
              <div className="mt-8 w-full max-w-6xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-blue-800">
                  Muscle Analysis Results
                </h2>
                  
                  <button 
                    onClick={() => {
                      // Store analysis data in localStorage
                      const analysisData = {
                        parsedMuscles,
                        analysis,
                        nonVisibleMuscles,
                        timestamp: Date.now(),
                        id: `analysis-${Date.now()}`
                      };
                      
                      // Save to localStorage
                      localStorage.setItem(`analysis-${Date.now()}`, JSON.stringify(analysisData));
                      
                      // Create a shareable link with analysis ID
                      const shareableLink = `${window.location.origin}/shared-analysis?id=analysis-${Date.now()}`;
                      navigator.clipboard.writeText(shareableLink);
                      toast.success("Link copied to clipboard!");
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Results
                  </button>
                </div>

                {/* Visibility note */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500 shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-blue-800">
                        About This Analysis
                      </h3>
                      <p className="text-gray-800 mt-1">
                        This analysis is based on{" "}
                        <strong>
                          muscles visible in the provided image only
                        </strong>
                        . Some muscle groups may not be rated if they are not
                        clearly visible from this angle. For a complete
                        assessment, consider uploading images from different
                        angles (front, back, side).
                      </p>
                    </div>
                  </div>
                </div>

                {/* New Analysis Dashboard */}
                <AnalysisDashboard 
                      data={parsedMuscles}
                  originalAnalysis={analysis}
                      nonVisibleMuscles={nonVisibleMuscles}
                    />
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
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="text-gray-500 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} MuscleAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </ProtectedRoute>
  );
}
