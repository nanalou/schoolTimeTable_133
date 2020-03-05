const jobs = $("#jobs");

const courses = $("#courses");
const courseContainer = $("#courseContainer");

const noSchedule = $("#noSchedule");
const tableContainer = $("#tableContainer");
const tableBody = $("#tableBody");

const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn ");

const replaceContent = (element, newContent) => element.empty().append(newContent);

const showElement = (element) => element.show();

const hideElement = (element) => element.hide();

$(function () {

  function showPreloader() {
    console.log("l0ading");
  }

  function showJobs() {
    getJobs()
      .then((data) => {
        const selectOptions = data.map((job) => `
          <option value="${job.beruf_id}">
            ${job.beruf_name}
          </option>`
        );

        jobs
          .append(selectOptions)
          .change(({ currentTarget }) => {
            hideElement(tableContainer);
            showCourses(currentTarget.value);
          });
      });
  }

  function showCourses(params) {
    getCourses(params)
      .then((data) => {
        replaceContent(courses, '<option value="">Select your class</option>');

        const selectOptions = data.map((course) =>
          `<option value="${course.klasse_id}">
            ${course.klasse_name}
          </option>`
        );
        
        courses
          .append(selectOptions)
          .change(({ currentTarget }) => {
            showTimetable(currentTarget.value);
          });
          
        showElement(courseContainer);
      });
  }

  function showTimetable(schoolClassId, week) {
    getTimetable(schoolClassId, week)
      .then((rows) => {
        console.log("hello")
        //i think this is not the right approach 
        if(rows.length < 1) {
          showElement(noSchedule);

          const date = getNumberOfWeekAndYear(week);
          var weekNumber = date[0];
          var year = date[1];
        } else {
          const date = getNumberOfWeekAndYear(rows[0].tafel_datum);

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

          var weekNumber = date[0];
          var year = date[1];
        }
        
        prevBtn.click(() => {
          console.log(weekNumber, year)
          showTimetable(schoolClassId, (weekNumber-1) + "-" + year);
        });

        nextBtn.click(() => {
          console.log(weekNumber, year)
          showTimetable(schoolClassId, (weekNumber+1) + "-" + year);
        });

        tableContainer.show();
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

  function getTimetable(schoolClassId, week) {
    const url = "http://sandbox.gibm.ch/tafel.php";
    const queryParams = week ? { klasse_id: schoolClassId, woche: week } : { klasse_id: schoolClassId }
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


function getNumberOfWeekAndYear(initalDate = null) {
  const date = initalDate ? new Date(initalDate) : new Date();
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return [Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7), date.getFullYear()];
}

//wenn handy nicht mehr alle felder anzeigen. und kurzforn von Fach
// wenn  ich ein job auswähle und dann eine klasse und dann den job wieder
// zu select mache kann ich dann nicht mehr alle klassen anwählen :(
