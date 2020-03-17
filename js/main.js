var elementLoaded = false;

const jobs = $("#jobs");

const courses = $("#courses");
const courseContainer = $("#courseContainer");

const tableBody = $("#tableBody");
const noSchedule = $("#noSchedule");
const tableContainer = $("#tableContainer");
const tableElement = $("table:first");

const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn ");
const datePreview = $("#datePreview");

const spinner = $("#spinner");
const body = $("#body");

const date = createWeekCalculator();

const timetablePreferences = getUserPreferences();

const replaceContent = (element, newContent) => element.empty().append(newContent);

const showElement = (element) => element.show();

const hideElement = (element) => element.hide();

const fadeInElement = (element) => element.fadeIn();


$(function () {
  function showJobs() {
    showSpinner();
    getJobs()
      .then((data) => {
        if (timetablePreferences.jobId === null) {
          replaceContent(jobs, '<option value="">Select your job</option>');
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
      window.localStorage.setItem('jobId', currentTarget.value);
      window.localStorage.setItem('jobName', currentTarget.selectedOptions[0].innerText)

      if (timetablePreferences.courseId !== null) {
        window.localStorage.removeItem('courseId') 
        window.localStorage.removeItem('courseName') 
      }

      hideElement(tableContainer);

      showCourses(currentTarget.value);
    });

  function showCourses(params) {
    showSpinner();
    getCourses(params)
      .then((data) => {
        if (timetablePreferences.courseId === null) {
          replaceContent(courses, '<option value="">Select your class</option>');
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
          
        showElement(courseContainer);
        showBody();
      });
  }

  courses
    .change(({ currentTarget }) => {
      window.localStorage.setItem('courseId', currentTarget.value);
      window.localStorage.setItem('courseName', currentTarget.selectedOptions[0].innerText)

      date.reset();

      showTimetable(currentTarget.value);
    });

  function showTimetable(courseId) {
    showSpinner();
    getTimetable(courseId)
      .then((rows) => {
        hideElement(tableContainer)
        //this is not the right approach !
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

        const datePreviewContent = `<p>${date.getWeekAndYear()}</p>`;
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
        console.log("job Server Error");
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
        console.log("classes Server Error");
        return []
      });
  }

  function getTimetable(courseId) {
    const url = "http://sandbox.gibm.ch/tafel.php";
    const queryParams = { klasse_id: courseId, woche: date.getWeekAndYear() }
    return $.getJSON(url, queryParams)
      .done((data) => {
        return data
      })
      .fail(() => {
        console.log("classes Server Error");
        return []
      });
  }

  showJobs();
});

function cell(content) {
  return `<td class="border px-4 py-2">${content}</td>`
}

function showBody() {
  hideElement(spinner)
  showElement(body)
}

function showSpinner() {
  hideElement(body)
  showElement(spinner)
}

function getUserPreferences() {
  return {
  jobId : window.localStorage.getItem("jobId"),
  jobName : window.localStorage.getItem("jobName"),
  courseId : window.localStorage.getItem("courseId"),
  courseName : window.localStorage.getItem("courseName"),
  }
};

//autor: hd https://gist.github.com/hdahlheim/c756e1ee3a714469c92f2b9cb76fd78d
/**
 * Factory function for creating an object that is capable of tracking weeks of 
 * the timetable. It uses a closure to keep the date and the function for 
 * calculating the week number private. 
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

  /**
   * Private Function for calculating the Week
   * @param {Date} date
   */
  const getNumberOfWeek = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  return {
    getWeekAndYear() {
      const year = date.getFullYear()
      const week = getNumberOfWeek(date)
      return `${week}-${year}`
    },
    addWeek() {
      const nextWeek = date.getTime() + 604800000
      date.setTime(nextWeek)
    },
    subtractWeek() {
      const previousWeek = date.getTime() - 604800000
      date.setTime(previousWeek)
    },
    reset() {
      date = new Date()
    }
  }
}

//error alert
//* loader before page loaded 
//localstorage get value funktion
// after reload the scrol bar back to the beginning
