import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

// Define the chart options for the vehicle stats
const vehicleChartOptions = {
  chart: {
    type: "line",
    height: "50%",
    fontFamily: "Inter, sans-serif",
    dropShadow: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    enabled: true,
    x: {
      show: false,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.7,
      opacityTo: 0.3,
      shade: "#0A78D3",
      gradientToColors: ["#0A78D3"],
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 2,
  },
  grid: {
    show: true,
    strokeDashArray: 2,
    padding: {
      left: 2,
      right: 2,
      top: 0,
    },
  },
  series: [
    {
      name: "New Vehicles",
      data: [],
      color: "#0A78D3",
    },
  ],
  xaxis: {
    categories: [], // Will be populated dynamically
    labels: {
      show: true,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: true,
    labels: {
      show: true,
    },
  },
};

const VehicleStatsChart = () => {
  const [vehicleChartData, setVehicleChartData] = useState({
    series: [
      {
        name: "New Vehicles",
        data: [],
      },
    ],
    options: vehicleChartOptions,
  });

  // Fetch daily vehicle stats from the backend API
  const fetchVehicleStats = async () => {
    try {
        const response = await fetch("/api/vehicles/getvehicles");
        const data = await response.json();

        if (data && data.dailyVehicleStats && data.dailyVehicleStats.length > 0) {
            let categories = data.dailyVehicleStats.map((stat) => stat._id);  // Date string
            let counts = data.dailyVehicleStats.map((stat) => stat.count);    // Count of vehicles

            // Filter out categories and counts where the count value is 0.5 or 1.5
            const filteredData = categories
              .map((category, index) => ({
                category,
                count: counts[index]
              }))
              .filter(item => item.count !== 0.5 && item.count !== 1.5);

            // Extract filtered categories and counts
            categories = filteredData.map(item => item.category);
            counts = filteredData.map(item => item.count);

            // Ensure only unique integer values for counts
            counts = [...new Set(counts)];

            setVehicleChartData((prev) => ({
                ...prev,
                series: [{ name: "New Vehicles", data: counts }],
                options: { ...prev.options, xaxis: { categories } },
            }));
        } else {
            console.error("No dailyVehicleStats data or empty array.");
            // Set default chart data
            setVehicleChartData((prev) => ({
                ...prev,
                series: [{ name: "New Vehicles", data: [0] }],
                options: { ...prev.options, xaxis: { categories: ["No Data"] } },
            }));
        }
    } catch (error) {
        console.error("Error fetching vehicle stats:", error);
    }
};

  // Fetch the stats on component mount
  useEffect(() => {
    fetchVehicleStats();
  }, []);

  return (
    <div id="vehicle-chart">
      <ApexCharts
        options={vehicleChartData.options}
        series={vehicleChartData.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default VehicleStatsChart;
