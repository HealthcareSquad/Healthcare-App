Template.results.onCreated(function resultsCreated(){
    this.autorun(function () {
      console.log(Meteor.user());
      counter = counter+1;
      console.log(counter);
      });

    //Query is received as a string sent by the router and saved as 'input'. Key is BetterDoctor API key.
    const input = Router.current().params.query.params;
    const key = '876a19607233e092fdc4a30a9c079614';
    //Split input by parameters.....
    inputArr = input.split('&');

    //Start of API call.......
    console.log(counter);
    let url = 'https://api.betterdoctor.com/2016-03-01/doctors?location=' + inputArr[0].replace('lat=','') + ',' + inputArr[1].replace('long=','') + ',5';
    //Parsing query sent by router and appending to API call.......
    for (x in inputArr){
      if (inputArr[x].substring(0,2) === 'in'){
        if (inputArr[x].replace('in=','') != ("no-insurance" && "your-insurance")){
          url += "&query=" + inputArr[x].replace('in=','');
        }else if (inputArr[x].replace('in=','') === "your-insurance"){
          url += "&query=" + Meteor.user().profile.insurance;
        }
      }else if (inputArr[x].substring(0,2) === 'sp'){
        url += "&specialty_uid=" + inputArr[x].replace('sp=','');
      }

    }
    url += '&skip=' + counter*50 + '&limit=50&sort=distance-asc&user_key=' + key;
    console.log(url);
    //Creates Google Map centered on user
    window.initMap = function(){
       var userLoc = {lat:parseFloat(inputArr[0].replace('lat=','')) , lng: parseFloat(inputArr[1].replace('long=',''))};

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

    //This function retrieves JSON document returned by Better Doctor API and saves it as a document called 'data'.
    //Constructs a table of results as well.
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
      //these for loops find the closest practice that each given doctor works at.
      for (x in data.data) {
        var xsave = 0;
        var ysave = 0;
        var finaldistance = 0;

        for (y in data.data[x].practices){
          if(finaldistance===0){
            xsave = x;
            ysave = y;
            finaldistance = data.data[x].practices[y].distance;
          }else if(finaldistance > data.data[x].practices[y].distance){
            xsave = x;
            ysave = y;
            finaldistance = data.data[x].practices[y].distance;
          }

        }

        //Doctor's Better Doctor UID is stored as a data attribute of the <a> wrapper around the doctor's name.
        txt += "<tr data-href=\'#docModal\' height=\'50\' class=\'text-center clickable-row\'\'><td class=\'text-left\'><a id=\'docLink\' data-uid=\'" + data.data[x].uid + "\'href=\'#docModal\' data-toggle=\'modal\'>" + data.data[x].profile.first_name + ' ' + data.data[x].profile.last_name;
        if (data.data[x].profile.title){
          txt += ', ' + data.data[x].profile.title;
        }
        //the id of each doctor's add-to-favorites button is that doctor's uid.
        var currentName = data.data[x].profile.first_name + " " + data.data[x].profile.last_name + ", " + data.data[x].profile.title;
        txt += "</a></td><td>" + finaldistance.toString().substring(0,4);
        txt += "</td><td><button class=\"btn btn-default btn-sm\" name=\"docFav\" id=\"" + data.data[x].uid + "\" data-uid=\"" + data.data[x].uid + "\" + data-name=\"" + currentName + "\"><i class=\"fa fa-star\" aria-hidden=\"true\"></i></button></td>" ;
        txt += "</tr>";
        //Each doctor has a pin added to the map at the nearest practice to the user.
        var pos = new google.maps.LatLng(data.data[xsave].practices[ysave].lat,data.data[xsave].practices[ysave].lon);
        markers[x] = new google.maps.Marker({
          position: pos,
          map: map,
          id:x
        });
          //The pin also links to the doctor's profile
        infoWindows[x] = new google.maps.InfoWindow({
          content:"<a id=\'docLink\' data-uid=\'" + data.data[x].uid + "\'href=\'#docModal\' data-toggle=\'modal\'>" + data.data[x].profile.first_name + ' ' + data.data[x].profile.last_name + "</a>"
        });
        markers[x].addListener('click',function(){
          infoWindows[this.id].open(map,markers[this.id])
        });
      }


      //Map is positioned as a fixed div on the right side of screen. Had to fudge this one a lot to get it to work
      //thanks to Google's weird API characteristics.....
      document.getElementById("results").innerHTML = txt;
      //makes the favorites buttons display different colors for logged in users, depending on whether the doctor is in their favorites list or not
      for (x in data.data) {
        if (Meteor.user()){
          document.getElementById(data.data[x].uid).style.backgroundColor = "#1985A1";
          for (y in Meteor.user().profile.favorites){
            if (Meteor.user().profile.favorites[y].uid === data.data[x].uid) {
              document.getElementById(data.data[x].uid).style.backgroundColor = "#fc6f6f";
            }
          }
        }else{
          //if not logged in, all favorites buttons are blue
          document.getElementById(data.data[x].uid).style.backgroundColor = "#1985A1";
        }
      }
      document.getElementById("mapWrapper").style.position = "fixed";
      document.getElementById("mapWrapper").style.top = "25%";
      document.getElementById("mapWrapper").style.left = "48%";


    });
  }
});

//Click event to add a doctor to user's favorites
Template.results.events({
  'click button': function(element){
    if (Meteor.user()){
      uid = element.currentTarget.dataset.uid;
      name = element.currentTarget.dataset.name;
      doctor = {uid:uid, name:name};
      var list = Meteor.user().profile.favorites;
      var foundIt = false;
      for (y in list){
        if (list[y].uid === doctor.uid) {
          document.getElementById(uid).style.backgroundColor = "#1985A1";
          list.splice(y,1);
          foundIt = true;
        }
      }
      if (foundIt === false){
        document.getElementById(uid).style.backgroundColor = "#fc6f6f";
        list.push(doctor);
      }
      Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.favorites": list}});
    }else{
      alert('You cannot add favorites unless you are logged in!');
    }
  }

});

//Click event to open a doctor's respective profile as a modal. Calls Better Doctor API and uses the content of the returned
//JSON to fill out elements. Also calls OpenPaymentsData API to get info on 2016 big pharma payments to docs. A pie chart is created
//to visualize these data.
Template.results.events({
  'click #docLink':function createDocModal(doc){
    event.preventDefault();
    //uid is gotten from the data attribute of the element clicked
    uid = doc.target.dataset.uid;
    //calls the betterdoctor API to get doctor bio, practices, accepted insurance, etc
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


      var insurers = [];
      for (i=0;i<data.data.insurances.length-1;i++){
        var current = data.data.insurances[i].insurance_provider.name;
        insurers.push(" " + current);
      }
      var uniques = [];
      $.each(insurers, function(i, el){
          if($.inArray(el, uniques) === -1) uniques.push(el);
      });
      document.getElementById("docInsurances").innerHTML = "<p>Accepted Insurers</p><br>" + uniques;

    }
    //calls Open Payments to get info about pharmaceutical payments to the given doctor
      jQuery.getJSON('https://openpaymentsdata.cms.gov/resource/vq63-hu5i.json?physician_first_name=' + data.data.profile.first_name.toUpperCase() + '&physician_last_name=' + data.data.profile.last_name.toUpperCase() + '&recipient_state=' + data.data.practices[0].visit_address.state, function(payments){
        jQuery('#docPayments').empty();
        document.getElementById("docPayments").innerHTML = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js\"></script><canvas id=\"myChart\"></canvas>";

        var ctx = document.getElementById('myChart').getContext('2d');
        var payees = [];
        var amounts = [];
        for (x in payments){
          payees.push(payments[x].applicable_manufacturer_or_applicable_gpo_making_payment_name + " to promote " + payments[x].name_of_drug_or_biological_or_device_or_medical_supply_1);
          amounts.push(parseFloat(payments[x].total_amount_of_payment_usdollars));
        }
        var sum = amounts.reduce(function (a, b) {
          return a + b;
          }, 0);
        if (sum > 0){
          Chart.defaults.global.legend.display = false;
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
                'rgba(105, 105, 105, 0.2)',
                'rgb(178, 34, 34, 0.2)',
               'rgba(255, 140, 0, 0.2)',
               'rgba(34, 139, 34, 0.2)',
               'rgba(46, 139, 87, 0.2)',
               'rgba(0, 128, 128, 0.2)',
               'rgba(25, 25, 112, 0.2)',
               'rgba(199, 21, 133, 0.2)',
               'rgba(139, 69, 19, 0.2)',
               'rgba(112, 128, 144, 0.2)',
               'rgba(255, 128, 128, 1)',
               'rgba(200, 128, 255, 1)',
               'rgba(128, 181, 255, 1)',
               'rgba(128, 255, 176, 1)',
               'rgba(255, 255, 128, 1)',
               'rgba(255, 149, 128, 1)',
               'rgba(255, 128, 223, 1)',
               'rgba(134, 128, 255, 1)',
               'rgba(132, 255, 128, 1)',
               'rgba(255, 189, 128, 1)',
               'rgba(105, 105, 105, 0.2)',
               'rgb(178, 34, 34, 0.2)',
              'rgba(255, 140, 0, 0.2)',
              'rgba(34, 139, 34, 0.2)',
              'rgba(46, 139, 87, 0.2)',
              'rgba(0, 128, 128, 0.2)',
              'rgba(25, 25, 112, 0.2)',
              'rgba(199, 21, 133, 0.2)',
              'rgba(139, 69, 19, 0.2)',
              'rgba(112, 128, 144, 0.2)',
              'rgba(255, 128, 128, 1)',
              'rgba(200, 128, 255, 1)',
              'rgba(128, 181, 255, 1)',
              'rgba(128, 255, 176, 1)',
              'rgba(255, 255, 128, 1)',
              'rgba(255, 149, 128, 1)',
              'rgba(255, 128, 223, 1)',
              'rgba(134, 128, 255, 1)',
              'rgba(132, 255, 128, 1)',
              'rgba(255, 189, 128, 1)',
              'rgba(105, 105, 105, 0.2)',
              'rgb(178, 34, 34, 0.2)',
             'rgba(255, 140, 0, 0.2)',
             'rgba(34, 139, 34, 0.2)',
             'rgba(46, 139, 87, 0.2)',
             'rgba(0, 128, 128, 0.2)',
             'rgba(25, 25, 112, 0.2)',
             'rgba(199, 21, 133, 0.2)',
             'rgba(139, 69, 19, 0.2)',
             'rgba(112, 128, 144, 0.2)',
             'rgba(255, 128, 128, 1)',
             'rgba(200, 128, 255, 1)',
             'rgba(128, 181, 255, 1)',
             'rgba(128, 255, 176, 1)',
             'rgba(255, 255, 128, 1)',
             'rgba(255, 149, 128, 1)',
             'rgba(255, 128, 223, 1)',
             'rgba(134, 128, 255, 1)',
             'rgba(132, 255, 128, 1)',
             'rgba(255, 189, 128, 1)',
             'rgba(105, 105, 105, 0.2)'],
                borderColor: 'rgb(13, 84, 22)',
                data: amounts,
            }]
        },
        // Configuration options go here
        options: {
          responsive:true,
          legend:{
            display:false
          },
          title:{
            display:true,
            text:"Received $" +parseFloat(Math.round(sum * 100) / 100).toFixed(2)+ " in payments from pharmaceutical companies in 2016.",
            fontSize:17
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
