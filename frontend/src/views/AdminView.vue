<!--
 * RetailHub - AdminView.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component serves as the administrative dashboard within RetailHub,
 * allowing administrators to view and analyze sales data over different periods
 * (week, month, year) through interactive charts.
 -->

<template>
  <div class="page-container">
    <!-- Main Container centered on the page -->
    <div class="main-container">
      <!-- Sidebar Navigation Bar -->
      <NavBar />

      <!-- Central Content Container -->
      <div class="content-container">
        <!-- Top Bar with Back Button and Period Selection Buttons -->
        <div class="top-bar">
          <!-- Back Button to navigate to the previous page -->
          <div class="back-button" @click="goBack">
            <i class="fa-solid fa-arrow-left"></i> <!-- Left Arrow Icon -->
          </div>
          <!-- Period Selection Buttons -->
          <button :class="{ active: period === 'week', 'toggle-button': true }" @click="changePeriod('week')">Week</button>
          <button :class="{ active: period === 'month', 'toggle-button': true }" @click="changePeriod('month')">Month</button>
          <button :class="{ active: period === 'year', 'toggle-button': true }" @click="changePeriod('year')">Year</button>
        </div>

        <!-- Chart Display Container -->
        <div class="chart-container">
          <!-- Weekly Chart Component -->
          <ChartComp
              v-show="weeks"
              :years="false"
              :months="false"
              :weeks="true"
          />
          <!-- Monthly Chart Component -->
          <ChartComp
              v-show="months"
              :years="false"
              :months="true"
              :weeks="false"
          />
          <!-- Yearly Chart Component -->
          <ChartComp
              v-show="years"
              :years="true"
              :months="false"
              :weeks="false"
          />
        </div>

        <!--
        Footer with Day, Week, Month, Year Buttons
        <div class="footer-buttons">
          <button :class="{'active-button': period === 'week', 'toggle-button': true}" @click="changePeriod('week')">Week</button>
          <button :class="{'active-button': period === 'month', 'toggle-button': true}" @click="changePeriod('month')">Month</button>
          <button :class="{'active-button': period === 'year', 'toggle-button': true}" @click="changePeriod('year')">Year</button>
        </div>
        -->
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import ChartComp from "@/components/ChartComp.vue";

export default {
  components: {
    NavBar,
    ChartComp,
  },

  data() {
    return {
      /**
       * Flags to control the visibility of different chart periods.
       * @property {boolean} weeks - Shows the weekly chart when true.
       * @property {boolean} months - Shows the monthly chart when true.
       * @property {boolean} years - Shows the yearly chart when true.
       * @property {string} period - Current selected period ('week', 'month', 'year').
       */
      weeks: true,
      months: false,
      years: false,
      period: 'week',
    };
  },

  methods: {
    /**
     * Changes the displayed chart period based on user selection.
     * Updates the visibility flags accordingly.
     *
     * @param {string} period - The period to switch to ('week', 'month', 'year').
     */
    changePeriod(period) {
      this.period = period;
      if (period === 'week') {
        this.weeks = true;
        this.months = false;
        this.years = false;
      } else if (period === 'month') {
        this.weeks = false;
        this.months = true;
        this.years = false;
      } else {
        this.weeks = false;
        this.months = false;
        this.years = true;
      }
    },

    /**
     * Navigates the user back to the previous page in the browser history.
     */
    goBack() {
      this.$router.go(-1); // Navigate to the previous page
    },
  },
};
</script>

<style scoped>
.page-container {
  /* Centers the main container both vertically and horizontally */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.main-container {
  /* Styles for the main container holding the NavBar and content */
  display: flex;
  width: 80vw;
  height: 80vh;
  background-color: white;
  border-radius: .625rem;
}

.content-container {
  /* Styles for the central content area */
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: .625rem;
  margin-left: 3.75rem;
  position: relative;
}

.chart-container {
  /* Container for the chart components */
  margin-left: 4.063rem;
  width: calc(100% - 4.063rem);
  padding-top: 1.25rem;
}

/* Sticky Top Bar for Period Selection Buttons */
.top-bar {
  display: flex;
  justify-content: center;
  padding: .625rem 0;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Styles for Period Selection Buttons */
.top-bar button {
  padding: .75rem 1.5rem;
  border: none;
  border-radius: 1.875rem;
  background-color: white;
  cursor: pointer;
  margin: 0 .625rem;
  font-size: 1rem;
  color: #333;
  transition: background-color 0.3s ease;
}

/* Active State for Period Selection Buttons */
.top-bar button.active {
  background-color: #80cbc4;
  color: black;
}

/* Styles for the Back Button */
.back-button {
  position: absolute;
  top: .625rem;
  left: .625rem;
  cursor: pointer;
  font-size: 1.25rem;
}

/* Styles for the Chart Container */
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%; /* Takes full height */
}

/* Styles for the Chart Wrapper */
.chart-wrapper {
  width: 90%;
  height: 70vh; /* Takes 70% of the view height */
  background-color: white;
  padding: 1.25rem;
  border-radius: .938rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.footer-buttons button {
  margin: 0 .313rem;
}
</style>