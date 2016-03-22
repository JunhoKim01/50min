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

    const DEVMODE = false;

    if (DEVMODE === true) {
      // DEVO MODE
      const ruliwebScraper = new CS('ruliweb');
      Meteor.setTimeout(() => {console.log(ruliwebScraper.testParser());}, 10000);
    }

    // const clienScraper = new CS('clien');

    let options = {};
    options.clien = {
      communityName: 'clien',
      types: ['jpg', 'gif', 'avi'],
      regexps: ['default', 'default', 'default'],
      intervalMin: 5,
      lastPage: 1,
    };

    // options.clien.jpg = Status.findONe({instanceId: 'clien.jpg'});
    // if (options.clien.jpg) {
    //   // Use defulat option
    //   options.clien.jpg = {
    //     communityName: 'clien',
    //     type: 'jpg',
    //     regexp: 'default',
    //     intervalMin: 1,
    //     lastPage: 1,
    //   };  
    // }
    // options.clien.gif = Status.findONe({instanceId: 'clien.gif'});
    // if (options.clien.gif) {
    //   // Use defulat option
    //   options.clien.gif = {
    //     communityName: 'clien',
    //     type: 'gif',
    //     regexp: 'default',
    //     intervalMin: 1,
    //     lastPage: 1,
    //   };  
    // }
    // options.clien.jpg = Status.findONe({instanceId: 'clien.jpg'});
    // if (options.clien.jpg) {
    //   // Use defulat option
    //   options.clien.jpg = {
    //     communityName: 'clien',
    //     type: 'jpg',
    //     regexp: 'default',
    //     intervalMin: 1,
    //     lastPage: 1,
    //   };  
    // }


    // clienScraper.scrapStartWithOptions(options.clien.jpg, (resultArr) => {
    //   // Save items
    //   resultArr.forEach((item) => {ScrapJPG.insert(item);});
    //   // Update DB snapshot
    //   Meteor.call('updateSnapshot', options.clien.jpg, resultArr);
    // });
    // clienScraper.scrapStartWithOptions(options.clien.gif, (resultArr) => {
    //   // Save items
    //   resultArr.forEach((item) => {ScrapGIF.insert(item);});
    //   // Update DB snapshot
    //   Meteor.call('updateSnapshot', options.clien.gif, resultArr);
    // });
    // clienScraper.scrapStartWithOptions(options.clien.avi, (resultArr) => {
    //   // Save items
    //   resultArr.forEach((item) => {ScrapAVI.insert(item);});
    //   // Update DB snapshot
    //   Meteor.call('updateSnapshot', options.clien.avi, resultArr);
    // });

    // const ruliwebScraper = new CS('ruliweb');
    // ruliwebScraper.scrapStart('jpg', 'default', 1, 5, (result) => {
    //   ScrapJPG.insert(result);
    // });
    // ruliwebScraper.scrapStart('gif', 'default', 1, 10, (result) => {
    //   ScrapGIF.insert(result);
    // });
    // ruliwebScraper.scrapStart('avi', 'default', 1, 10, (result) => {
    //   ScrapAVI.insert(result);
    // });


    // SCRAP MODE

    // DDanzi
    // const ddanziScraper = new CS('ddanzi');
    // ddanziScraper.scrapStart('jpg', 'default', 1, 5, (result) => {
    //   ScrapJPG.insert(result);
    // });
    // ddanziScraper.scrapStart('gif', 'default', 1, 10, (result) => {
    //   ScrapGIF.insert(result);
    // });
    // ddanziScraper.scrapStart('avi', 'default', 1, 10, (result) => {
    //   ScrapAVI.insert(result);
    // });
    

    // TODO: Custom scraper
    // const regexpSKT = /skt|SKT|sktelecom|스크트|10sk|슼|sk텔레콤|sk텔레콤/ig;
    // clienScraperNEW.scrapStart('skt', regexpSKT, 1, 50, (result) => {
    //   ScrapJPG.insert(result);
    // });

  });
}
