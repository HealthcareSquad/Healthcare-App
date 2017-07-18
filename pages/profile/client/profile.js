//Template.profile.onCreated(function() {
//  Meteor.subscribe('profiles');
//});
Template.profiles.onCreated(function() {
  Meteor.subscribe('profiles');
});

Template.profiles.helpers({
  profileslist() {return Profiles.find()}
})

Template.addProfile.events({
  'click button'(elt,instance){
    const name = instance.$('#name').val();
    const insurance = instance.$('#insurance').val();
    const location = instance.$('#location').val();
    const prescription = instance.$('#prescription').val();
    console.log('adding'+name);

    instance.$('#name').val("");
    instance.$('#insurance').val("");
    instance.$('#location').val("");
    instance.$('#prescription').val("");
    var info = {name:name, insurance:insurance, location:location, prescription:prescription, owner:Meteor.userId()};
    //add favorites variable

    Meteor.call('profiles.insert',info);
  }
})

Template.profiles.events({
  'click span'(element, instance) {
  console.log(this.profile._id);
  var feedID = this.profile._id

  Meteor.call('profiles.remove',feedID);
  }
})

// probably want an upsert method
