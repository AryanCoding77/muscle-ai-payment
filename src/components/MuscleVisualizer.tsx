import React, { useState } from "react";
import { MuscleData } from "../types/muscle";

interface MuscleVisualizerProps {
  data: MuscleData[];
  nonVisibleMuscles?: string[];
}

// Define interface for muscle visualization info
interface MuscleInfo {
  id: string;
  displayName: string;
  pathId: string;
}

const MuscleVisualizer: React.FC<MuscleVisualizerProps> = ({
  data,
  nonVisibleMuscles = [],
}) => {
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleInfo | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Define muscle groups for visualization
  const muscleGroups: MuscleInfo[] = [
    { id: "pectoral", displayName: "Chest (Pectorals)", pathId: "pec" },
    { id: "bicep", displayName: "Biceps", pathId: "bicep" },
    { id: "tricep", displayName: "Triceps", pathId: "tricep" },
    { id: "deltoid", displayName: "Shoulders (Deltoids)", pathId: "delt" },
    { id: "trapezius", displayName: "Trapezius", pathId: "trap" },
    { id: "abdominal", displayName: "Abdominals", pathId: "abs" },
    { id: "latissimus", displayName: "Lats (Back)", pathId: "lats" },
    { id: "quad", displayName: "Quadriceps", pathId: "quad" },
    { id: "hamstring", displayName: "Hamstrings", pathId: "ham" },
    { id: "gluteus", displayName: "Glutes", pathId: "glute" },
    { id: "calf", displayName: "Calves", pathId: "calf" },
    { id: "forearm", displayName: "Forearms", pathId: "forearm" },
    { id: "serratus", displayName: "Serratus Anterior", pathId: "serratus" },
    { id: "oblique", displayName: "Obliques", pathId: "oblique" },
    { id: "teres", displayName: "Teres Major", pathId: "teres" },
    {
      id: "infraspinatus",
      displayName: "Infraspinatus",
      pathId: "infraspinatus",
    },
  ];

  // Get muscle rating by name with enhanced matching
  const getMuscleRating = (muscleName: string): number => {
    // Create a mapping of common muscle names to their variations
    const muscleMap: { [key: string]: string[] } = {
      pectoral: [
        "pectoralis",
        "chest",
        "pectorals",
        "pectoralis major",
        "pecs",
      ],
      bicep: ["biceps", "biceps brachii", "arm", "arms"],
      tricep: ["triceps", "triceps brachii"],
      deltoid: ["delts", "shoulders", "shoulder", "deltoids"],
      trapezius: ["traps", "upper back", "trap"],
      abdominal: ["abs", "core", "abdominals", "abdomen", "six-pack"],
      latissimus: [
        "lats",
        "back",
        "latissimus dorsi",
        "lats dorsi",
        "mid-back",
      ],
      quad: ["quadriceps", "quads", "thigh", "thighs", "quadricep"],
      hamstring: ["hamstrings", "posterior thigh", "back thigh", "hamis"],
      gluteus: ["glutes", "butt", "gluteus maximus", "glute", "buttocks"],
      calf: ["calves", "gastrocnemius", "soleus", "lower leg"],
      forearm: ["forearms", "brachioradialis", "wrist"],
      oblique: ["obliques", "side abs", "external oblique"],
      serratus: ["serratus anterior", "boxer muscle", "serrated muscle"],
      infraspinatus: ["rear delt", "rotator cuff"],
      teres: ["teres major", "teres minor"],
      "lower back": ["erector spinae", "spinal erectors", "lower back muscles"],
    };

    // Check for exact matches first
    const exactMatch = data.find(
      (m) => m.name.toLowerCase() === muscleName.toLowerCase()
    );

    if (exactMatch) return exactMatch.rating;

    // Check for partial matches
    for (const [key, variations] of Object.entries(muscleMap)) {
      if (
        variations.some((v) =>
          muscleName.toLowerCase().includes(v.toLowerCase())
        )
      ) {
        const muscleMatch = data.find(
          (m) =>
            variations.some((v) =>
              m.name.toLowerCase().includes(v.toLowerCase())
            ) || m.name.toLowerCase().includes(key.toLowerCase())
        );
        if (muscleMatch) return muscleMatch.rating;
      }
    }

    // Check if any muscle data includes this name
    const partialMatch = data.find(
      (m) =>
        m.name.toLowerCase().includes(muscleName.toLowerCase()) ||
        muscleName.toLowerCase().includes(m.name.toLowerCase())
    );

    return partialMatch ? partialMatch.rating : 0;
  };

  // Get color based on rating
  const getMuscleColor = (rating: number, muscleId: string): string => {
    // Check if this muscle is in the non-visible list
    if (
      nonVisibleMuscles.some(
        (m) =>
          muscleId.toLowerCase().includes(m.toLowerCase()) ||
          m.toLowerCase().includes(muscleId.toLowerCase())
      )
    ) {
      return "#f0f0f0"; // Very light gray for non-visible muscles
    }

    if (rating === 0) return "#D3D3D3"; // Gray for muscles without data
    if (rating < 4) return "#FF5252"; // Red for muscles needing significant improvement
    if (rating < 7) return "#FFA726"; // Orange for muscles needing moderate improvement
    return "#4CAF50"; // Green for well-developed muscles
  };

  // Get exercises for a muscle
  const getMuscleExercises = (muscleName: string): string[] => {
    const muscleMap: { [key: string]: string[] } = {
      pectoral: [
        "pectoralis",
        "chest",
        "pectorals",
        "pectoralis major",
        "pecs",
      ],
      bicep: ["biceps", "biceps brachii", "arm", "arms"],
      tricep: ["triceps", "triceps brachii"],
      // ... and so on with other muscles from above
    };

    // Try to find exact match first
    const exactMatch = data.find(
      (m) => m.name.toLowerCase() === muscleName.toLowerCase()
    );
    if (exactMatch) return exactMatch.exercises;

    // Check alternative names
    for (const [key, variations] of Object.entries(muscleMap)) {
      if (
        variations.some((v) =>
          muscleName.toLowerCase().includes(v.toLowerCase())
        )
      ) {
        const muscleMatch = data.find(
          (m) =>
            variations.some((v) =>
              m.name.toLowerCase().includes(v.toLowerCase())
            ) || m.name.toLowerCase().includes(key.toLowerCase())
        );
        if (muscleMatch) return muscleMatch.exercises;
      }
    }

    return [];
  };

  // Handle mouse over to display tooltip
  const handleMouseOver = (muscle: MuscleInfo, event: React.MouseEvent) => {
    setHoveredMuscle(muscle);
    // Calculate position based on mouse coordinates
    setTooltipPosition({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };

  // Handle mouse out to hide tooltip
  const handleMouseOut = () => {
    setHoveredMuscle(null);
  };

  // Function to generate SVG muscle path with hover effects
  const MusclePath = ({
    id,
    d,
    muscleId,
    muscleIndex,
    fill = true,
    stroke = true,
    strokeWidth = 1,
  }: {
    id: string;
    d: string;
    muscleId: string;
    muscleIndex: number;
    fill?: boolean;
    stroke?: boolean;
    strokeWidth?: number;
  }) => {
    const isNonVisible = nonVisibleMuscles.some(
      (m) =>
        muscleId.toLowerCase().includes(m.toLowerCase()) ||
        m.toLowerCase().includes(muscleId.toLowerCase())
    );

    return (
      <path
        id={id}
        d={d}
        fill={
          fill ? getMuscleColor(getMuscleRating(muscleId), muscleId) : "none"
        }
        stroke={stroke ? (isNonVisible ? "#999" : "#333") : "none"}
        strokeWidth={strokeWidth}
        strokeDasharray={isNonVisible ? "4,2" : "none"}
        onMouseOver={(e) => handleMouseOver(muscleGroups[muscleIndex], e)}
        onMouseOut={handleMouseOut}
        style={{
          cursor: "pointer",
          opacity: isNonVisible ? 0.4 : 1, // Reduce opacity more for non-visible muscles
        }}
      />
    );
  };

  return (
    <div className="w-full h-full flex justify-center relative">
      {/* Tooltip */}
      {hoveredMuscle && (
        <div
          className="absolute bg-white p-3 rounded shadow-lg border border-gray-200 z-10 max-w-xs"
          style={{
            left: tooltipPosition.x + 20,
            top: tooltipPosition.y - 30,
          }}
        >
          <h4 className="font-semibold text-gray-800">
            {hoveredMuscle.displayName}
          </h4>

          {nonVisibleMuscles.some(
            (m) =>
              hoveredMuscle.id.toLowerCase().includes(m.toLowerCase()) ||
              m.toLowerCase().includes(hoveredMuscle.id.toLowerCase())
          ) ? (
            <div className="mt-1 text-gray-700">
              <span className="text-blue-600 font-medium">
                Not visible in this image
              </span>
              <p className="text-sm mt-1">
                This muscle cannot be accurately assessed from this angle. Try
                uploading an image from a different view.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center mt-1">
                <span className="font-bold mr-2">Rating:</span>
                <span
                  className={`px-2 py-1 rounded-full text-white text-xs font-bold ${
                    getMuscleRating(hoveredMuscle.id) < 7
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {getMuscleRating(hoveredMuscle.id) || "N/A"}/10
                </span>
              </div>
              {getMuscleExercises(hoveredMuscle.id).length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold text-sm">
                    Recommended exercises:
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-700 mt-1">
                    {getMuscleExercises(hoveredMuscle.id).map(
                      (exercise, idx) => (
                        <li key={idx}>{exercise}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <svg
        viewBox="0 0 1000 600"
        className="max-w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Labels */}
        <text
          x="250"
          y="40"
          fontSize="24"
          fontWeight="bold"
          textAnchor="middle"
          fill="#333"
        >
          Front View
        </text>
        <text
          x="750"
          y="40"
          fontSize="24"
          fontWeight="bold"
          textAnchor="middle"
          fill="#333"
        >
          Back View
        </text>

        {/* Front view figure */}
        <g transform="translate(100, 80)">
          {/* Body outline */}
          <path
            d="M150,20 C200,20 230,30 250,60 C270,90 280,130 280,170 C280,210 270,250 240,270 L240,310 C240,330 230,350 220,370 L220,410 C220,440 210,460 200,480 L100,480 C90,460 80,440 80,410 L80,370 C70,350 60,330 60,310 L60,270 C30,250 20,210 20,170 C20,130 30,90 50,60 C70,30 100,20 150,20 Z"
            fill="#f8d5c8"
            stroke="#333"
            strokeWidth="2"
          />

          {/* Chest (Pectorals) */}
          <MusclePath
            id="pec-left"
            d="M110,120 C120,130 130,170 150,170 C170,170 180,130 190,120 C190,100 180,90 150,90 C120,90 110,100 110,120 Z"
            muscleId="pectoral"
            muscleIndex={0}
          />

          {/* Shoulders (Deltoids) */}
          <MusclePath
            id="delt-left"
            d="M80,120 C90,100 110,90 110,120 C110,130 100,140 95,140 C90,140 80,130 80,120 Z"
            muscleId="deltoid"
            muscleIndex={3}
          />

          <MusclePath
            id="delt-right"
            d="M220,120 C210,100 190,90 190,120 C190,130 200,140 205,140 C210,140 220,130 220,120 Z"
            muscleId="deltoid"
            muscleIndex={3}
          />

          {/* Biceps */}
          <MusclePath
            id="bicep-left"
            d="M85,140 C70,160 60,190 70,210 C80,230 95,240 95,240 L95,205 C95,190 85,155 85,140 Z"
            muscleId="bicep"
            muscleIndex={1}
          />

          <MusclePath
            id="bicep-right"
            d="M215,140 C230,160 240,190 230,210 C220,230 205,240 205,240 L205,205 C205,190 215,155 215,140 Z"
            muscleId="bicep"
            muscleIndex={1}
          />

          {/* Forearms */}
          <MusclePath
            id="forearm-left"
            d="M70,210 C65,230 60,250 60,260 C60,270 65,280 75,280 C85,280 95,270 95,260 L95,240 C80,230 75,220 70,210 Z"
            muscleId="forearm"
            muscleIndex={11}
          />

          <MusclePath
            id="forearm-right"
            d="M230,210 C235,230 240,250 240,260 C240,270 235,280 225,280 C215,280 205,270 205,260 L205,240 C220,230 225,220 230,210 Z"
            muscleId="forearm"
            muscleIndex={11}
          />

          {/* Abdominals */}
          <MusclePath
            id="upper-abs"
            d="M130,170 L170,170 L170,190 L130,190 Z"
            muscleId="abdominal"
            muscleIndex={5}
          />

          <MusclePath
            id="middle-abs"
            d="M130,195 L170,195 L170,215 L130,215 Z"
            muscleId="abdominal"
            muscleIndex={5}
          />

          <MusclePath
            id="lower-abs"
            d="M130,220 L170,220 L170,240 L130,240 Z"
            muscleId="abdominal"
            muscleIndex={5}
          />

          {/* Obliques */}
          <MusclePath
            id="oblique-left"
            d="M120,170 L130,170 L130,240 L120,255 C110,250 105,240 105,230 L105,200 C105,185 110,175 120,170 Z"
            muscleId="oblique"
            muscleIndex={13}
          />

          <MusclePath
            id="oblique-right"
            d="M180,170 L170,170 L170,240 L180,255 C190,250 195,240 195,230 L195,200 C195,185 190,175 180,170 Z"
            muscleId="oblique"
            muscleIndex={13}
          />

          {/* Serratus */}
          <MusclePath
            id="serratus-left"
            d="M110,140 L110,170 C110,175 107,180 105,185 C103,190 105,200 105,200 L105,170 C105,160 110,150 110,140 Z"
            muscleId="serratus"
            muscleIndex={12}
          />

          <MusclePath
            id="serratus-right"
            d="M190,140 L190,170 C190,175 193,180 195,185 C197,190 195,200 195,200 L195,170 C195,160 190,150 190,140 Z"
            muscleId="serratus"
            muscleIndex={12}
          />

          {/* Quadriceps */}
          <MusclePath
            id="quad-left"
            d="M110,255 L140,255 L140,355 C140,370 130,380 120,385 L100,385 C90,380 80,370 80,355 L80,320 C80,295 90,275 110,255 Z"
            muscleId="quad"
            muscleIndex={7}
          />

          <MusclePath
            id="quad-right"
            d="M160,255 L190,255 C210,275 220,295 220,320 L220,355 C220,370 210,380 200,385 L180,385 C170,380 160,370 160,355 Z"
            muscleId="quad"
            muscleIndex={7}
          />

          {/* Calves */}
          <MusclePath
            id="calf-left"
            d="M100,385 L120,385 L120,440 L120,460 L100,460 C90,440 85,420 85,400 C85,390 90,385 100,385 Z"
            muscleId="calf"
            muscleIndex={10}
          />

          <MusclePath
            id="calf-right"
            d="M180,385 L200,385 C210,385 215,390 215,400 C215,420 210,440 200,460 L180,460 L180,440 Z"
            muscleId="calf"
            muscleIndex={10}
          />
        </g>

        {/* Back view figure */}
        <g transform="translate(600, 80)">
          {/* Body outline */}
          <path
            d="M150,20 C200,20 230,30 250,60 C270,90 280,130 280,170 C280,210 270,250 240,270 L240,310 C240,330 230,350 220,370 L220,410 C220,440 210,460 200,480 L100,480 C90,460 80,440 80,410 L80,370 C70,350 60,330 60,310 L60,270 C30,250 20,210 20,170 C20,130 30,90 50,60 C70,30 100,20 150,20 Z"
            fill="#f8d5c8"
            stroke="#333"
            strokeWidth="2"
          />

          {/* Trapezius */}
          <MusclePath
            id="trap"
            d="M115,70 L185,70 L185,120 L115,120 Z"
            muscleId="trapezius"
            muscleIndex={4}
          />

          {/* Shoulders (Rear Deltoids) */}
          <MusclePath
            id="rear-delt-left"
            d="M80,120 C90,100 110,90 115,120 C115,130 100,140 95,140 C90,140 80,130 80,120 Z"
            muscleId="deltoid"
            muscleIndex={3}
          />

          <MusclePath
            id="rear-delt-right"
            d="M220,120 C210,100 190,90 185,120 C185,130 200,140 205,140 C210,140 220,130 220,120 Z"
            muscleId="deltoid"
            muscleIndex={3}
          />

          {/* Infraspinatus */}
          <MusclePath
            id="infraspinatus-left"
            d="M100,120 L115,120 L115,150 L100,150 Z"
            muscleId="infraspinatus"
            muscleIndex={15}
          />

          <MusclePath
            id="infraspinatus-right"
            d="M185,120 L200,120 L200,150 L185,150 Z"
            muscleId="infraspinatus"
            muscleIndex={15}
          />

          {/* Teres Major */}
          <MusclePath
            id="teres-left"
            d="M100,150 L115,150 L115,170 L100,170 Z"
            muscleId="teres"
            muscleIndex={14}
          />

          <MusclePath
            id="teres-right"
            d="M185,150 L200,150 L200,170 L185,170 Z"
            muscleId="teres"
            muscleIndex={14}
          />

          {/* Latissimus Dorsi */}
          <MusclePath
            id="lat-left"
            d="M100,170 L150,170 L140,230 L90,230 Z"
            muscleId="latissimus"
            muscleIndex={6}
          />

          <MusclePath
            id="lat-right"
            d="M150,170 L200,170 L210,230 L160,230 Z"
            muscleId="latissimus"
            muscleIndex={6}
          />

          {/* Triceps */}
          <MusclePath
            id="tricep-left"
            d="M85,140 C70,160 60,190 70,210 C80,230 95,240 95,240 L95,205 C95,190 85,155 85,140 Z"
            muscleId="tricep"
            muscleIndex={2}
          />

          <MusclePath
            id="tricep-right"
            d="M215,140 C230,160 240,190 230,210 C220,230 205,240 205,240 L205,205 C205,190 215,155 215,140 Z"
            muscleId="tricep"
            muscleIndex={2}
          />

          {/* Forearms (back view) */}
          <MusclePath
            id="forearm-back-left"
            d="M70,210 C65,230 60,250 60,260 C60,270 65,280 75,280 C85,280 95,270 95,260 L95,240 C80,230 75,220 70,210 Z"
            muscleId="forearm"
            muscleIndex={11}
          />

          <MusclePath
            id="forearm-back-right"
            d="M230,210 C235,230 240,250 240,260 C240,270 235,280 225,280 C215,280 205,270 205,260 L205,240 C220,230 225,220 230,210 Z"
            muscleId="forearm"
            muscleIndex={11}
          />

          {/* Glutes */}
          <MusclePath
            id="glute-left"
            d="M110,245 L150,245 L150,285 L110,285 Z"
            muscleId="gluteus"
            muscleIndex={9}
          />

          <MusclePath
            id="glute-right"
            d="M150,245 L190,245 L190,285 L150,285 Z"
            muscleId="gluteus"
            muscleIndex={9}
          />

          {/* Hamstrings */}
          <MusclePath
            id="hamstring-left"
            d="M110,285 L150,285 L150,355 L130,385 L100,385 C90,370 80,355 80,340 L80,320 C80,295 90,285 110,285 Z"
            muscleId="hamstring"
            muscleIndex={8}
          />

          <MusclePath
            id="hamstring-right"
            d="M150,285 L190,285 C210,285 220,295 220,320 L220,340 C220,355 210,370 200,385 L170,385 L150,355 Z"
            muscleId="hamstring"
            muscleIndex={8}
          />

          {/* Calves (back view) */}
          <MusclePath
            id="calf-back-left"
            d="M100,385 L130,385 L130,440 L130,460 L100,460 C90,440 85,420 85,400 C85,390 90,385 100,385 Z"
            muscleId="calf"
            muscleIndex={10}
          />

          <MusclePath
            id="calf-back-right"
            d="M170,385 L200,385 C210,385 215,390 215,400 C215,420 210,440 200,460 L170,460 L170,440 Z"
            muscleId="calf"
            muscleIndex={10}
          />
        </g>

        {/* Legend */}
        <g transform="translate(100, 480)">
          <rect x="0" y="20" width="20" height="20" fill="#FF5252" />
          <text x="30" y="35" fontSize="16" fill="#333">
            Needs Work (1-3)
          </text>

          <rect x="0" y="50" width="20" height="20" fill="#FFA726" />
          <text x="30" y="65" fontSize="16" fill="#333">
            Moderate (4-6)
          </text>

          <rect x="0" y="80" width="20" height="20" fill="#4CAF50" />
          <text x="30" y="95" fontSize="16" fill="#333">
            Strong (7-10)
          </text>

          <rect x="0" y="110" width="20" height="20" fill="#D3D3D3" />
          <text x="30" y="125" fontSize="16" fill="#333">
            No Data
          </text>

          <rect
            x="0"
            y="140"
            width="20"
            height="20"
            fill="#f0f0f0"
            stroke="#999"
            strokeWidth="1"
            strokeDasharray="4,2"
            opacity="0.4"
          />
          <text x="30" y="155" fontSize="16" fill="#333">
            Not Visible in Image
          </text>
        </g>

        {/* Instructions */}
        <text
          x="500"
          y="580"
          fontSize="16"
          textAnchor="middle"
          fill="#333"
          fontStyle="italic"
        >
          Hover over any muscle for details
        </text>
      </svg>
    </div>
  );
};

export default MuscleVisualizer;
