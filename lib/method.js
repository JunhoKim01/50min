Meteor.methods({
    
  remove() {
    ScrapJPG.remove({});
    ScrapGIF.remove({});
    ScrapAVI.remove({});
    ScrapTXT.remove({});
    Status.remove({});
  },
  updateSnapshot(options, resultArr) {
    if ((! resultArr) || (! options)) {
      throw new Meteor.Error('INVALID updateSnapshot');
    }
    if (options === null) {
      throw new Meteor.Error('INVALID options');
    }
    
    // Update DB staus for Admin
    const instanceId = `${options.communityName}.${options.type}`;  // Ex) clien.jpg
    const currentSnapshot = Status.findOne({ instanceId });

    if (currentSnapshot === undefined) {
      // Create new insert
      const currentItemCount = resultArr.length;
      const snapshot = Object.assign(options, {
        instanceId,
        totalItemCount: currentItemCount,
      });
      
      Status.insert(snapshot);
      // console.log(snapshot);
      return;
    }
    // Update total item count
    const currentBatchItemCount = resultArr.length;
    Status.update({ instanceId }, { $inc: { totalItemCount: currentBatchItemCount } });
    return;
  },

});
