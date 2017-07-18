
// function initMap() {}

Template.results.onCreated(function resultsCreated(){
    const input = Router.current().params.query.params;
    const key = '876a19607233e092fdc4a30a9c079614';
    inputArr = input.split('&');

    let url = 'https://api.betterdoctor.com/2016-03-01/doctors?location=' + inputArr[0].replace('lat=','') + ',' + inputArr[1].replace('long=','') + ',5';
    for (x in inputArr){
      if (inputArr[x].substring(0,2) === 'in'){
        if (inputArr[x].replace('in=','') != "none"){
          url += "&query=" + inputArr[x].replace('in=','');
        }
      }else if (inputArr[x].substring(0,2) === 'sp'){
        url += "&specialty_uid=" + inputArr[x].replace('sp=','');
      }else if (inputArr[x].substring(0,3) === 'la='){
        url += "&language=" + inputArr[x].replace('la=','');
      }
    }
    url += '&skip=0&limit=50&sort=distance-asc&user_key=' + key;

    window.initMap = function(){
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function (position) {
      //     var userLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)});
      // }else{
       var userLoc = {lat:parseFloat(inputArr[0].replace('lat=','')) , lng: parseFloat(inputArr[1].replace('long=',''))};
      // }
       var map = new google.maps.Map(document.getElementById('map'), {
         zoom: 11,
         center: userLoc
       });
       var marker = new google.maps.Marker({
         position: userLoc,
         map: map,
         icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
         description:"You"
       });


    jQuery.getJSON(url , function(data) {
      let txt = "<h2><em>I found " + data.meta.total + " results.";
      let speak = "Alright, I found " + data.meta.total + " doctors within five miles of your location that match your criteria,";
      if (data.meta.total > 50){
        txt += " Showing the top 50:";
        speak += " Showing the top 50.";
      }
      txt += "</em></h2>";
      responsiveVoice.speak(speak);
      document.getElementById("numReturned").innerHTML = txt;
      txt = "";
      var markers = [];
      var infoWindows = [];
      for (x in data.data) {
        txt += "<tr data-href=\'#docModal\' height=\'50\' class=\'text-center clickable-row\'\'><td class=\'text-left\'><a id=\'docLink\' data-uid=\'" + data.data[x].uid + "\'href=\'#docModal\' data-toggle=\'modal\'>" + data.data[x].profile.first_name + ' ' + data.data[x].profile.last_name;
        if (data.data[x].profile.title){
          txt += ', ' + data.data[x].profile.title;
        }
        txt += "</a></td><td>" + data.data[x].practices[0].distance.toString().substring(0,4);
        txt += "</td><td>O</td>" ;
        txt += "</tr>";
        var pos = new google.maps.LatLng(data.data[x].practices[0].lat,data.data[x].practices[0].lon);
        markers[x] = new google.maps.Marker({
          position: pos,
          map: map,
          id:x
        });

          infoWindows[x] = new google.maps.InfoWindow({
          content:"<a id=\'docLink\' data-uid=\'" + data.data[x].uid + "\'href=\'#docModal\' data-toggle=\'modal\'>" + data.data[x].profile.first_name + ' ' + data.data[x].profile.last_name + "</a>"
        });

        markers[x].addListener('click',function(){
          infoWindows[this.id].open(map,markers[this.id])
        });
      }


      // txt += "</tbody>";
      document.getElementById("results").innerHTML = txt;
    });
  }
});


Template.results.events({
  'click #docLink':function createDocModal(doc){
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
      txt = "<p class=\'text-center\'>Licensed to practice in: " + data.data.licenses[0].state;
      for (i=1;i<data.data.licenses.length;i++){
        txt += ", " + data.data.licenses[i].state;
      }
      txt += "</p>";
      document.getElementById("docLicenses").innerHTML = txt;
    }
      jQuery.getJSON('https://openpaymentsdata.cms.gov/resource/vq63-hu5i.json?physician_first_name=' + data.data.profile.first_name.toUpperCase() + '&physician_last_name=' + data.data.profile.last_name.toUpperCase() + '&recipient_state=' + data.data.practices[0].visit_address.state, function(payments){
        jQuery('#docPayments').empty();
        document.getElementById("docPayments").innerHTML = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js\"></script><canvas id=\"myChart\"></canvas>";
        console.log(payments);

        var ctx = document.getElementById('myChart').getContext('2d');
        var payees = [];
        var amounts = [];
        for (x in payments){
          payees.push(payments[x].applicable_manufacturer_or_applicable_gpo_making_payment_name);
          amounts.push(parseFloat(payments[x].total_amount_of_payment_usdollars));
        }
        var sum = amounts.reduce(function (a, b) {
          return a + b;
          }, 0);
        if (sum > 0){
          new Chart(ctx, {
            // The type of chart we want to create
            type: 'pie',

            // The data for our dataset
            data: {
              labels: payees,
              datasets: [{
                label: "Big Pharma Payments",
                 backgroundColor: ['rgb(178, 34, 34, 0.2)',
                'rgba(255, 140, 0, 0.2)',
                'rgba(34, 139, 34, 0.2)',
                'rgba(46, 139, 87, 0.2)',
                'rgba(0, 128, 128, 0.2)',
                'rgba(25, 25, 112, 0.2)',
                'rgba(199, 21, 133, 0.2)',
                'rgba(139, 69, 19, 0.2)',
                'rgba(112, 128, 144, 0.2)',
                'rgba(105, 105, 105, 0.2)'],
                borderColor: 'rgb(13, 84, 22)',
                data: amounts,
            }]
        },
        // Configuration options go here
        options: {
          title:{
            display:true,
            text:'Received $' + sum + " in payments from pharmaceutical companies in 2016.",
            fontSize:15
          }
        }
      });
    }else{
      document.getElementById("docPayments").innerHTML = "<p>Received $0 in payments from pharmaceutical companies in 2016.</p>";
    }




      })




      txt = "<p>Contact Information</p><br><ul>";
      for (x in data.data.practices){
        txt += "<li>" + data.data.practices[x].name + "<br>" + data.data.practices[x].visit_address.street + "<br>" + data.data.practices[x].visit_address.city + ", " + data.data.practices[x].visit_address.state + "<br>" + data.data.practices[x].phones[0].number;
        if (data.data.practices[x].website){
          txt += "<br><a href=" + data.data.practices[x].website + " target=\"_blank\" style=\'font-size:15px\'>Website</a>";
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
