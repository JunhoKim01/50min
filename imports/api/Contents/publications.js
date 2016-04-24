import { Meteor } from 'meteor/meteor';
import { ScrapJPG, ScrapGIF, ScrapAVI } from './Scraps.js';

Meteor.publish('scrapJPG', loaded => ScrapJPG.find({}, { sort: { createdAt: -1 }, limit: loaded }));
Meteor.publish('scrapGIF', loaded => ScrapGIF.find({}, { sort: { createdAt: -1 }, limit: loaded }));
Meteor.publish('scrapAVI', loaded => ScrapAVI.find({}, { sort: { createdAt: -1 }, limit: loaded }));
// Meteor.publish('scrapAVI', loaded => ScrapAVI.find({}, { sort: { createdAt: -1 }, limit: loaded }));

