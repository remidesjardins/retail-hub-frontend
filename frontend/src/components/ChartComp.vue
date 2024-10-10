<!--
  =====================================================
  Project: RetailHub
  File: ChartComponent.vue
  Description: Component for displaying sales data charts in RetailHub.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Container for the chart -->
  <div class="chart-container">
    <div class="chart-wrapper">
      <!-- Canvas element where the chart will be rendered -->
      <canvas ref="chart"></canvas>
    </div>
  </div>
</template>

<script>
/**
 * ChartComponent
 * Displays sales data in bar and line charts using Chart.js.
 */
import { Chart } from 'chart.js/auto';

export default {
  props: {
    /**
     * Indicates whether to display yearly sales data.
     */
    years: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicates whether to display monthly sales data.
     */
    months: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicates whether to display weekly sales data.
     */
    weeks: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /**
       * Labels for the chart (e.g., years, months, days of the week).
       */
      chartLabel: [],
      /**
       * Data points for the chart representing sales totals.
       */
      chartData: [],
      /**
       * Average sales data for the chart's line dataset.
       */
      chartAvg: [],
    };
  },
  mounted() {
    // Fetch sales data based on the provided props
    this.fetchData(this.years, this.months, this.weeks);
    // Initialize the chart after a short delay to ensure data is fetched
    setTimeout(() => {
      this.InitChart();
    }, 1000);
  },
  methods: {
    /**
     * Initializes the chart by calculating averages and creating the chart instance.
     */
    InitChart() {
      const avg = this.CalculateAvg();
      console.log('Average Sales:', avg);
      console.log('Chart Data:', this.chartData);
      console.log('Chart Labels:', this.chartLabel);
      // Fill the chartAvg array with the calculated average for each data point
      this.chartAvg = Array(this.chartData.length).fill(avg);
      // Create the chart with the prepared data
      this.CreateChart();
    },

    /**
     * Fetches sales data from the API based on the selected time frame (years, months, weeks).
     * @param {boolean} years - Whether to fetch yearly data.
     * @param {boolean} months - Whether to fetch monthly data.
     * @param {boolean} weeks - Whether to fetch weekly data.
     */
    fetchData(years, months, weeks) {
      const accessToken = this.$store.state.userToken;

      const requestOptions = {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        redirect: "follow",
      };

      // Ensure that only one of the parameters is true
      if (!(years ^ months ^ weeks)) {
        console.error('Only one of the parameters (years, months, weeks) must be true');
        return;
      }

      // Get the current year and adjust the current week
      const currentYear = new Date().getFullYear();
      const currentWeek = this.getCurrentWeek(); // Adjust as needed
      console.log("Current Week:", currentWeek);

      // Construct the API URL based on the selected time frame
      let url = `https://com.servhub.fr/api/sales?`;
      if (years) {
        url += `years=true`;
      } else if (months) {
        url += `months=true&year=${currentYear}`;
      } else if (weeks) {
        url += `weeks=true&year=${currentYear}&week=${currentWeek}`;
      }

      // Fetch sales data from the API
      fetch(url, requestOptions)
          .then(res => res.json())
          .then(data => {
            console.log("Fetched Data:", data);
            // Process the data based on the selected time frame
            if (years) {
              data.forEach(item => {
                let sum = 0;
                this.chartLabel.push(item._id.year);
                item.sales.forEach(sale => {
                  sum += sale.total_price;
                });
                this.chartData.push(sum);
              });
            }

            if (months) {
              data.forEach(item => {
                let sum = 0;
                const month = new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'long' });
                this.chartLabel.push(`${month} ${item._id.year}`);
                item.sales.forEach(sale => {
                  sum += sale.total_price;
                });
                this.chartData.push(sum);
              }
              );
            }

            if (weeks) {
              // Initialize labels and data for days of the week
              this.chartLabel = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
              this.chartData = [0, 0, 0, 0, 0, 0, 0];
              const body = data[0];

              body.sales.forEach(sale => {
                const saleDate = new Date(sale.sale_date);
                saleDate.setHours(12, 0, 0, 0);

                const dayOfWeek = saleDate.toLocaleString('fr-FR', { weekday: 'long' });
                const index = this.chartLabel.indexOf(dayOfWeek);
                if (index !== -1) {
                  this.chartData[index] += sale.total_price;
                }
              });
            }

          })
          .catch(error => console.error('Error fetching data:', error));
    },

    /**
     * Calculates the average sales from the chart data.
     * @returns {number} The average sales value.
     */
    CalculateAvg() {
      const sum = this.chartData.reduce((acc, val) => acc + val, 0);
      const avg = sum / this.chartData.length;
      return avg;
    },

    /**
     * Creates the chart using Chart.js with the prepared data and configurations.
     */
    CreateChart() {
      const ctx = this.$refs.chart.getContext('2d');
      new Chart(ctx, {
        type: 'bar', // Base chart type
        data: {
          labels: this.chartLabel,
          datasets: [
            {
              label: 'Sales Dataset',
              data: this.chartData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              order: 1,
            },
            {
              label: 'Average Sales',
              data: this.chartAvg,
              type: 'line', // Adding a line dataset for average
              borderColor: 'rgba(255, 99, 132, 1)',
              fill: false,
              order: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false, // Disable the legend
            },
          },
          animation: {
            y: {
              from: 500, // Animate the y-axis starting point
            },
            duration: 2000, // Animation duration in milliseconds
          },
          scales: {
            y: {
              beginAtZero: true, // Start the y-axis at zero
            },
          },
        },
      });
    },

    /**
     * Calculates the current week number of the year.
     * @returns {number} The current week number.
     */
    getCurrentWeek() {
      const currentDate = new Date();
      const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const pastDaysOfYear = (currentDate - firstDayOfYear) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    },
  },
};
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Pleine hauteur de l'écran */
}

canvas {
  border-radius: 1.25rem;
}
.chart-wrapper {
  width: 100%;
  max-width: 37.5rem;
  height: 18.75rem; /* Set a fixed height */
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
