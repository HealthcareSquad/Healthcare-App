Meteor.publish('results',
 function(){
   return Results.find();
 }
)

Meteor.publish('feedback',
  function(){
  return Feedback.find();
})
