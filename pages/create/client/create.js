Template.create.onCreated(function() {
  Meteor.subscribe('profiles');
});

Template.create.events({
  /**On clicking the submit button or pressing enter on the createUser template,
  the user's chosen username and password are checked, a popup is sent out if
  there is a problem, and if not the the accound is created and the user is
  logged in.*/
  'click #createUser'(elt,instance){
    const username = instance.$('#username').val();
    const password = instance.$('#password').val();
    const confirm = instance.$('#confirm').val();
    if (password != confirm){
      alert('The two password fields do not match. Please try again.');
    }else if (password === "" || username === ""){
      alert('Please fill in all fields.')

    }else if (password.length < 6 || username.length < 6){
     alert("Please make usernames and passwords at least six characters.")
    }else{
      Meteor.call('checkIfUserExists', username, function (err, result) {
          if (err) {
              alert('There is an error while checking username');
          } else {
              if (result === false) {
                var newUserData = {
                  username:username,
                  password:password
                };
                Meteor.call('insertUser',newUserData);
                Meteor.loginWithPassword(username,password);
              } else {
                  alert('A user with this username already exists..');
              }
          }
      });
    }


  },
  /**On clicking submit or pressing enter on the addProfile template, the users'
  information is submitted. If the user has left their name, insurance, or
  location blank, a popup appears telling them to correct the problem. If not,
  they are directed to their completed profile. */
  'click #addProfile'(elt,instance){
      const name = instance.$('#name').val();
      const insurance = instance.$('#insurance').val().split(',');
      const location = instance.$('#location').val();
      const prescriptions = instance.$('#prescription').val().split(',');
    if (name === ""){
      alert('Please fill in a name.')
    }
    if (location === ""){
      alert('Please fill in a location.')
    }
    if (insurance[0] === ""){
      alert('Please fill in an insurance company.')
    }
    if (name != "" && insurance[0] != "" && location != ""){
      var profile = {
        name:name,
        insurance:insurance,
        location:location,
        prescriptions:prescriptions,
        favorites:[]
      };
    }
    if (name != "" && insurance[0] != "" && location != ""){
    Meteor.call('updateUser',profile);
    if (!Cookie.get('hasProfile')){
      responsiveVoice.speak('Thanks, you are now ready to use DocFinder.');
      Cookie.set('hasProfile','true');
    }else{
      responsiveVoice.speak('OK, your profile has been updated.');
    }
    Router.go('profiles');
  }
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
