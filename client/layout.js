var sid;


Template.layout.events({
  'click #logout'(el,instance){
    Meteor.logout();
  },
  'click #goLogin'(el,instance){
    Router.go('profiles');
  }

});

function sid(){
  if (Meteor.userId()){
    return Meteor.userId();
  }else{
     return Math.floor(Math.random() * 2000).toString();
  }
}

Template.layout.onCreated(function(){
    window.sid = sid();
});
