import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  if (Results.find().count() === 0) {
       console.log("Importing json to db")

       var data = JSON.parse(Assets.getText("waltham-results.json"));

       data['data'].forEach(function (item, index, array) {
           Results.insert(item);
       })
       console.log(Results.find().fetch());
   }
});
