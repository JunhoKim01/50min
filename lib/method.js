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
    if (! Array.isArray(resultArr)) {
      throw new Meteor.Error('INVALID resultArr');
    }
    if (resultArr.length === 0) {
      // if No result
      return;
    }

    // Analyze result
    // {
    //   jpg: 3,
    //   gif: 1,
    // }
    let itemCount = {};
    resultArr.forEach(item => {
      if (item.type in itemCount) {
        // Create new key-value pair if the type not exist
        itemCount[item.type] = 1;
      } else {
        // Add 1 to type counter
        itemCount[item.type] += 1;
      }
    });


    // options.clien = {
    //   communityName: 'clien',
    //   types: ['jpg', 'gif', 'avi'],
    //   regexps: ['default', 'default', 'default'],
    //   intervalMin: 1,
    //   lastPage: 1,
    // };


    // Update DB staus for Admin
    // const instanceId = `${options.communityName}.${options.type}`;  // Ex) clien.jpg
    let currentSnapshot = Status.findOne({ communityName: options.communityName });
    if (currentSnapshot === undefined) {
      // Create new snapshot
      const currentItemCount = resultArr.length;
      const snapshot = Object.assign(options, {
        itemCount,
        startTime: Date.now(),
        currentTime: Date.now(),
      });
      
      Status.insert(snapshot);
      return;
    }
    // Update counter
    for (let typeNew in itemCount) {
      for (let typeCurrent in currentSnapshot.itemCount) {
        if (typeCurrent === typeNew) {
          // Exists : Add count
          currentSnapshot.itemCount[typeCurrent] += itemCount[typeNew];
        } else {
          // Don`t Exists : Create new type count
          currentSnapshot.itemCount[typeNew] = itemCount[typeNew];
        }
      }
    }

    // Update item count
    Status.update({ communityName: options.communityName },
     { itemCount: currentSnapshot.itemCount });
    return;
  },

});
