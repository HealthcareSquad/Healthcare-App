Template.results.onCreated(function resultsCreated(){
    const latitude = Router.current().params.query.lat;
    const longitude = Router.current().params.query.long;
    jQuery.getJSON('https://api.betterdoctor.com/2016-03-01/doctors?location=' + latitude + '%2C' + longitude + '%2C100&skip=0&limit=10&user_key=876a19607233e092fdc4a30a9c079614', function(data) {
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
    document.getElementById("docModalName").innerHTML = "<h4>" + data.data.profile.first_name + " " + data.data.profile.last_name + "</h4><br><p>More to come!</p>";
    });
  }
});

Template.results.helpers({
  results: function() {
    return Results.find();
  }
});
