$(function () {
  function showPreloader() {
    if ($.status < 4) {
      $("body").after('<p>loading</p>')
      console.log("loading");
    }
  }

  function showJobSelector() {
    getJobs()
      .then((jobs) => {
        const jobSelector = $("#jobSelector");

        const selectOptions = jobs.map((job) => `
          <option value="${job.beruf_id}">
            ${job.beruf_name}
          </option>`
        );

        jobSelector
          .append(selectOptions)
          .change(({ currentTarget }) => {
            showSchoolClassSelector(currentTarget.value);
          });
      });
  }

  function showSchoolClassSelector(params) {
    getSchoolClasses(params)
      .then((schoolClasses) => {
        const schoolClassSelector = $("#schoolClassSelector");
        schoolClassSelector
          .empty()
          .append('<option value="">Select your class</option>');

        const selectOptions = schoolClasses.map((schoolClass) =>
          `<option value="${schoolClass.klasse_id}">
            ${schoolClass.klasse_name}
          </option>`
        );

        schoolClassSelector
          .append(selectOptions)
          .change(({ currentTarget }) => {
            showTimetable(currentTarget.value);
          });
        $("#schoolClassContainer").show();
      });
  }

  function showTimetable(schoolClassId, week) {
    getTimetable(schoolClassId, '07-2020')
      .then((rows) => {
        const tableBody = $("#tableBody");

        tableBody.empty();

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

        $(tableBody).append(tableContent);

        $("#tableContainer").show();
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

  function getSchoolClasses(param) {
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
  showJobSelector();

});

//wenn handy nicht mehr alle felder anzeigen. und kurzforn von Fach
// wenn  ich ein job auswähle und dann eine klasse und dann den job wieder
// zu select mache kann ich dann nicht mehr alle klassen anwählen :(
