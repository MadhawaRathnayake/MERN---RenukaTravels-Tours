import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const HotelChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        height: "100%",
        type: "radialBar", // Using radial bar chart type
        fontFamily: "Inter, sans-serif",
      },
      labels: ["Total Hotels", "Hotels Created in the Last Month"], // Labels for the radial bars
      tooltip: {
        enabled: true,
        y: {
          formatter: (value) => `${value} hotels`, // Show count in the tooltip
        },
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '14px',
              color: '#9e9e9e',
            },
            value: {
              fontSize: '16px',
              color: '#fff',
              formatter: (val) => `${val}`, // Show value in the radial bars
            },
          },
          track: {
            background: "#f0f0f0", // Background color of the radial bar track
            strokeWidth: '100%',
          },
          hollow: {
            size: "60%", // Size of the hollow (center) of the radial bar
          },
        },
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 300,
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    fetchHotelStats();
  }, []);

  const fetchHotelStats = async () => {
    try {
      const response = await fetch("/api/hotels/"); // Adjust the API URL if needed
      const data = await response.json();
      console.log("API response data:", data);

      if (data && data.totalHotels !== undefined && data.lastMonthHotels !== undefined) {
        setChartData((prev) => ({
          ...prev,
          series: [data.totalHotels, data.lastMonthHotels], // The series will contain the counts
        }));
      } else {
        console.error("Hotel data is missing or incomplete.");
      }
    } catch (error) {
      console.error("Error fetching hotel stats:", error);
    }
  };

  return (
    <div id="hotel-chart">
      <Chart options={chartData.options} series={chartData.series} type="radialBar" height="100%" />
    </div>
  );
};

export default HotelChart;
