// initialization of the Ui-element-variables
const jobs = $("#jobs");

const courses = $("#courses");
const courseContainer = $("#courseContainer");

const tableBody = $("#tableBody");
const noSchedule = $("#noSchedule");
const tableElement = $("table:first");
const tableContainer = $("#tableContainer");

const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");
const datePreview = $("#datePreview");

const app = $("#app");
const spinner = $("#spinner");

const errorAlertMessage = $("#errorAlertMessage");
const errorAlertContainer = $("#errorAlertContainer");


const date = createWeekCalculator();

const timetablePreferences = getUserPreferences();

/**
 * Replaces all the children of the element with the new content
 * 
 * @param {Object} element 
 * @param {String} newContent 
 */
const replaceContent = (element, newContent) => element.empty().append(newContent);

/**
 * Shows the element
 * 
 * @param {Object} element 
 */
const showElement = (element) => element.show();

/**
 * Hides the element
 * 
 * @param {Object} element 
 */
const hideElement = (element) => element.hide();

/**
 * Shows the element with a fade-in animation
 * 
 * @param {Object} element 
 */
const fadeInElement = (element) => element.fadeIn(1000);

/**
 * Trims the time-format from 00:00:00 to 00:00
 * 
 * @param {String} time 
 */
const toShortTime = (time) => time.slice(0, 5);


//execute the function when the DOM (Document Object Model) is fully loaded
//its a shorthand for: $( "document" ).ready( handler )
// whole application get initialized
$(function () {

  showJobs();

  // Adds an on-change-Eventlistener to the jobselector
  // Sets the job values in the localstorage,
  // and shows the Courseselector after every change
  jobs.change(({ currentTarget }) => {
    window.localStorage.clear();
    hideElement(tableContainer);

    timetablePreferences.jobId = currentTarget.value;
    timetablePreferences.jobName = currentTarget.selectedOptions[0].innerText;

    showCourses(currentTarget.value);
  });

  // Adds an on-change-Eventlistener to the courseselector
  // Sets the course values in the localstorage,
  // resets the date to the curent week
  // and shows the Timetable after every change
  courses.change(({ currentTarget }) => {
    timetablePreferences.courseId = currentTarget.value;
    timetablePreferences.courseName = currentTarget.selectedOptions[0].innerText;

    date.reset();

    showTimetable(currentTarget.value);
  });

  // Adds an click-Eventlistener to the prev Btn
  // shows the previous week
  prevBtn.click(() => {
    date.subtractWeek();
    showTimetable(timetablePreferences.courseId);
  });

  // Adds an click-Event-listener to the next Btn
  // shows the next week
  nextBtn.click(() => {
    date.addWeek();
    showTimetable(timetablePreferences.courseId);
  });
});


/**
 * Returns an array of options strings
 * 
 * @param {Array} data
 * @param {Array} keys [id, name]
 */
function createOptions(data, keys) {
  const [id, name] = keys;
  return data.map((entry) => `
    <option value="${entry[id]}">
      ${entry[name]}
    </option>`
  );
}

/**
 * Returns an html-table-cell string
 *  
 * @param {String} content 
 */
function cell(content) {
  return `<td class="border px-4 py-2">${content}</td>`;
}

/**
 * Shows the error-alert-element and hides all the other elements
 * Deletes all the localStorage attributes 
 * 
 * @param {String} message
 */
function errorAlert(message) {
  hideElement(spinner);
  hideElement(app);
  window.localStorage.clear();
  errorAlertMessage.text(message);
  showElement(errorAlertContainer);
}

/**
 * Shows the body-element and hides all the other elements
 */
function showBody() {
  hideElement(spinner);
  showElement(app);
}

/**
 * Shows the loading-element and hides all the other elements
 */
function showSpinner() {
  hideElement(app);
  showElement(spinner);
}

/**
 * Returns a Proxy which checks every request on the object
 * JS Proxy -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Validation
 */
function getUserPreferences() {
  // Array of all possible Keys, that the user is allowed to access
  const possibleKeys = [ 
    'jobId',
    'jobName',
    'courseId',
    'courseName',
  ];

  /* 
  * in the handler obj i "prepare" different functions / actions / returns 
  * the handler intercepts the set, get action
  */
  const handler = {
    get: (obj, prop) => {
      // it checks if the requested property exists in the array (possibleKeys)
      // if true it returns the value of the localStorage otherwise it returns null
      return possibleKeys.includes(prop) ? window.localStorage.getItem(prop) : null;
    },
    set: (obj, prop, value) => {
      if(prop === 'jobId') {
        // the side-effect of the set jobId:
        // removes all couseItems from the localStorage 
        window.localStorage.removeItem('courseId');
        window.localStorage.removeItem('courseName');
      }
      // it checks if the requested property exists in the array (possibleKeys)
      // if true it returns the value of the localStorage otherwise it returns null
      possibleKeys.includes(prop) ? window.localStorage.setItem(prop, value) : null;
    },
  }
  return new Proxy({}, handler);
};

/**
 * Factory function for creating an object that is capable of generating the
 * week string needed for the gibm timetable API. You can add and subtract 
 * a week or reset the Date to the current week. To get week string use
 * the `_getWeekAndYearString()` function. The object uses a closure 
 * to keep the date object private to prevent unintended changes. 
 * author: hd https://gist.github.com/hdahlheim
 * 
 * Usage:
 *
 * ```js
 * const date = createWeekCalculator()
 * date.addWeek()
 * date.getWeekAndYear() // '12-2020'
 * ```
 *
 * @param {String} initialDate
 */
function createWeekCalculator(initialDate) {
  let date = initialDate ? new Date(initialDate) : new Date()
  const WEEK = 604800000
  const DAY = 86400000

  /**
   * Private Function for calculating the Week
   * @param {Date} date
   */
  const _getWeekAndYearString = (date) => {
    // Temporary date to prevent mutation
    const tempDate = new Date(date.valueOf())
    tempDate.setHours(0, 0, 0, 0)
    // Set to the nearest Thursday (current date + 4 - current day number)
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7))
    // Get first day of year
    const yearStart = new Date(tempDate.getFullYear(), 0, 1)
    // Calculate full weeks to nearest Thursday
    const weekNumber = Math.ceil((((tempDate - yearStart) / DAY) + 1) / 7)
    // Return ISO week number and Year
    return `${weekNumber}-${yearStart.getFullYear()}`
  }

  return {
    getWeekString() {
      return _getWeekAndYearString(date)
    },
    addWeek() {
      const nextWeek = date.getTime() + WEEK
      date.setTime(nextWeek)
    },
    subtractWeek() {
      const previousWeek = date.getTime() - WEEK
      date.setTime(previousWeek)
    },
    reset() {
      date = new Date()
    }
  }
}

/**
 * displays the job-data as a HTML-job-selector
 */
function showJobs() {
  showSpinner();
  getJobs()
    .then((data) => {
      if (timetablePreferences.jobId === null) {
        replaceContent(jobs, '<option value="" disabled selected>Select your job</option>');
      } else {
        replaceContent(jobs, `<option value="${timetablePreferences.jobId}">${timetablePreferences.jobName}</option>`);
        showCourses(timetablePreferences.jobId);
      }
      const selectOptions = createOptions(data, ["beruf_id", "beruf_name"]);

      jobs.append(selectOptions);
      
      showBody();
    });
}

/**
 * Displays the course-data as a HTML-course-selector
 * 
 * @param {String} jobId
 */
function showCourses(jobId) {
  getCourses(jobId)
    .then((data) => {
      hideElement(courseContainer)
      if (timetablePreferences.courseId === null) {
        replaceContent(courses, '<option value="" disabled selected>Select your class</option>');
      } else {
        replaceContent(courses, `<option value="${timetablePreferences.courseId}">${timetablePreferences.courseName}</option>`);
        showTimetable(timetablePreferences.courseId);
      }

      const selectOptions = createOptions(data, ["klasse_id", "klasse_name"]);
      courses.append(selectOptions);
        
      fadeInElement(courseContainer);
      // showElement(courseContainer);
      showBody();
    });
}

/**
 * displays the table-data as a HTML-time-table
 * 
 * @param {String} courseId
 */
function showTimetable(courseId) {
  getTimetable(courseId)
    .then((rows) => {
      hideElement(tableContainer);
      if(rows.length < 1) {
        hideElement(tableElement);
        showElement(noSchedule);
      } else {
        hideElement(noSchedule);
        showElement(tableElement);

        const dayNames = [
          "Sonntag",
          "Montag",
          "Dienstag",
          "Mittwoch",
          "Donnerstag",
          "Freitag",
          "Samstag"
        ];

        const tableContent = rows.map((row) =>
        `<tr>
        ${cell(row.tafel_datum)}
        ${cell(dayNames[row.tafel_wochentag])}
        ${cell(toShortTime(row.tafel_von))}
        ${cell(toShortTime(row.tafel_bis))}
        ${cell(row.tafel_lehrer)}
        ${cell(row.tafel_longfach)}
        ${cell(row.tafel_raum)}
        </tr>`
        );

        replaceContent(tableBody, tableContent);
      }

      const datePreviewContent = `<p>${date.getWeekString()}</p>`;
      replaceContent(datePreview, datePreviewContent);

      showBody();
      fadeInElement(tableContainer);
    });
}

/**
 * Returns all the job-Data from the GIBM-API
 * or displays an error Alert if the fetch fails
 */
function getJobs() {
  const url = "http://sandbox.gibm.ch/berufe.php";
  return $.getJSON(url, null)
    .done((data) => {
      return data;
    })
    .fail(() => {
      errorAlert("job Server Error");
    });
}

/**
 * Returns the course-Data matching to the jobId, from the GIBM-API
 * or displays an error Alert if the fetch fails
 * 
 * @param {String} jobId
 */
function getCourses(jobId) {
  const url = "http://sandbox.gibm.ch/klassen.php";
  const queryParam = jobId ? { beruf_id: jobId } : null;
  return $.getJSON(url, queryParam)
    .done((data) => {
      return data;
    })
    .fail(() => {
      errorAlert("classes Server Error");
    });
}

/**
 * Returns the table-Data matching to the courseId, from the GIBM-API
 * or displays an error Alert if the fetch fails
 * 
 * @param {String} courseId
 */
function getTimetable(courseId) {
  const url = "http://sandbox.gibm.ch/tafel.php";
  const queryParams = { klasse_id: courseId, woche: date.getWeekString() };
  return $.getJSON(url, queryParams)
    .done((data) => {
      return data;
    })
    .fail(() => {
      errorAlert("Timetable Server Error");
    });
}
