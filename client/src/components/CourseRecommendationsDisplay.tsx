import React from "react";

interface Recommendation {
  number: string;
  course: string;
  description: string;
}

interface CourseRecommendationProps {
  number: string;
  course: string;
  description: string;
}

interface CourseRecommendationsDisplayProps {
  recommendationsText: string;
}

const CourseRecommendation: React.FC<CourseRecommendationProps> = ({
  number,
  course,
  description,
}) => (
  <div className="bg-neutral-800 rounded-lg p-4 mb-4">
    <h3 className="text-lg font-bold mb-2 text-blue-400">
      {number}. {course}
    </h3>
    <p className="text-neutral-200 leading-relaxed">{description}</p>
  </div>
);

const parseRecommendations = (text: string): Recommendation[] => {
  // Split the text by numbers at the start of lines
  const parts = text.split(/(?=\d+\.\s+)/);

  return parts
    .filter((part) => part.trim()) // Remove empty parts
    .map((part) => {
      // Extract the number
      const numberMatch = part.match(/^(\d+)\./);
      const number = numberMatch ? numberMatch[1] : "";

      // Remove the number from the remaining text
      const remaining = part.replace(/^\d+\.\s*/, "");

      // Split into course and description
      const colonIndex = remaining.indexOf(":");
      const course = remaining.substring(0, colonIndex).trim();
      const description = remaining.substring(colonIndex + 1).trim();

      return {
        number,
        course,
        description,
      };
    })
    .filter((rec) => rec.number && rec.course && rec.description); // Only keep complete recommendations
};

const CourseRecommendationsDisplay: React.FC<
  CourseRecommendationsDisplayProps
> = ({ recommendationsText }) => {
  const recommendations = parseRecommendations(recommendationsText);

  // Add console.log for debugging
  console.log("Parsed recommendations:", recommendations);

  if (recommendations.length === 0) {
    return (
      <div className="p-6 text-center text-white">
        No course recommendations found. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Course Recommendations
      </h2>
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <CourseRecommendation
            key={rec.number}
            number={rec.number}
            course={rec.course}
            description={rec.description}
          />
        ))}
      </div>
      <p className="mt-6 text-sm text-neutral-400 text-center">
        These recommendations are based on your academic history and interests
        in Computer Science.
      </p>
    </div>
  );
};

export default CourseRecommendationsDisplay;
