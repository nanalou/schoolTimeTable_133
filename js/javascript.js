$(function () {
    $.getJSON("http://sandbox.gibm.ch/berufe.php")
        .done(function (data) {
            $('#job').empty().append('<option value="">Select your job </option>');
            $.each(data, function (indexInArray, job) { 
                $('<option value="' + job.beruf_id + '">' + job.beruf_name + '</option>')
                .appendTo($('#job'));
            });
        })
        .fail(function() {
            console.log("job Server Error");
        });
    $("#job").change(function () {
        const choosenJob = $(this).children("option:selected").val();
        $.getJSON("http://sandbox.gibm.ch/klassen.php", {beruf_id : choosenJob})
            .done(function (data) {
                $('#class').empty().append('<option value="">Select your class</option>');
                $.each(data, function (indexInArray, classes) { 
                    $('<option value="' + classes.klasse_id + '">' + classes.klasse_name + '</option>')
                    .appendTo($('#class'));
                });
            })
            .fail(function() {
                console.log("classes Server Error");
            })

            }
        );
      });

    // xmlhttp = new XMLHttpRequest();
    // xmlhttp.onreadystatechange = function () {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         document.getElementById("text").innerHTML = xmlhttp.responseText;

    //     } 
    // xmlhttp.open("GET", "http://sandbox.gibm.ch/berufe.php", true);
    // xmlhttp.send();
        
    // }
//.post werde ich brauchen um vom einten feld di infos zu nehmen und nur die gefilterten infos an das naechste feld zu senden. 
// CROS mit php nicht vergessen?
