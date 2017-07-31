Meteor.methods({
    'Feedback.insert': function(info){
      Feedback.insert(info);
    },

    'Feedback.remove': function(feedID){
      Feedback.remove(feedID);
    },

    'updateUser':function(profile){//updating the name
        Meteor.users.update(this.userId, {
          $set: { profile:profile}
        });
        console.log('Updated' + this.userId);
    },
    'insertUser':function(newUserData){
      return Accounts.createUser(newUserData);
    },
    'checkIfUserExists': function (username) {
        return (Meteor.users.findOne({username: username})) ? true : false;
    }

});
