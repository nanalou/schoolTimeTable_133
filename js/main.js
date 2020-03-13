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

const date = createWeekCalculator();

const replaceContent = (element, newContent) => element.empty().append(newContent);

const showElement = (element) => element.show();

const hideElement = (element) => element.hide();

const fadeInElement = (element) => element.fadeIn();

$(function () {

  function showPreloader() {
    console.log("l0ading");
  }

  function showJobs() {
    getJobs()
      .then((data) => {
        if (localStorage.getItem('jobId') === null) {
          replaceContent(jobs, '<option value="">Select your job</option>');
        } else {
          replaceContent(jobs, `<option value="${localStorage.getItem('jobId')}">${localStorage.getItem('jobName')}</option>`);
          showCourses(localStorage.getItem('jobId'));
        }

        const selectOptions = data.map((job) => `
          <option value="${job.beruf_id}">
            ${job.beruf_name}
          </option>`
        );

        jobs
          .append(selectOptions)
      });
  }

  jobs
    .change(({ currentTarget }) => {
      window.localStorage.setItem('jobId', currentTarget.value);
      window.localStorage.setItem('jobName', currentTarget.selectedOptions[0].innerText)

      if (window.localStorage.getItem('courseId') !== null) {
        window.localStorage.removeItem('courseId') 
        window.localStorage.removeItem('courseName') 
      }

      hideElement(tableContainer);

      showCourses(currentTarget.value);
    });

  function showCourses(params) {
    getCourses(params)
      .then((data) => {
        if (window.localStorage.getItem('courseId') === null) {
          replaceContent(courses, '<option value="">Select your class</option>');
        } else {
          replaceContent(courses, `<option value="${localStorage.getItem('courseId')}">${localStorage.getItem('courseName')}</option>`);
          showTimetable(localStorage.getItem('courseId'));
        }

        const selectOptions = data.map((course) =>
          `<option value="${course.klasse_id}">
            ${course.klasse_name}
          </option>`
        );
        
        courses.append(selectOptions)
          
        showElement(courseContainer);
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
          <td class="border px-4 py-2">${row.tafel_datum}</td>
          <td class="border px-4 py-2">${dayNames[row.tafel_wochentag]}</td>
          <td class="border px-4 py-2">${row.tafel_von}</td>
          <td class="border px-4 py-2">${row.tafel_bis}</td>
          <td class="border px-4 py-2">${row.tafel_lehrer}</td>
          <td class="border px-4 py-2">${row.tafel_longfach}</td>
          <td class="border px-4 py-2">${row.tafel_raum}</td>
          </tr>`
          );

          replaceContent(tableBody, tableContent);

        }

        const datePreviewContent = `<p>${date.getWeekAndYear()}</p>`;
        replaceContent(datePreview, datePreviewContent);

        console.log("tableContainer")
        fadeInElement(tableContainer);
      });
  }

  prevBtn.click(() => {
    date.subtractWeek();
    showTimetable(window.localStorage.getItem('courseId'));
  });

  nextBtn.click(() => {
    date.addWeek();
    showTimetable(window.localStorage.getItem('courseId'));
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

  showPreloader();
  showJobs();
});


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

