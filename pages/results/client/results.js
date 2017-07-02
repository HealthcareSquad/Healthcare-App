//fill in what template this works with
Template.something.events({
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
Template.something.events({
  //this is for a remove button, change it to a span or other thing as needed
  'click button'(elt,instance) {
        console.dir(this);
        console.log(this);
        console.log(this.results._id);
        Meteor.call('results.remove',this.results);
  }
})
