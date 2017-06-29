import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup


  //Feedback.remove({});  // clear the database
  Feedback.insert({Name: 'Your Name',Feedback:'Feedback goes here'});
});
