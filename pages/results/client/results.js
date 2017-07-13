

Template.results.onCreated(function resultsCreated(){
    const input = Router.current().params.query.params;
    const key = '876a19607233e092fdc4a30a9c079614';
    inputArr = input.split('&');
    let specialty = '';
    let language = '';
    let insurance = '';
    let condition = '';


    let url = 'https://api.betterdoctor.com/2016-03-01/doctors?location=' + inputArr[0].replace('lat=','') + ',' + inputArr[1].replace('long=','') + ',5&skip=0&limit=20&sort=best-match-asc&user_key=' + key;
    // if (specialty != ''){
    //   url += "specialty_uid=" + insurance + "&";
    // }
    // if (language != ''){
    //   url += ""
    // }

    console.log
    jQuery.getJSON(url , function(data) {
      let txt = "<table class=\"table table-hover\"><thead><tr><td>Name</td><td>Location(s)</td></tr></thead><tbody data-link=\'row\' class=\'rowlink\'>";
      for (x in data.data) {
        txt += "<tr><td><a id=\'docLink\' data-uid=\'" + data.data[x].uid + "\'href=\'#docModal\' data-toggle=\'modal\'>" + data.data[x].profile.first_name + ' ' + data.data[x].profile.last_name + ', ' + data.data[x].profile.title + "</a></td><td>" + data.data[x].practices[0].name;
        if (data.data[x].practices.length > 1){
          txt += ", and " + data.data[x].practices.length + " others</a></td>";
        }else{
          txt += "</td>";
        }
        txt += "</tr>";
      }

      txt += "</tbody></table>";
      document.getElementById("results").innerHTML = txt;
    });
});


Template.results.events({
  'click a':function(doc){
    event.preventDefault();
    uid = doc.target.dataset.uid;
    jQuery.getJSON('https://api.betterdoctor.com/2016-03-01/doctors/' + uid + '?user_key=876a19607233e092fdc4a30a9c079614', function(data){
      document.getElementById("docModalName").innerHTML = "<p class=\"text-center\"><strong>" + data.data.profile.first_name + " " + data.data.profile.last_name + ", " + data.data.profile.title + "</strong></p>";
      document.getElementById("profImage").innerHTML = "<img src=\"" + data.data.profile.image_url + "\" style=\"max-width: 100%;max-height: 100%\">";
      document.getElementById("docBio").innerHTML = "<p class=\'h5\'>" + data.data.profile.bio + "</p>";
      let txt = "<em><p class=\"h6 text-center\">Specializes in " + data.data.specialties[0].name;
      if (data.data.specialties.length > 1){
        for(i=0;i<data.data.specialties.length-1;i++){
          if (data.data.specialties[i].name != data.data.specialties[i+1].name){
            txt += ", " + data.data.specialties[i].name;
          }
        }
        txt += ", and " + data.data.specialties[data.data.specialties.length-1].name;
      }
      txt += "</p></em>";
      document.getElementById("specInfo").innerHTML = txt;
      txt = "<p>Speaks " + data.data.profile.languages[0].name;
      if (data.data.profile.languages.length > 1){
        for (i=0;i<data.data.profile.languages.length-1;i++){
            txt += ", " + data.data.profile.languages[i].name;
        }
        txt += ", and " + data.data.profile.languages[data.data.profile.languages.length-1].name;
      }
      txt += "</p>";
      document.getElementById("langSpoken").innerHTML = txt;
      if (data.data.licenses.length > 0){
      txt = "<p>Licensed to practice in: " + data.data.licenses[0].state;
      for (i=1;i<data.data.licenses.length;i++){
        txt += ", " + data.data.licenses[i].state;
      }
      txt += "</p>";
      document.getElementById("docLicenses").innerHTML = txt;
    }
      jQuery.getJSON('')
      var ctx = document.getElementById('myChart').getContext('2d');
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'doughnut',

        // The data for our dataset
        data: {
          labels: ["1","2","3","4"],
          datasets: [{
              label: "My First dataset",
            backgroundColor: ['rgb(13, 84, 22)', 'rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)'],
            borderColor: 'rgb(13, 84, 22)',
            data: [50,10,5,30],
        }]
    },

    // Configuration options go here
    options: {}
  });



      txt = "<p>Contact Information</p><br><ul>";
      for (x in data.data.practices){
        txt += "<li>" + data.data.practices[x].name + "<br>" + data.data.practices[x].visit_address.street + "<br>" + data.data.practices[x].visit_address.city + ", " + data.data.practices[x].visit_address.state + "<br>" + data.data.practices[x].phones[0].number;
        if (data.data.practices[x].website){
          txt += "<br><a href=" + data.data.practices[x].website + " target=\"_blank\">Website</a>";
        }
        txt += "</li><br>";
      }
      txt += "</ul>";
      document.getElementById("docAddresses").innerHTML = txt;

    });
  }
});

Template.results.helpers({
  results: function() {
    return Results.find();
  }
});
