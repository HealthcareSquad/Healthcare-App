Template.create.onCreated(function() {
  Meteor.subscribe('profiles');

});

Template.create.events({
  'click button'(elt,instance){
    const username = instance.$('#username').val();
    const password = instance.$('#password').val();
    const confirm = instance.$('#confirm').val();
    console.log('adding '+username);

    instance.$('#username').val("");
    instance.$('#password').val("");
    instance.$('#confirm').val("");
  }
});

Template.create.events({
  'click span'(element, instance) {
  console.log(this.profile._id);
  var feedID = this.profile._id
  Meteor.call('profiles.remove',feedID);
},
  'click #login'(elt, instance){
    const username = instance.$('#username').val();
    const password = instance.$('#password').val();
    Meteor.loginWithPassword(username,password);
    console.log(username);
  }
})
