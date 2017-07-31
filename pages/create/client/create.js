Template.create.onCreated(function() {
  Meteor.subscribe('profiles');

});

$("#confirm").keyup(function(event) {
  alert('enter pressed');
if (event.keyCode == 13) {
  $("#createUser").click();
}
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
      favorites:[]
    };
    Meteor.call('updateUser',profile);
    if (!Cookie.get('hasProfile')){
      responsiveVoice.speak('Thanks ' + profile.name.split(' ')[0] + ' you are now ready to use DocFinder.');
      Cookie.set('hasProfile','true');
    }else{
      responsiveVoice.speak('OK, your profile has been updated.');
    }
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
