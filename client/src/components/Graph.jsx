import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import "../styles/Graph.css";

// registers chartjs zoom plugin (inline)
Chart.register(zoomPlugin);

// global plugin to draw a vertical line on hover
const linePlugin = {
  id: "linePugin",
  // chartjs hook that is called after the chart is drawn to avoid the line being overwritten
  afterDraw(Chart) {
    // if there is a valid point -> redraws (ensuring only one line at a time)
    if (Chart.tooltip.getActiveElements().length > 0) {
      const ctx = Chart.ctx; // canvas
      const dataPoint = Chart.tooltip.getActiveElements()[0]; // first element being hovered (in this case only 1)
      const x = dataPoint.element.x; // get the x value for the element
      const ceiling = Chart.chartArea.top;
      const floor = Chart.chartArea.bottom;

      ctx.beginPath(); // begins a new path on the new canvas to connect the lines
      ctx.moveTo(x, ceiling);
      ctx.lineTo(x, floor);
      ctx.stroke(); // renders on canvas
    }
  },
};

Chart.register(linePlugin);

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
    animation: true,
    elements: {
      point: {
        radius: 0,
      },
    },
    responsive: true, // resizes when container is changed
    maintainAspectRatio: false, // fill the container for resizing
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: "S&P 500 Total Return",
        font: {
          size: 25,
          family: "Times New Roman",
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "#3b3b3b",
        callbacks: {
          /* formats the data point's y-axis value to 4 decimal places
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
    scales: {
      x: {
        title: {
          display: true,
          text: "Date (mm/dd/yyyy)",
          font: {
            size: 16,
            family: "Times New Roman",
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
            family: "Times New Roman",
          },
        },
      },
    },
  };

  return (
    <div className="wrapper">
      <div className="barChart">
        {data && <Line data={data} options={options} />}
      </div>
    </div>
  );
}

export default Graph;
