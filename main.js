const express = require('express')
const fetchJson = require('fetch-json');
var dateTime = require('node-datetime');
var RSS = require('rss');
var fs = require('fs');
var url = require('url');

// express
const app = express()
const port = 3000
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', 'views');

// global variables
const userUrl =    'http://api.csblogs.com/v2.0/user';
const postUrl =    'http://api.csblogs.com/v2.0/post';
var csblogsData =   null;
var userData =      null;

// create RSS feed
var feed = new RSS({
    title: 'CSBlogs RSS Feed',
    description: 'description',
    feed_url: 'http://127.0.0.1/rss.xml',
    site_url: 'http://127.0.0.1',
    image_url: 'http://127.0.0.1:3000/images/csblogs-logo-icon.png',
    docs: 'https://na.thaniel.uk/csblogs-rss',
    managingEditor: 'Nathaniel (na.thaniel.uk)',
    webMaster: 'Nathaniel (na.thaniel.uk) on behalf of CSBlogs',
    copyright: 'Individual Creators (and CSBlogs)',
    language: 'en',
    ttl: '60',
});

// JSON to RSS
function dataToRSS(data) {
  for (var i = 0; i < data.length; i++)
  {
      feed.item({
          title:  data[i].title,
          description: data[i].description,
          url: data[i].link, // link to the item
          author: url.parse(data[i].link).hostname, //getUserByID(data.authorID), data.authorID, optional - defaults to feed author property
          date: data[i].datePublished, // any format that js Date can parse.
      });
  };

  return feed.xml();
}

// endpoints
app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/feed.xml', function(req, res, next) {
  res.setHeader('content-type', 'application/xml; charset=utf-8')
  fetchJson.get(postUrl).then(result => {
    dataToRSS(result);
    res.send(feed.xml());
  });
});

app.use(function(req, res) { // handle 404
  res.render('404');
});



// run the server
app.listen(port, () => console.log(`We're up and running on port ${port}!`))
