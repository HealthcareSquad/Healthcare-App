Meteor.publish('results',
 function(){
   return Results.find();
 }
)

Meteor.publish('feedback',
  function(){
  return Feedback.find();
})

//Meteor.publish('profiles',
//  function(){
//  return Profiles.find();
//})
// dont forget subscribe method and find by user_id
