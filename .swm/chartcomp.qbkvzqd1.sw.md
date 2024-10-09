---
title: ChartComp
---
# Introduction

This document will walk you through the implementation of the ChartComp feature.

The feature is designed to display sales data charts in the <SwmToken path="/frontend/src/components/ChartComp.vue" pos="3:4:4" line-data="  Project: RetailHub">`RetailHub`</SwmToken> project.

We will cover:

1. Why the component was structured with specific props and data.
2. How the component fetches and processes sales data.
3. How the chart is initialized and rendered using <SwmToken path="/frontend/src/components/ChartComp.vue" pos="190:11:13" line-data="     * Creates the chart using Chart.js with the prepared data and configurations.">`Chart.js`</SwmToken>.

# Component structure

The component is located at: <SwmPath>[frontend/src/components/ChartComp.vue](/frontend/src/components/ChartComp.vue)</SwmPath>

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="14">

---

The template defines the container for the chart:

```
<template>
  <!-- Container for the chart -->
  <div class="chart-container">
    <div class="chart-wrapper">
      <!-- Canvas element where the chart will be rendered -->
      <canvas ref="chart"></canvas>
    </div>
  </div>
</template>
```

---

</SwmSnippet>

# Props definition

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="32">

---

The component accepts three props to determine the time frame for the sales data:

```
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
```

---

</SwmSnippet>

# Data properties

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="55">

---

The data function initializes arrays for chart labels, data points, and average sales:

```
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
```

---

</SwmSnippet>

# Fetching and processing data

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="71">

---

When the component is mounted, it fetches sales data based on the provided props and initializes the chart:

```
  mounted() {
    // Fetch sales data based on the provided props
    this.fetchData(this.years, this.months, this.weeks);
    // Initialize the chart after a short delay to ensure data is fetched
    setTimeout(() => {
      this.InitChart();
    }, 1000);
  },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="94">

---

The <SwmToken path="/frontend/src/components/ChartComp.vue" pos="100:1:1" line-data="    fetchData(years, months, weeks) {">`fetchData`</SwmToken> method retrieves sales data from the API based on the selected time frame:

@param {boolean} <SwmToken path="/frontend/src/components/ChartComp.vue" pos="100:3:3" line-data="    fetchData(years, months, weeks) {">`years`</SwmToken> - Whether to fetch yearly data.\
@param {boolean} <SwmToken path="/frontend/src/components/ChartComp.vue" pos="100:6:6" line-data="    fetchData(years, months, weeks) {">`months`</SwmToken> - Whether to fetch monthly data.\
@param {boolean} <SwmToken path="/frontend/src/components/ChartComp.vue" pos="100:9:9" line-data="    fetchData(years, months, weeks) {">`weeks`</SwmToken> - Whether to fetch weekly data.

```
    /**
     * Fetches sales data from the API based on the selected time frame (years, months, weeks).
     * @param {boolean} years - Whether to fetch yearly data.
     * @param {boolean} months - Whether to fetch monthly data.
     * @param {boolean} weeks - Whether to fetch weekly data.
     */
    fetchData(years, months, weeks) {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="105">

---

It ensures only one of the time frame parameters is true:

```

      // Ensure that only one of the parameters is true
      if (!(years ^ months ^ weeks)) {
        console.error('Only one of the parameters (years, months, weeks) must be true');
        return;
      }

      // Get the current year and adjust the current week
      const currentYear = new Date().getFullYear();
      const currentWeek = this.getCurrentWeek(); // Adjust as needed
      console.log("Current Week:", currentWeek);
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="116">

---

Constructs the API URL based on the selected time frame:

```

      // Construct the API URL based on the selected time frame
      let url = `https://com.servhub.fr/api/sales?`;
      if (years) {
        url += `years=true`;
      } else if (months) {
        url += `months=true&year=${currentYear}`;
      } else if (weeks) {
        url += `weeks=true&year=${currentYear}&week=${currentWeek}`;
      }
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="126">

---

Fetches the data and processes it according to the selected time frame:

```

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
```

---

</SwmSnippet>

# Chart initialization

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="80">

---

The <SwmToken path="/frontend/src/components/ChartComp.vue" pos="83:1:1" line-data="    InitChart() {">`InitChart`</SwmToken> method calculates averages and creates the chart instance:

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="179">

---

The <SwmToken path="/frontend/src/components/ChartComp.vue" pos="183:1:1" line-data="    CalculateAvg() {">`CalculateAvg`</SwmToken> method computes the average sales from the chart data:

@returns {number} The average sales value.

```
    /**
     * Calculates the average sales from the chart data.
     * @returns {number} The average sales value.
     */
    CalculateAvg() {
      const sum = this.chartData.reduce((acc, val) => acc + val, 0);
      const avg = sum / this.chartData.length;
      return avg;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="189">

---

The <SwmToken path="/frontend/src/components/ChartComp.vue" pos="192:1:1" line-data="    CreateChart() {">`CreateChart`</SwmToken> method uses <SwmToken path="/frontend/src/components/ChartComp.vue" pos="190:11:13" line-data="     * Creates the chart using Chart.js with the prepared data and configurations.">`Chart.js`</SwmToken> to render the chart with the prepared data and configurations:

```
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
```

---

</SwmSnippet>

# Utility methods

<SwmSnippet path="/frontend/src/components/ChartComp.vue" line="236">

---

The <SwmToken path="/frontend/src/components/ChartComp.vue" pos="240:1:1" line-data="    getCurrentWeek() {">`getCurrentWeek`</SwmToken> method calculates the current week number of the year:

@returns {number} The current week number.

```
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
```

---

</SwmSnippet>

This concludes the walkthrough of the ChartComp feature. The component is designed to be flexible and efficient in displaying sales data for different time frames.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
