if (Meteor.isServer) {
  Meteor.startup(() => {
    // code to run on server at startup
    // cheerio = Meteor.npmRequire('cheerio');

    
    // Publishing
    Meteor.publish('scrapJPG', loaded => ScrapJPG.find({}, { sort: { createdAt: -1 }, limit: loaded }));
    Meteor.publish('scrapGIF', loaded => ScrapGIF.find({}, { sort: { createdAt: -1 }, limit: loaded }));
    Meteor.publish('scrapAVI', loaded => ScrapAVI.find({}, { sort: { createdAt: -1 }, limit: loaded }));
    Meteor.publish('scrapTXT', loaded => ScrapTXT.find({}, { sort: { createdAt: -1 }, limit: loaded }));

    // Develop
    ConsoleMe.enabled = true;


    // TODO: Scrap controller

    const DEVMODE = false;

    if (DEVMODE === true) {
      // DEVO MODE
      const ruliwebScraper = new CS('ruliweb');
      Meteor.setTimeout(() => {console.log(ruliwebScraper.testParser());}, 10000);
    }

    const clienScraper = new CS('clien');
    clienScraper.scrapStart('jpg', 'default', 1, 5, (result) => {
      ScrapJPG.insert(result);
    });
    clienScraper.scrapStart('gif', 'default', 1, 10, (result) => {
      ScrapGIF.insert(result);
    });
    clienScraper.scrapStart('avi', 'default', 1, 10, (result) => {
      ScrapAVI.insert(result);
    });

    const ruliwebScraper = new CS('ruliweb');
    ruliwebScraper.scrapStart('jpg', 'default', 1, 5, (result) => {
      ScrapJPG.insert(result);
    });
    ruliwebScraper.scrapStart('gif', 'default', 1, 10, (result) => {
      ScrapGIF.insert(result);
    });
    ruliwebScraper.scrapStart('avi', 'default', 1, 10, (result) => {
      ScrapAVI.insert(result);
    });


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
