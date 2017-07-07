Template.results.onCreated(function resultsCreated(){
  //this.state = new ReactiveDict();
  Meteor.subscribe('results');


});

Template.results.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var query = template.$('input[type=text]').val();
    if (query)
      Session.set('query', query);
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
