Template.profiles.onCreated(function(){
  this.autorun(function () {
    console.log(Meteor.user());
  });
});

Template.profiles.events({
  'click span'(element, instance) {
  console.log(this.profile._id);
  var feedID = this.profile._id;
  Meteor.call('profiles.remove',feedID);
},

  'click #login'(elt, instance){
    const username = instance.$('#username').val();
    const password = instance.$('#password').val();

    Meteor.loginWithPassword(username,password);

  }

});
