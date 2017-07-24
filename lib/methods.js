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

    'profiles.update'(info){//updating the name
      if (Profiles.findOne({'name':info.name})) {
        Profiles.update({'name':info.name}, {
          $set: { 'insurance': info.insurance }
        });
      } else {
        Meteor.call('profiles.insert',info);
      }
    },

});
