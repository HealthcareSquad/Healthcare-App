Template.feedback.onCreated(function feedbackCreated(){
  Meteor.subscribe('feedback');
});

Template.feedback.helpers({
  feedbacklist() {return Feedback.find()}
})

//Adds feedback to collection when button is clicked
Template.feedback.events({
  'click button' (element, instance) {
    const name = instance.$('#name').val();
    const textarea = $('#feedbackfield').val();
    console.log(name);
    console.log(textarea);

    instance.$('#name').val("");
    instance.$('#feedbackfield').val("");
    if (name != "" || feedbackfield != "") {
      console.log('adding '+name);
      var info =
        {
          Name:name,Feedback:textarea
        };
      console.log("info: " +info);
      Meteor.call('Feedback.insert',info);

      console.log("done");
    } else {
      alert('Invalid Entry...field is blank?');
    }

  }
})

//Removes one feedback item if the user clicks the corresponding x button.
Template.feedback.events({
  'click span'(element, instance) {
  console.log(this.feed._id);
  var feedID = this.feed._id

  Meteor.call('Feedback.remove',feedID);
  }
})
