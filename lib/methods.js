Meteor.methods({
    'Feedback.insert': function(info){
      Feedback.insert(info);
    },

    'Feedback.remove': function(feedID){
      Feedback.remove(feedID);
    },
    'profiles.insert': function(info){
      Meteor.user().profile.favorites.push(info);
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
