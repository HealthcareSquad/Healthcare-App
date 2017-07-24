Template.layout.events({
  'click #logout'(el,instance){
    Meteor.logout();
  },
  'click #goLogin'(el,instance){
    Router.go('profiles');
  }
});
