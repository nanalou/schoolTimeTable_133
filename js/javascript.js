$(function () {
    function showPreloader(params) {
        if ($.status < 4){
            $("body").after('<p>loading</p>')
            console.log("loading");
        }
    }

    function showData(params) {
        showJobSelector()
        showSchoolClassSelector()
    }

    function showSchoolClassSelector(params) {
        getSchoolClasses(params).then(function (schoolClasses) {
            if(!params) {
                $("body").append('<select name="" id="schoolClassSelector"></select>')
            }
            const schoolClassSelector = $("#schoolClassSelector")
            schoolClassSelector.empty().append('<option value="">Select your class</option>')

            const selectOptions = schoolClasses.map((schoolClass) => '<option value=' + schoolClass.klasse_id + '>' + schoolClass.klasse_name + '</option>')
            $('#schoolClassSelector')
            .append(selectOptions) 
        }); 
    }

    function showJobSelector() {
        getJobs().then(function (jobs) { 
            $("body").append('<select name="" id="jobSelector"></select>')
            jobSelector = $("#jobSelector")
            jobSelector.empty().append('<option value="">Select your job</option>')

            const selectOptions = jobs.map((job) => '<option value=' + job.beruf_id + '>' + job.beruf_name + '</option>')
            jobSelector
            .append(selectOptions)
            .change(function () {
                const choosenJob = $(this).children("option:selected").val();
                showSchoolClassSelector(choosenJob)
            });
        }); 
    }

    function getJobs() { 
        return $.getJSON("http://sandbox.gibm.ch/berufe.php", null)
            .done(function (data) {
                return data
            })
            .fail(function() {
                console.log("job Server Error");
                return []
            });
        }
    
    function getSchoolClasses(param) {  
        return $.getJSON("http://sandbox.gibm.ch/klassen.php", param ? {beruf_id : param} : null)
            .done(function (data) {
                return data
            })
            .fail(function() {
                console.log("classes Server Error");
                return []
            });
    }

    showPreloader();
    showData();

});

//.post werde ich brauchen um vom einten feld di infos zu nehmen und nur die gefilterten infos an das naechste feld zu senden. 
// CROS mit php nicht vergessen?
