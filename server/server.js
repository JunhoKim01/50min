import CS from '../lib/communityScraper/communityScraper-0.4.1';
// import CS from 'app/lib/CommunityScraper';


if (Meteor.isServer) {
  Meteor.startup(() => {
    // Publishing
    Meteor.publish('scrapJPG', loaded => ScrapJPG.find({}, { sort: { createdAt: -1 }, limit: loaded }));
    Meteor.publish('scrapGIF', loaded => ScrapGIF.find({}, { sort: { createdAt: -1 }, limit: loaded }));
    Meteor.publish('scrapAVI', loaded => ScrapAVI.find({}, { sort: { createdAt: -1 }, limit: loaded }));
    Meteor.publish('scrapTXT', loaded => ScrapTXT.find({}, { sort: { createdAt: -1 }, limit: loaded }));

    Meteor.publish('status', () => Status.find());

    // Develop
    ConsoleMe.enabled = true;


    // TODO: Scrap controller

    const DEVMODE = true;

    if (DEVMODE === true) {
      // DEVO MODE
      const ts = new CS();

      Meteor.setTimeout(() => {console.log(ts.testParser());}, 10000);
    }


    // communityScraper = new CS();
    
    // // Set options
    // let options = {};
    // options.clien = Meteor.call('getCommunityScrapOption', 'clien');
    // options.ruliweb = Meteor.call('getCommunityScrapOption', 'ruliweb');
    // // console.log(options.clien);
    // // Start community scraper
    // communityScraper.scrapStart(
    //   'clien',
    //   options.clien,
    //   (thisOptions, resultArr) => {
    //   // Save items
    //   Meteor.call('saveItems', resultArr);
    //   // Update DB snapshot
    //   Meteor.call('updateSnapshot', thisOptions, resultArr);
    //   }
    // );
    // communityScraper.scrapStart(
    //   'ruliweb',
    //   options.ruliweb,
    //   (thisOptions, resultArr) => {
    //   // Save items
    //   Meteor.call('saveItems', resultArr);
    //   // Update DB snapshot
    //   Meteor.call('updateSnapshot', thisOptions, resultArr);
    //   }
    // );


  });
}
