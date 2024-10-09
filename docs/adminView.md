---
title: AdminView
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/frontend/src/views/AdminView.vue" pos="2:7:7" line-data=" * RetailHub - AdminView.vue">`AdminView`</SwmToken> feature in the <SwmToken path="/frontend/src/views/AdminView.vue" pos="2:3:3" line-data=" * RetailHub - AdminView.vue">`RetailHub`</SwmToken> application.

The <SwmToken path="/frontend/src/views/AdminView.vue" pos="2:7:7" line-data=" * RetailHub - AdminView.vue">`AdminView`</SwmToken> component serves as the administrative dashboard, allowing administrators to view and analyze sales data over different periods (week, month, year) through interactive charts.

We will cover:

1. The structure of the <SwmToken path="/frontend/src/views/AdminView.vue" pos="2:7:7" line-data=" * RetailHub - AdminView.vue">`AdminView`</SwmToken> component.
2. How the period selection and chart display logic is implemented.
3. Navigation functionality within the <SwmToken path="/frontend/src/views/AdminView.vue" pos="2:7:7" line-data=" * RetailHub - AdminView.vue">`AdminView`</SwmToken>.

# Component structure

The <SwmToken path="/frontend/src/views/AdminView.vue" pos="2:7:7" line-data=" * RetailHub - AdminView.vue">`AdminView`</SwmToken> component is located at <SwmPath>[frontend/src/views/AdminView.vue](/frontend/src/views/AdminView.vue)</SwmPath>. It serves as the main administrative dashboard.

<SwmSnippet path="/frontend/src/views/AdminView.vue" line="15">

---

The template defines the main structure of the page, including the navigation bar, top bar with period selection buttons, and the chart display container.

```
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
          <button :class="{ active: period === 'week' }" @click="changePeriod('week')">Week</button>
          <button :class="{ active: period === 'month' }" @click="changePeriod('month')">Month</button>
          <button :class="{ active: period === 'year' }" @click="changePeriod('year')">Year</button>
        </div>
```

---

</SwmSnippet>

# Chart display logic

<SwmSnippet path="/frontend/src/views/AdminView.vue" line="35">

---

The chart display logic is controlled by flags that determine which chart (weekly, monthly, yearly) is visible based on the selected period.

```

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
```

---

</SwmSnippet>

# Component registration

<SwmSnippet path="/frontend/src/views/AdminView.vue" line="79">

---

The <SwmToken path="/frontend/src/views/AdminView.vue" pos="80:1:1" line-data="    NavBar,">`NavBar`</SwmToken> and <SwmToken path="/frontend/src/views/AdminView.vue" pos="81:1:1" line-data="    ChartComp,">`ChartComp`</SwmToken> components are registered within the <SwmToken path="/frontend/src/views/AdminView.vue" pos="2:7:7" line-data=" * RetailHub - AdminView.vue">`AdminView`</SwmToken> component.

```
  components: {
    NavBar,
    ChartComp,
  },
```

---

</SwmSnippet>

# Data properties

<SwmSnippet path="/frontend/src/views/AdminView.vue" line="84">

---

The data properties include flags for controlling the visibility of different chart periods and the currently selected period. These properties are documented using JSDoc comments.

```
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
```

---

</SwmSnippet>

# Period selection method

<SwmSnippet path="/frontend/src/views/AdminView.vue" line="101">

---

The <SwmToken path="/frontend/src/views/AdminView.vue" pos="107:1:1" line-data="    changePeriod(period) {">`changePeriod`</SwmToken> method updates the visibility flags based on the selected period. This method is also documented using JSDoc comments.

@param {string} <SwmToken path="/frontend/src/views/AdminView.vue" pos="107:3:3" line-data="    changePeriod(period) {">`period`</SwmToken> - The period to switch to ('week', 'month', 'year').

```
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
```

---

</SwmSnippet>

# Navigation method

<SwmSnippet path="/frontend/src/views/AdminView.vue" line="124">

---

The <SwmToken path="/frontend/src/views/AdminView.vue" pos="127:1:1" line-data="    goBack() {">`goBack`</SwmToken> method allows the user to navigate back to the previous page in the browser history. This method is documented using JSDoc comments.

```
    /**
     * Navigates the user back to the previous page in the browser history.
     */
    goBack() {
      this.$router.go(-1); // Navigate to the previous page
    },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/frontend/src/views/AdminView.vue" pos="2:7:7" line-data=" * RetailHub - AdminView.vue">`AdminView`</SwmToken> feature implementation. The component structure, chart display logic, and navigation functionality have been explained.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBUmV0YWlsSFVCLUZyb250ZW5kJTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="RetailHUB-Frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
