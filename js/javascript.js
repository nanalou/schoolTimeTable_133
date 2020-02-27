$(function () {
    function showPreloader(params) {
        if ($.status < 4){
            $("body").after('<p>loading</p>')
            console.log("loading");
        }
    }

    function showData(params) {
        //is that efficient?
        $("body")
        .after('<select name="" id="shoolClassSelector"></select>')
        .after('<select name="" id="jobSelector"></select>')

        showJobSelector()
        showShoolClassSelector()
    }

    function showShoolClassSelector(params) {
        getShoolClasses(params).then(function (shoolClasses) {
            const selectOptions = shoolClasses.map((shoolClass) => '<option value=' + shoolClass.klasse_id + '>' + shoolClass.klasse_name + '</option>')
            $('#shoolClassSelector').empty()
            .append(selectOptions) 
        }); 
    }

    function showJobSelector() {
        getJobs().then(function (jobs) { 
            const selectOptions = jobs.map((job) => '<option value=' + job.beruf_id + '>' + job.beruf_name + '</option>')
            $('#jobSelector')
            .append(selectOptions)
            .change(function () {
                const choosenJob = $(this).children("option:selected").val();
                showShoolClassSelector(choosenJob)
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
    
    function getShoolClasses(param) {  
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
