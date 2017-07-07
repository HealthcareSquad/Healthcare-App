Meteor.publish('docSearch', function(query) {
  var self = this;
  try {
    var response = HTTP.get('https://api.betterdoctor.com/2016-03-01/doctors?location=37.773,-122.413,100&skip=2&limit=10&user_key=876a19607233e092fdc4a30a9c079614', {
      params: {
        q: query
      }
    });

    _.each(response.data.items, function(item) {
      var doc = {
        first: item.first_name,
        last: item.last_name,
        title: item.title,
      };

      self.added('results', Random.id(), doc);
    });

    self.ready();

  } catch(error) {
    console.log(error);
  }
});
