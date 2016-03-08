if (Meteor.isServer) {
  Meteor.startup(() => {
    // code to run on server at startup
    cheerio = Meteor.npmRequire('cheerio');
    
    // Publishing
    Meteor.publish('scrapJPG', loaded => ScrapJPG.find({}, { sort: { createdAt: -1 }, limit: loaded }));
    Meteor.publish('scrapGIF', loaded => ScrapGIF.find({}, { sort: { createdAt: -1 }, limit: loaded }));
    Meteor.publish('scrapAVI', loaded => ScrapAVI.find({}, { sort: { createdAt: -1 }, limit: loaded }));
    Meteor.publish('scrapTXT', loaded => ScrapTXT.find({}, { sort: { createdAt: -1 }, limit: loaded }));

    // Develop
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


    // Clien
    const clienScraper = new CS('clien');
    clienScraper.scrapStart('jpg', 'default', 1, 5, (result) => {
      ScrapJPG.insert(result);
    });
    clienScraper.scrapStart('gif', 'default', 3, 10, (result) => {
      ScrapGIF.insert(result);
    });
    clienScraper.scrapStart('avi', 'default', 3, 10, (result) => {
      ScrapAVI.insert(result);
    });


    // const regexpSKT = /skt|SKT|sktelecom|스크트|10sk|슼|sk텔레콤|sk텔레콤/ig;
    // clienScraperNEW.scrapStart('skt', regexpSKT, 1, 50, (result) => {
    //   ScrapJPG.insert(result);
    // });


    


  });


}
