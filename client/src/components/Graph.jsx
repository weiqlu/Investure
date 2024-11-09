import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import "../styles/Graph.css";
// enables chartjs zoom functionality
Chart.register(zoomPlugin);

function Graph() {
  // state to hold chart data
  const [data, setdata] = useState(null);

  // fetches graph data only once when mounted
  useEffect(() => {
    fetch("https://investure-backend.onrender.com/investure")
      .then((response) => response.json())
      .then((data) => {
        // creates an array of dates from fetched data
        const dates = data.map((item) => {
          return item.ReferenceDate;
        });

        // creates an array of total return values from fetched data
        const totalReturns = data.map((item) => {
          return item.TotalReturn;
        });

        // data object for the chart
        const chartData = {
          labels: dates,
          datasets: [
            {
              label: "Total Return",
              data: totalReturns,
              backgroundColor: "blue",
              borderColor: "blue",
              borderWidth: 1,
            },
          ],
        };
        setdata(chartData);
      });
  }, []);

  // configurations for the chart
  const options = {
    responsive: true, // resizes when container is changed
    maintainAspectRatio: false, // turned off to fill the container for resizing
    // graph customizations
    plugins: {
      title: {
        display: true,
        text: "S&P 500 Total Return",
        font: {
          size: 25,
          family: "times new roman",
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#3b3b3b",
        callbacks: {
          /* formats the data point's y axis value to 4 digit places
           to avoid the default rounding to 3 places */
          label: function (context) {
            let label = context.dataset.label || "";
            label += ": " + context.parsed.y.toFixed(4) + "%";
            return label;
          },
        },
      },
      // allows for zooming, panning, and dragging
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.2,
          },
        },
        pan: {
          enabled: true,
        },
        drag: {
          enabled: true,
        },
      },
    },
    // graph axes (x,y)
    scales: {
      x: {
        title: {
          display: true,
          text: "Date (mm/dd/yyyy)",
          font: {
            size: 16,
            family: "times new roman",
          },
        },
        ticks: {
          maxRotation: 50,
          minRotation: 50,
        },
      },
      y: {
        min: -50,
        max: 3000,
        title: {
          display: true,
          text: "Total Return (%)",
          font: {
            size: 16,
            family: "times new roman",
          },
        },
      },
    },
  };

  return (
    <div className="wrapper">
      <div className="barChart">
        {data && <Bar data={data} options={options} />}
      </div>
    </div>
  );
}

export default Graph;
