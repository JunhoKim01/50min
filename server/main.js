import '../imports/startup/server/register-api.js';
import CS from '../lib/communityScraper/communityScraper-0.4.1';

Meteor.startup(() => {
  // Develop
  ConsoleMe.enabled = true;
  // TODO: Scrap controller

  // const ts = new CS();
  // Meteor.setTimeout(() => {console.log(ts.testParser());}, 10000);
  communityScraper = new CS();

  // Set options
  let options = {};
  options.clien = Meteor.call('getCommunityScrapOption', 'clien');
  options.ruliweb = Meteor.call('getCommunityScrapOption', 'ruliweb');
  options.bestiz = Meteor.call('getCommunityScrapOption', 'bestiz');
  options.pgr21 = Meteor.call('getCommunityScrapOption', 'pgr21');
  options.mlbpark = Meteor.call('getCommunityScrapOption', 'mlbpark');
  options.todayhumor = Meteor.call('getCommunityScrapOption', 'todayhumor');

  // // Start community scraper
  communityScraper.scrapStart(
  'clien',
  options.clien,
  (thisOptions, resultArr) => {
  Meteor.call('saveItems', resultArr);  // Save items
  Meteor.call('updateSnapshot', thisOptions, resultArr);  // Update DB snapshot
  }
  );
  communityScraper.scrapStart(
    'ruliweb',
    options.ruliweb,
    (thisOptions, resultArr) => {
      Meteor.call('saveItems', resultArr);  // Save items
      Meteor.call('updateSnapshot', thisOptions, resultArr);  // Update DB snapshot
    }
  );
  communityScraper.scrapStart(
    'bestiz',
    options.bestiz,
    (thisOptions, resultArr) => {
      Meteor.call('saveItems', resultArr);  // Save items
      Meteor.call('updateSnapshot', thisOptions, resultArr);  // Update DB snapshot
    }
  );
  communityScraper.scrapStart(
    'pgr21',
    options.pgr21,
    (thisOptions, resultArr) => {
      Meteor.call('saveItems', resultArr);  // Save items
      Meteor.call('updateSnapshot', thisOptions, resultArr);  // Update DB snapshot
    }
  );
  communityScraper.scrapStart(
    'mlbpark',
    options.mlbpark,
    (thisOptions, resultArr) => {
      Meteor.call('saveItems', resultArr);  // Save items
      Meteor.call('updateSnapshot', thisOptions, resultArr);  // Update DB snapshot
    }
  );
  communityScraper.scrapStart(
    'todayhumor',
    options.todayhumor,
    (thisOptions, resultArr) => {
      Meteor.call('saveItems', resultArr);  // Save items
      Meteor.call('updateSnapshot', thisOptions, resultArr);  // Update DB snapshot
    }
  );
});
