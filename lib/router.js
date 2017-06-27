Router.configure({
	layoutTemplate: 'layout',
	//loadingTemplate: 'loading',
	//waitOn: function() {return true;}   // later we'll add more interesting things here ....
});
Router.route('/', {name: 'home'});
Router.route('about');
Router.route('contact');
