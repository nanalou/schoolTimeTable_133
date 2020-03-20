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

const replaceContent = (element, newContent) => element.empty().append(newContent);

const showElement = (element) => element.show();

const hideElement = (element) => element.hide();

const fadeInElement = (element) => element.fadeIn(1000);


$(function () {
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

        const selectOptions = data.map((job) => `
          <option value="${job.beruf_id}">
            ${job.beruf_name}
          </option>`
        );

        jobs
          .append(selectOptions)
        
        showBody();
      });
  }

  jobs
    .change(({ currentTarget }) => {
      window.localStorage.clear();
      hideElement(tableContainer);

      if (currentTarget.value == "") {
        hideElement(courseContainer)
      } else {
        timetablePreferences.jobId = currentTarget.value;
        timetablePreferences.jobName = currentTarget.selectedOptions[0].innerText;
        showCourses(currentTarget.value);
      }


    });

  function showCourses(params) {
    getCourses(params)
      .then((data) => {
        hideElement(courseContainer)
        if (timetablePreferences.courseId === null) {
          replaceContent(courses, '<option value="" disabled selected>Select your class</option>');
        } else {
          replaceContent(courses, `<option value="${timetablePreferences.courseId}">${timetablePreferences.courseName}</option>`);
          showTimetable(timetablePreferences.courseId);
        }

        const selectOptions = data.map((course) =>
          `<option value="${course.klasse_id}">
            ${course.klasse_name}
          </option>`
        );
        
        courses.append(selectOptions)
          
        fadeInElement(courseContainer);
        // showElement(courseContainer);
        showBody();
      });
  }

  courses
    .change(({ currentTarget }) => {
        timetablePreferences.courseId = currentTarget.value;
        timetablePreferences.courseName = currentTarget.selectedOptions[0].innerText;

        date.reset();

        showTimetable(currentTarget.value);
    });

  function showTimetable(courseId) {
    getTimetable(courseId)
      .then((rows) => {
        hideElement(tableContainer)
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
          ${cell(row.tafel_von)}
          ${cell(row.tafel_bis)}
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

  prevBtn.click(() => {
    date.subtractWeek();
    showTimetable(timetablePreferences.courseId);
  });

  nextBtn.click(() => {
    date.addWeek();
    showTimetable(timetablePreferences.courseId);
  });

  function getJobs() {
    const url = "http://sandbox.gibm.ch/berufe.php"
    return $.getJSON(url, null)
      .done((data) => {
        return data
      })
      .fail(() => {
        errorAlert("job Server Error");
        return []
      });
  }

  function getCourses(param) {
    const url = "http://sandbox.gibm.ch/klassen.php"
    const queryParam = param ? { beruf_id: param } : null
    return $.getJSON(url, queryParam)
      .done((data) => {
        return data
      })
      .fail(() => {
        errorAlert("classes Server Error");
        return []
      });
  }

  function getTimetable(courseId) {
    const url = "http://sandbox.gibm.ch/tafel.php";
    const queryParams = { klasse_id: courseId, woche: date.getWeekString() }
    return $.getJSON(url, queryParams)
      .done((data) => {
        return data
      })
      .fail(() => {
        errorAlert("Timetable Server Error");
        return []
      });
  }

  showJobs();
});

function cell(content) {
  return `<td class="border px-4 py-2">${content}</td>`
}

function errorAlert(message) {
  hideElement(spinner)
  hideElement(app)
  window.localStorage.clear()
  errorAlertMessage.text(message)
  showElement(errorAlertContainer)
}

function showBody() {
  hideElement(spinner)
  showElement(app)
}

function showSpinner() {
  hideElement(app)
  showElement(spinner)
}

/*
* JS Proxy -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Validation
*/
function getUserPreferences() {
  // Array of all possible Keys, that the user is allowed to access
  const possibleKeys = [ 
    'jobId',
    'jobName',
    'courseId',
    'courseName',
  ]

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
        window.localStorage.removeItem('courseId')
        window.localStorage.removeItem('courseName')
      }
      possibleKeys.includes(prop) ? window.localStorage.setItem(prop, value) : null;
    },
  }
  return new Proxy({}, handler)
};


//autor: hd https://gist.github.com/hdahlheim/c756e1ee3a714469c92f2b9cb76fd78d
/**
 * Factory function for creating an object that is capable of generating the
 * week string needed for the gibm timetable API. You can add and subtract 
 * a week or reset the Date to the current week. To get week string use
 * the `_getWeekAndYearString()` function. The object uses a closure 
 * to keep the date object private to prevent unintended changes. 
 * 
 * Usage:
 *
 * ```js
 * const date = createWeekCalculator()
 * date.addWeek()
 * date.getWeekAndYear() // '12-2020'
 * ```
 *
 * @param {String} initalDate
 */
function createWeekCalculator(initalDate) {
  let date = initalDate ? new Date(initalDate) : new Date()
  const WEEK = 604800000
  const DAY = 86400000

  /**
   * Private Function for calculating the Week
   * @param {Date} date
   */
  const _getWeekAndYearString = (date) => {
    // Temporary date to prevent mutation
    const tempDate = new Date(date.valueOf())
    tempDate.setHours(0, 0, 0)
    // Set to the nearest Thursday (current date + 4 - current day number)
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7))
    // Get first day of year
    const yearStart = new Date(tempDate.getFullYear(), 0, 1)
    // Calculate full weeks to nearest Thursday
    const weekNumber = Math.ceil((((tempDate - yearStart) / DAY) + 1) / 7)
    // Return ISO week number and Year
    return `${weekNumber}-${yearStart.getFullYear()}`
  }

  const getThursday = () => {
    const tempDate = new Date(date.valueOf())
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7))
    return new Date(tempDate.valueOf()).getTime()
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

