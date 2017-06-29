Meteor.methods({
  'Feedback.insert'(info) {
    Feedback.insert(info);
  },

  'Feedback.remove'(feedID) {
    Feedback.remove(feedID);
  },
});
