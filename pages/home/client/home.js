  var latitude;
  var longitude;

  Template.home.events({
  'click button'(element,instance){
    const place= instance.$('#find').val();
    var address = place.replace(/ /g, '+');
    instance.$('#find').val("");
    const key= "AIzaSyAgcB5vtpwngFC9WQtyX7oDUtUNlR0hnQs";
    const url= "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+key;
    console.log(url);
    jQuery.getJSON(url, function(data){
      latitude = data.results[0].geometry.location.lat;
      longitude = data.results[0].geometry.location.lng;
      Router.go('results', {}, {query: {lat:latitude,long:longitude}});
    });
    }

});


Template.results.events({
  //this is for a insert button, change it to a span or other thing as needed
  'click button'(elt, instance){
    const name = instance.$('#name').val();
    const specialized = instance.$('#specialized').val();
    const insurance = instance.$('#insurance').val();
    //whatever other constants we need
    var doctor =
      { name:name,
        specialized:specialized,
        insurance:insurance
        //again, whatever other things we need
      };
    Meteor.call('results.insert',doctor);

  }
})
