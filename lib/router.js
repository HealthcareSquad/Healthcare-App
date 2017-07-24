Router.configure({
	layoutTemplate: 'layout',
	
});

Router.route('about');
Router.route('commands');
Router.route('create');
Router.route('feedback');
Router.route('/', {name: 'home'});
Router.route('profiles');
Router.route('resources');
Router.route('results');
