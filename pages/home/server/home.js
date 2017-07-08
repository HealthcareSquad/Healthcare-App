Meteor.methods({
  "getCoordinates":
  function(address){
    const key= "AIzaSyAgcB5vtpwngFC9WQtyX7oDUtUNlR0hnQs";
    const url= "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+key;
    console.log(url);
    const z = Meteor.http.call("get",url);
    return z.content;
  }
})
