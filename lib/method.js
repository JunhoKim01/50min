Meteor.methods({
    
    remove() {
      ScrapJPG.remove({});
      ScrapGIF.remove({});
      ScrapAVI.remove({});
      ScrapTXT.remove({});

    },
  });