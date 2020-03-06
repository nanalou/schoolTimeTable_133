const jobs = $("#jobs");

const courses = $("#courses");
const courseContainer = $("#courseContainer");

const tableBody = $("#tableBody");
const noSchedule = $("#noSchedule");
const tableContainer = $("#tableContainer");
const tableElement = $("#tableContainer:first-child");

const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn ");


const replaceContent = (element, newContent) => element.empty().append(newContent);

const showElement = (element) => element.show();

const hideElement = (element) => element.hide();

function getNumberOfWeekAndYear(initalDate = null) {
  const date = initalDate ? new Date(initalDate) : new Date();
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return {
    week : Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7),
    year : date.getFullYear()
  };
}

$(function () {

  function showPreloader() {
    console.log("l0ading");
  }

  function showJobs() {
    getJobs()
      .then((data) => {
        if (localStorage.getItem('jobId') === null) {
          replaceContent(jobs, '<option value="">Select your class</option>');
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
      });
  }

  function showCourses(params) {
    getCourses(params)
      .then((data) => {
        if (window.localStorage.getItem('courseId') === null) {
          replaceContent(courses, '<option value="">Select your class</option>');
        } else {
          replaceContent(courses, `<option value="${localStorage.getItem('courseId')}">${localStorage.getItem('courseName')}</option>`);
        }

        const selectOptions = data.map((course) =>
          `<option value="${course.klasse_id}">
            ${course.klasse_name}
          </option>`
        );
        
        courses
          .append(selectOptions)
          .change(({ currentTarget }) => {
            window.localStorage.setItem('courseId', currentTarget.value);
            window.localStorage.setItem('courseName', currentTarget.selectedOptions[0].innerText)

            hideElement(tableContainer);

            showTimetable(currentTarget.value);
          });
          
        showElement(courseContainer);
      });
  }

  function showTimetable(courseId, week) {
    getTimetable(courseId, week)
      .then((rows) => {
        console.log(rows)
        //this is not the right approach !
        if(rows.length < 1) {
          console.log("nop")
          showElement(noSchedule);

          var date = getNumberOfWeekAndYear(week);
        } else {

          console.log("jep")
          var date = getNumberOfWeekAndYear(rows[0].tafel_datum);
          console.log(date)

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

        var weekNumber = date.week;
        var year = date.year;

        showElement(tableContainer);
        
        prevBtn.click(() => {
          showTimetable(courseId, (weekNumber-1) + "-" + year);
        });

        nextBtn.click(() => {
          showTimetable(courseId, (weekNumber+1) + "-" + year);
        });

      });
  }

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

  function getTimetable(courseId, week) {
    const url = "http://sandbox.gibm.ch/tafel.php";
    const queryParams = week ? { klasse_id: courseId, woche: week } : { klasse_id: courseId }
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
