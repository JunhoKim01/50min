
if (Meteor.isServer) {
  Meteor.startup(() => {
    // code to run on server at startup
    cheerio = Meteor.npmRequire('cheerio');

    Meteor.publish('scrapJPG', () => {
      return ScrapJPG.find();
    });
    Meteor.publish('scrapGIF', () => {
      return ScrapGIF.find();
    });
    Meteor.publish('scrapAVI', () => {
      return ScrapAVI.find();
    });
    Meteor.publish('scrapTXT', () => {
      return ScrapTXT.find();
    });

    ConsoleMe.enabled = true;
    
    // const fileExtOptions = [
    //   { type: 'jpg', collection: ScrapJPG },
    //   { type: 'gif', collection: ScrapGIF },
    //   { type: 'avi', collection: ScrapAVI },
    //   { type: 'txt', collection: ScrapTXT },
    // ];

    // if (ScrapJPG === undefined
    //   || ScrapGIF === undefined
    //   || ScrapAVI === undefined
    //   || ScrapAVI === undefined) {
    //   throw new Meteor.Error('collection load order promblem');
    // }

    // const clienScraper = new CS('clien', 1, fileExtOptions);
    // clienScraper.scrapStart();





    const clienScraperNEW = new CSNEW('clien');
    clienScraperNEW.scrapStart('jpg', 'default', 1, 1, (result) => {
      ScrapJPG.insert(result);
    });
    clienScraperNEW.scrapStart('gif', 'default', 1, 1, (result) => {
      ScrapGIF.insert(result);
    });
    clienScraperNEW.scrapStart('avi', 'default', 1, 1, (result) => {
      ScrapAVI.insert(result);
    });
    // const regexpSKT = /skt|SKT|sktelecom|스크트|10sk|슼|sk텔레콤|sk텔레콤/ig;
    // clienScraperNEW.scrapStart('skt', regexpSKT, 1, 50, (result) => {
    //   ScrapJPG.insert(result);
    // });


    


  });


}
