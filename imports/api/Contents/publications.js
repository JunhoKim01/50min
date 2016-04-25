import { Meteor } from 'meteor/meteor';
import { ScrapJPG, ScrapGIF, ScrapAVI } from './Scraps.js';

Meteor.publish('scrapJPG',
  (counter, itemId) => {
    let result = null;
    if (itemId !== null) {
      // Find one item for brdige
      result = ScrapJPG.find({ itemId }, { limit: 1 });
    } else {
      // Find all items for main app
      result = ScrapJPG.find({}, { sort: { createdAt: -1 }, limit: counter });
    }
    return result;
  });
Meteor.publish('scrapGIF',
  (counter, itemId) => {
    let result = null;
    if (itemId !== null) {
      // Find one item for brdige
      result = ScrapJPG.find({ itemId }, { limit: 1 });
    } else {
      // Find all items for main app
      result = ScrapGIF.find({}, { sort: { createdAt: -1 }, limit: counter });
    }
    return result;
  });
Meteor.publish('scrapAVI',
  (counter, itemId) => {
    let result = null;
    if (itemId !== null) {
      // Find one item for brdige
      result = ScrapJPG.find({ itemId }, { limit: 1 });
    } else {
      // Find all items for main app
      result = ScrapAVI.find({}, { sort: { createdAt: -1 }, limit: counter });
    }
    return result;
  });

// Meteor.publish('scrapGIF', loaded => ScrapGIF.find({}, { sort: { createdAt: -1 }, limit: loaded }));
// Meteor.publish('scrapAVI', loaded => ScrapAVI.find({}, { sort: { createdAt: -1 }, limit: loaded }));
// Meteor.publish('scrapAVI', loaded => ScrapAVI.find({}, { sort: { createdAt: -1 }, limit: loaded }));

