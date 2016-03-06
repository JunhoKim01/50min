
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


    
    const fileExtOptions = [
      { type: 'jpg', collection: ScrapJPG },
      { type: 'gif', collection: ScrapGIF },
      { type: 'avi', collection: ScrapAVI },
      { type: 'txt', collection: ScrapTXT },
    ];

    if (ScrapJPG === undefined
      || ScrapGIF === undefined
      || ScrapAVI === undefined
      || ScrapAVI === undefined) {
      throw new Meteor.Error('collection load order promblem');
    }

    const clienScraper = new CS('clien', 1, fileExtOptions);
    clienScraper.scrapStart();
    


  });


}
