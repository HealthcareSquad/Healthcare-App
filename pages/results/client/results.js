Template.results.onCreated(function resultsCreated(){
  window.onload = jQuery.getJSON('https://api.betterdoctor.com/2016-03-01/doctors?location=ma-waltham&skip=0&limit=10&user_key=876a19607233e092fdc4a30a9c079614', function(data) {
    let txt = "<table class=\"table table-hover\">";
    for (x in data.data) {
      txt += "<a href=\"docProfile.html\"" + data.data[x].uid + "\"\"><tr><td>" + data.data[x].profile.first_name + ' ' + data.data[x].profile.last_name + ', ' + data.data[x].profile.title + "</td><td>" + data.data[x].practices[0].name;
      if (data.data[x].practices.length > 1){
        txt += ", and " + data.data[x].practices.length + " others</td>";
      }else{
        txt += "</td>";
      }

      txt += "</tr></a>";
    }
    txt += "</table>";
    document.getElementById("results").innerHTML = txt;
    });
});

Template.results.events({
  'click span': function(event, template) {
    event.preventDefault();
    Router.go('docProfile docID="this.span.id"');
  }
});

Template.results.helpers({
  results: function() {
    return Results.find();
  }
});



//fill in what template this works with
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


//fill in what template this goes with
Template.results.events({
  //this is for a remove button, change it to a span or other thing as needed
  'click button'(elt,instance) {
        console.dir(this);
        console.log(this);
        console.log(this.results._id);
        Meteor.call('results.remove',this.results);
  }
})
