Template.profiles.helpers({
  'doctornames': function(){
      let nameList = [];
      var idList;
      waitForElement();
      function waitForElement(){
        if(typeof Meteor.user() !== "undefined"){
          idList = Meteor.user().profile.favorites;
        }
        else{
          setTimeout(waitForElement, 250);
        }
      }
      for (x in idList) {
        nameList.push(idList[x][1]);
      }
      console.log(nameList);
      return nameList;
  }
});


Template.profiles.onCreated(function(){
  this.autorun(function () {
    console.log(Meteor.user());
  });
});


Template.profiles.events({
  'click span'(element, instance) {
      /*uid = this.uid;
      console.log(uid)
      var list = Meteor.user().profile.favorites;
      if (list.includes(uid)){
        var index = list.indexOf(uid);
        if (index > -1){
          list.splice(index,1);
        }
      }*/
      var list = Meteor.user().profile.favorites;

      for (y in list){
        if (list[y].uid === this.uid) {

          list.splice(y,1);

        }
      }
      Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.favorites": list}});

},

  'click #login'(elt, instance){
    const username = instance.$('#username').val();
    const password = instance.$('#password').val();

    Meteor.loginWithPassword(username, password, function(error){
    if (Meteor.user()) {
      console.log(Meteor.userId());
    } else {
      alert("Incorrect username and password.");
    }
  });


  },
    'click #docLink':function createDocModal(doc){
      event.preventDefault();
      //uid is gotten from the data attribute of the element clicked
      uid = doc.target.dataset.uid;
      console.log(uid);
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
              text:"Received $" + parseFloat(Math.round(sum * 100) / 100).toFixed(2) + " in payments from pharmaceutical companies in 2016.",
              fontSize:17
            }
          }
        });

        console.log(Chart.defaults.global.defaultColor);
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
