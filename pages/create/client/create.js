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
      prescriptions:instance.$('#prescription').val().split(',')
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

 update(){//this is where everything is updated
      if(!(instance.$('#name').val() == "")){//if the field is not empty
        const name = instance.$('#name').val();//save the value and call the meteor update function
        Meteor.call('profiles.name.update', name)
        instance.$('#name').val("");//reset the input area
      }
      if(!(instance.$('#insurance').val() == "")){
        const insurance = instance.$('#insurance').val();
        Meteor.call('profiles.insurance.update', insurance)
        instance.$('#insurace').val("");
      }
      if(!(instance.$('#location').val() == "")){
        const location = instance.$('#location').val();
        Meteor.call('profiles.location.update', location)
        instance.$('#location').val("");
      }
      if(!(instance.$('#prescription').val() == "")){
        const prescription = instance.$('#prescription').val();
        Meteor.call('profiles.prescription.update', prescription)
        instance.$('#prescription').val("");
      }
    },
  'click #login'(elt, instance){
    const username = instance.$('#username').val();
    const password = instance.$('#password').val();
    Meteor.loginWithPassword(username,password);
    console.log(username);

  }




})
