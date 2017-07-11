Template.results.onCreated(function resultsCreated(){
    const latitude = Router.current().params.query.lat;
    const longitude = Router.current().params.query.long;
    jQuery.getJSON('https://api.betterdoctor.com/2016-03-01/doctors?location=' + latitude + '%2C' + longitude + '%2C100&skip=0&limit=20&user_key=876a19607233e092fdc4a30a9c079614', function(data) {
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
      document.getElementById("docModalName").innerHTML = "<p><strong>" + data.data.profile.first_name + " " + data.data.profile.last_name + ", " + data.data.profile.title + "</strong></p>";
      document.getElementById("profImage").innerHTML = "<img src=\"" + data.data.profile.image_url + "\"><br>";
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
      txt = "<p>Licensed to practice in: " + data.data.licenses[0].state;
      for (i=1;i<data.data.licenses.length;i++){
        txt += ", " + data.data.licenses[i].state;
      }
      txt += "</p>";
      document.getElementById("docLicenses").innerHTML = txt;
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
