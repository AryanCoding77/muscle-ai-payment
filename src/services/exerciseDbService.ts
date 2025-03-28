import { MuscleData } from "../types/muscle";

type Exercise = {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  instructions: string[] | string;
};

// Map application muscle names to ExerciseDB API muscle names
const muscleMap: Record<string, string> = {
  // Upper body
  biceps: "biceps",
  "biceps (biceps brachii)": "biceps",
  "biceps brachii": "biceps",
  triceps: "triceps",
  shoulders: "delts",
  deltoids: "delts",
  "shoulders (deltoids)": "delts",
  chest: "pectorals",
  pectorals: "pectorals",
  "chest (pectoralis major)": "pectorals",
  "pectoralis major": "pectorals",

  // Back muscles
  lats: "lats",
  "lats (back muscles)": "lats",
  "latissimus dorsi": "lats",
  "back muscles": "lats",
  back: "lats",
  "upper back": "upper back",
  traps: "traps",
  trapezius: "traps",
  "traps (upper back muscles)": "traps",
  "upper back muscles": "traps",

  // Core
  abs: "abs",
  abdominals: "abs",
  "abs (rectus abdominis)": "abs",
  "rectus abdominis": "abs",
  core: "abs",
  obliques: "abs",

  // Lower body
  quads: "quads",
  quadriceps: "quads",
  "quadriceps (quadriceps femoris)": "quads",
  "quadriceps femoris": "quads",
  hamstrings: "hamstrings",
  glutes: "glutes",
  calves: "calves",
  "hip flexors": "hip",
  adductors: "adductors",
  abductors: "abductors",

  // Other
  forearms: "forearms",
  neck: "neck",
  "lower back": "lower back",
};

// List of valid target muscles according to ExerciseDB API
const validTargetMuscles = [
  "abductors",
  "abs",
  "adductors",
  "biceps",
  "calves",
  "cardiovascular system",
  "delts",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "levator scapulae",
  "pectorals",
  "quads",
  "serratus anterior",
  "spine",
  "traps",
  "triceps",
  "upper back",
];

export async function getExercisesByMuscle(
  muscleName: string
): Promise<Exercise[]> {
  // Get the mapped muscle name for the API
  let apiMuscleName =
    muscleMap[muscleName.toLowerCase()] || muscleName.toLowerCase();

  // Handle specific cases for back muscles
  if (
    muscleName.toLowerCase().includes("lats") ||
    muscleName.toLowerCase().includes("back muscle")
  ) {
    apiMuscleName = "lats";
  } else if (
    muscleName.toLowerCase().includes("trap") ||
    muscleName.toLowerCase().includes("upper back")
  ) {
    apiMuscleName = "traps";
  }

  // Ensure the muscle name is valid for the API
  if (!validTargetMuscles.includes(apiMuscleName)) {
    console.warn(
      `Invalid muscle name for API: ${apiMuscleName}, defaulting to similar muscle`
    );

    // Try to find a close match
    if (apiMuscleName.includes("chest")) apiMuscleName = "pectorals";
    else if (apiMuscleName.includes("shoulder")) apiMuscleName = "delts";
    else if (apiMuscleName.includes("bicep")) apiMuscleName = "biceps";
    else if (apiMuscleName.includes("quad")) apiMuscleName = "quads";
    else if (apiMuscleName.includes("ab")) apiMuscleName = "abs";
    else if (apiMuscleName.includes("back") || apiMuscleName.includes("lat"))
      apiMuscleName = "lats";
    else if (apiMuscleName.includes("trap")) apiMuscleName = "traps";
    else {
      console.error(`No valid mapping found for: ${muscleName}`);
      return []; // Return empty array instead of making an invalid API call
    }
  }

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_EXERCISEDB_API_KEY!,
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_EXERCISEDB_HOST!,
    },
  };

  try {
    console.log(
      `Fetching exercises for muscle: ${muscleName} → ${apiMuscleName}`
    );

    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_EXERCISEDB_HOST}/exercises/target/${apiMuscleName}`,
      options
    );

    if (!response.ok) {
      console.error(
        `API request failed with status ${response.status} for muscle: ${apiMuscleName}`
      );
      return []; // Return empty instead of throwing, to avoid breaking the UI
    }

    const data = await response.json();
    return data as Exercise[];
  } catch (error) {
    console.error(`Error fetching exercises for ${apiMuscleName}:`, error);
    return [];
  }
}

// Function to get a limited number of exercises for each muscle in the MuscleData array
export async function getExercisesForMuscles(
  muscles: MuscleData[],
  limit: number = 3
): Promise<Record<string, Exercise[]>> {
  const exercisesByMuscle: Record<string, Exercise[]> = {};

  // Process all muscles in parallel
  const promises = muscles.map(async (muscle) => {
    try {
      const exercises = await getExercisesByMuscle(muscle.name);
      exercisesByMuscle[muscle.name] = exercises.slice(0, limit);
    } catch (error) {
      console.error(`Failed to get exercises for ${muscle.name}:`, error);
      exercisesByMuscle[muscle.name] = []; // Set empty array on error
    }
  });

  await Promise.all(promises);
  return exercisesByMuscle;
}
