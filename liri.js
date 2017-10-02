var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var client = new twitter(keys.twitterKeys);
var spotifyClient = new spotify(keys.SpotifyKeys);
var fs = require('fs');


var nodeArgv = process.argv;
var action = process.argv[2];

switch(action){
  case "my-tweets":
    myTweets();
  break;

  case "spotify-this-song":
    spotifySong();
  break;

  case "movie-this":
    movies();
  break;

  case "do-what-it-says":
    doIt();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function myTweets(){
  var screenName = {screen_name: 'bootcamphw'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@bootcamphw: " + tweets[i].text + " Create At: " + date.substring(0, 19)); 
      
     }
    }else{
      console.log('Error');
    }
  });
}

function spotifySong(song){
  spotifyClient.get({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];

        console.log("Artist: " + songData.artists[0].name);
        console.log("Song: " + songData.name);
        console.log("Preview URL: " + songData.preview_url);
        console.log("Album: " + songData.album.name);
       
    	}
    } else{
      console.log('Error');
    }
  });
}

function movies(title){
  var omdbURL = 'http://www.omdbapi.com/?t=' + (title || 'Mr.Nobody') + '&plot=short&apikey=40e9cece';

  request(omdbURL, function (error, response, info){
    if(!error && response.statusCode == 200){
      var info = JSON.parse(info);

      console.log("Title: " + info.Title);
      console.log("Release Year: " + info.Year);
      console.log("IMdB Rating: " + info.imdbRating);
      console.log("Rotten Tomatoes Rating: " + info.tomatoRating);
      console.log("Country: " + info.Country);
      console.log("Language: " + info.Language);
      console.log("Plot: " + info.Plot);
      console.log("Actors: " + info.Actors);
      
    } else{
      console.log('Error')
    }
    if(title === "Mr. Nobody"){
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");
    }
  });

}

function doIt(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}