import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

interface BarGraphProps {
  data: { [key: string]: number };
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarGraph({ data }: BarGraphProps) {
  const chartData = {
    labels: Object.keys(data).sort((a: string, b: string) =>
      a === "<50%" ? -1 : 1
    ), // Use the dictionary keys as labels
    datasets: [
      {
        label: "Number of Students", // Name of the dataset
        data: Object.keys(data)
          .sort((a, b) => (a === "<50%" ? -1 : 1))
          .map((key) => data[key]), // Use the dictionary values for data
        backgroundColor: "rgba(45, 136, 215, 0.2)",
        borderColor: "#726d6d",
        borderWidth: 0.8, // Bar border width
      },
    ],
  };

  return (
    <div className="min-h-[300px]">
      <Bar
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Grade Distribution",
              padding: {
                top: 10,
                bottom: 5,
              },
              color: "white",
            },
          },
          scales: {
            x: { ticks: { color: "white" } },
            y: { ticks: { color: "white" } },
          },
        }}
        data={chartData}
      />
    </div>
  );
}
