const mongoose = require('mongoose');
const validUrl = require('valid-url');
const helpers = require('../helpers.js');
const Url = mongoose.model('Url');

const baseUrl = 'http://applu.se';

module.exports = app => {
  app.get('/resolveUrl/', async (req, res) => {
    try {
      const shortUrl = req.query.shortUrl;
      let urlCode = shortUrl.split('/').pop();
      const item = await Url.findOne({
        urlCode: urlCode
      });
      if (item) {
        item.callCount = item.callCount + 1;
        await item.save();
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
      let item = await Url.findOne({
        originalUrl: originalUrl
      });
      if (item) {
        return res.status(200).json(item);
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
};
