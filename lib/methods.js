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
/*  'profiles.name.update'(new_name){//updating the name
    var current_profile = Profiles.findOne({owner: Meteor.userId()});
    Profiles.update(current_profile,{$set: {name: new_name}});
  },
  'profiles.insurance.update'(new_insurance){//updating the name
    var current_profile = Profiles.findOne({owner: Meteor.userId()});
    Profiles.update(current_profile,{$set: {age: new_insurance}});
  },
  'profiles.location.update'(new_location){//updating the name
    var current_profile = Profiles.findOne({owner: Meteor.userId()});
    Profiles.update(current_profile,{$set: {address: new_location}});
  },
  'profiles.prescription.update'(new_prescription){//updating the name
    var current_profile = Profiles.findOne({owner: Meteor.userId()});
    Profiles.update(current_profile,{$set: {state: new_prescription}});
  },
*/
});
/**
Meteor.methods({
  "getCoordinates":
  function(address){
    if (Meteor.isServer) {
                this.unblock();
                const key= "AIzaSyAgcB5vtpwngFC9WQtyX7oDUtUNlR0hnQs";
                const url= "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+key;
                console.log(url);
                const z = Meteor.http.call("get",url);
                return z.content;
    }

  }
})
*/
