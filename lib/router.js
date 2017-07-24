Router.configure({
	layoutTemplate: 'layout',
	//loadingTemplate: 'loading',
	//waitOn: function() {return true;}   // later we'll add more interesting things here ....
});

Router.route('about');
Router.route('commands');
Router.route('create');
Router.route('feedback');
Router.route('/', {name: 'home'});
Router.route('profiles');
Router.route('resources');
Router.route('results');
Router.route('contact');
