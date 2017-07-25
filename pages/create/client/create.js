Template.create.onCreated(function() {
  Meteor.subscribe('profiles');

});

Template.create.events({
  'click #createUser'(elt,instance){
    const username = instance.$('#username').val();
    const password = instance.$('#password').val();
    const confirm = instance.$('#confirm').val();
    if (password != confirm){
      alert('The two password fields do not match. Please try again');
    }else{
      var newUserData = {
        username:username,
        password:password
      };
      Meteor.call('insertUser',newUserData);
      Meteor.loginWithPassword(username,password);
    }
  },
  'click #addProfile'(elt,instance){
    var profile = {
      name:instance.$('#name').val(),
      insurance:instance.$('#insurance').val().split(','),
      location:instance.$('#location').val(),
      prescriptions:instance.$('#prescription').val().split(','),
      favorites:instance.$('#doctors').val().split(',')
    };
    Meteor.call('updateUser',profile);
    Router.go('profiles');
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
