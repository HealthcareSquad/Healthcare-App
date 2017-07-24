Meteor.methods({
    'results.insert': function(doctor){
      Results.insert(doctor);
    },

    'results.remove': function(doctor){
      Results.remove(doctor);
    },

    'Feedback.insert': function(info){
      Feedback.insert(info);
    },

    'Feedback.remove': function(feedID){
      Feedback.remove(feedID);
    },
    'profiles.insert': function(info){
      Profiles.insert(info);
    },

    'profiles.remove': function(info){
      Profiles.remove(info);
    },

    'updateUser':function(profile){//updating the name
        Meteor.users.update(this.userId, {
          $set: { profile:profile}
        });
        console.log('Updated' + this.userId);
    },

    'insertUser':function(newUserData){
      return Accounts.createUser(newUserData);
    }

});
