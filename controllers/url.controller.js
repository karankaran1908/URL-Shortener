const mongoose = require('mongoose');
const validUrl = require('valid-url');
const helpers = require('../helpers.js');
const Url = mongoose.model('Url');
const redis = require("redis");                                                                                         const client = redis.createClient();                                                                                                                                                                                                            client.on("error", function(error) {                                                                                      console.error(error);                                                                                                 });                                                                                                                                                                                                                                             const { promisify } = require("util");                                                                                  const getAsync = promisify(client.get).bind(client);                                                                    const setAsync = promisify(client.set).bind(client);  
const client = redis.createClient({host:"url-redis"});                                                                                                                                                                                                            client.on("error", function(error) {                                                                                      console.error(error);                                                                                                 });                                                                                                                                                                                                                                             const { promisify } = require("util");                                                                                  const getAsync = promisify(client.get).bind(client);                                                                    const setAsync = promisify(client.set).bind(client);
client.on("error", function(error) {  
	console.error(error);                                                                                                 
});
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);                                               
const setAsync = promisify(client.set).bind(client);
const client = redis.createClient();
const baseUrl = 'http://18.225.37.80:8000';
const flushdbAsync = promisify(client.flushdb).bind(client);

module.exports = app => {
app.get('/clearAll/', async (req, res) => {
    try {
      await Url.deleteMany({});
	    await clushDbAsync()
      return res.status(200).json('ok');
    } catch (error) {
      return res.status(500).json(error);
    }
  }); 
 app.get('/resolveUrl/', async (req, res) => {
    try {
      const shortUrl = req.query.shortUrl;
      let urlCode = shortUrl.split('/').pop();
      let resolveFromRedis = await getAsync('urlCode');
	    if(resolveFromRedis){
		await Url.findAndUpdate({
		urlCode:urlCode
		},{
			$inc: { callCount : 1 }
		});
        return res.status(200).json(item);
      } else {
        return res.status(404).json('Not Found');
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  });
  app.post('/shortenUrl', async (req, res) => {
    try {
      const { originalUrl } = req.body;
      if (!validUrl.isUri(originalUrl)) {
        return res.status(400).json('Invalid Url');
      }
       let resolveFromRedis = await getAsync('urlCode');
      if (item) {
        return res.status(200).json({shortenedUrl:resolveFromRedis,originalUrl});
      }
      const count = await Url.count();
      if (count == 3844) {
        item = Url.findOne().sort({ lastUsed: -1 });
        item.originalUrl = originalUrl;
        item.shortenedUrl = `${baseUrl}/${item.urlCode}`;
        await item.save();
        return res.status(200).json(item);
      } else {
        let usedCodes = await Url.find({}).lean();
        usedCodes = usedCodes.map(item => item.urlCode);
        const urlCode = helpers.makeid(2, usedCodes);
        item = new Url({
          originalUrl,
          urlCode,
          shortenedUrl: `${baseUrl}/${urlCode}`,
          callCount: 0,
          lastUsed: new Date()
        });
	      await redis.setAsync(urlCode,originalUrl);
        console.log(item);
        await item.save();
        return res.status(200).json(item);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });
  app.get('/allUrls/', async (req, res) => {
    try {
      const items = await Url.find({}).sort({
        callCount: -1
      });

      return res.status(200).json(items);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });
  app.get('/admin', async function(req, res) {
    try {
      const items = await Url.find({}).sort({
        callCount: -1
      });
      const callCountSum = await Url.aggregate([
        {
          $group: {
            _id: 'sum',
            count: { $sum: '$callCount' }
          }
        }
      ]);
      console.log(items);
      res.render('admin', {
        items: items,
        itemCount: items.length,
        callCountSum: callCountSum[0].count
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  });
  app.get('/', async function(req, res) {
    try {
      res.render('index', {});
    } catch (error) {
      return res.status(500).json(error);
    }
  });
	app.get('/:urlCode/', async (req, res) => {
    try {
      const urlCode = req.params.urlCode;
      const item = await Url.findOne({
        urlCode: urlCode
      });
      if (item) {
        item.callCount = item.callCount + 1;
        await item.save();
        return res.redirect(item.originalUrl);
        // return res.status(200).json(item);
      } else {
        return res.status(404).json('Not Found');
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  });
};
