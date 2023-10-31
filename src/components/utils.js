import {first,orderBy} from 'lodash'

// Create an array of objects with keys:
export function getDailyTargets(
    userHistory,
    testTarget,
    testDate,
    recoveryDays = 1,
    excerciseType
  ) {
    // Create an array to store the workout plan
    const workoutPlan = [];

      if (userHistory) {
      // Initialize variables to store the latest and second latest entries
      let latestEntry = null;
      let secondLatestEntry = first(orderBy(userHistory,"date","desc"));

      // Iterate through the userHistory array
      // if(userHistory && userHistory.length === 1){
      //   secondLatestEntry = userHistory[0]
      // } else {
      //   userHistory.forEach((entry) => {
      //     const entryDate = new Date(entry.date);

      //     if (!latestEntry || entryDate > new Date(latestEntry.date)) {
      //       // If no latest entry or the current entry is more recent than the latest,
      //       // update the second latest entry to the current latest entry,
      //       // and update the latest entry to the current entry.
      //       secondLatestEntry = latestEntry;
      //       latestEntry = entry;
      //     }
      //   });
      // }
      

      // Calculate the remaining days until the testDate
      const currentDate = new Date();
      const daysUntilTest = Math.ceil(
        (new Date(testDate) - currentDate) / (1000 * 60 * 60 * 24)
      );

      // Calculate the initial exercise target increment
      const dailyIncrement = Math.ceil(
        (testTarget - secondLatestEntry?.[excerciseType]) / daysUntilTest
      );

      // Initialize the current exercise count with the latest entry
      let currentExerciseCount = secondLatestEntry?.[excerciseType];

      // Loop through each day leading up to the testDate
      for (let i = 0; i < daysUntilTest; i++) {
        const currentDateCopy = new Date(currentDate);
        currentDateCopy.setDate(currentDate.getDate() + i);

        // Check if it's a recovery day (e.g., every 'recoveryDays' days)
        const isRecoveryDay = (i + 1) % recoveryDays === 0;
        // console.log(isRecoveryDay)

        // Calculate the exercise target for the current date
        // Once reached target
        let exerciseTargetForDate = isRecoveryDay
          ? currentExerciseCount // Maintain the same target as the previous day on recovery days
          : currentExerciseCount + dailyIncrement * (recoveryDays / 3);

        if (currentExerciseCount >= testTarget && excerciseType !== 'run') {
          //if target not met, increase
          exerciseTargetForDate = testTarget + dailyIncrement;
        } else if (
          currentExerciseCount <= testTarget &&
          excerciseType === 'run'
        ) {
          exerciseTargetForDate = testTarget - dailyIncrement;
        }

        // Create an object for the workout plan for the current date
        const workoutPlanEntry = {
          date: currentDateCopy.toLocaleDateString(),
          exerciseTarget: exerciseTargetForDate,
        };

        // Add the workout plan entry to the array
        workoutPlan.push(workoutPlanEntry);

        // Update the current exercise count for the next day
        currentExerciseCount = exerciseTargetForDate;
      }

      return workoutPlan;
    }
  }