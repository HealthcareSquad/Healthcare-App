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
