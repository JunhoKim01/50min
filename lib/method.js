Meteor.methods({
    
  remove() {
    ScrapJPG.remove({});
    ScrapGIF.remove({});
    ScrapAVI.remove({});
    ScrapTXT.remove({});
    Status.remove({});
  },
  changeCommunityScrapOption(communityName, intervalMin, lastPage) {
    let options = Status.findOne({ communityName });
    options.intervalMin = intervalMin;
    options.lastPage = lastPage;

    return communityScraper.changeScrapOptions(communityName, options);
  },
  getCommunityScrapOption(communityName) {
    return (Status.findOne({ communityName }) || null);
  },
  saveItems(resultArr) {
    resultArr.forEach(item => {
      switch (item.type) {
        case 'jpg':
          ScrapJPG.insert(item);
          break;
        case 'gif':
          ScrapGIF.insert(item);
          break;
        case 'avi':
          ScrapAVI.insert(item);
          break;
        default:
          break;
      }
    });
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
    // if (resultArr.length === 0) {
    //   // if No result
    // }

    // Analyze result
    // {
    //   jpg: 3,
    //   gif: 1,
    // }
    let newTypeCount = {};
    resultArr.forEach(item => {
      // Create new key-value pair if the type not exist
      // or add 1 to type counter
      newTypeCount[item.type] = (newTypeCount[item.type] + 1 || 1);
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
      console.log('currentSnapshot UNDEF');
     // Create new snapshot
     const snapshot = Object.assign(options, {
       itemCount: newTypeCount,
       startTime: Date.now(),
     });

     
     Status.insert(snapshot);
     return;
    }
    // Add type count

    let oldTypeCount = currentSnapshot.itemCount;
    let sumTypeCount = {};

    [newTypeCount, oldTypeCount].forEach(a => {
     Object.keys(a).forEach(key => {
       sumTypeCount[key] = (sumTypeCount[key] || 0) + a[key];
     });
    });

    // for (let typeNew in itemCount) {
    //   for (let typeCurrent in currentSnapshot.itemCount) {
    //     if (typeCurrent === typeNew) {
    //       // Exists : Add count
    //       currentSnapshot.itemCount[typeCurrent] += itemCount[typeNew];
    //     } else {
    //       // Don`t Exists : Create new type count
    //       currentSnapshot.itemCount[typeNew] = itemCount[typeNew];
    //     }
    //   }
    // }

    // Update item count
    currentSnapshot.itemCount = sumTypeCount;
    currentSnapshot.lastPage = options.lastPage;
    currentSnapshot.intervalMin = options.intervalMin;
    Status.update({ communityName: options.communityName }, currentSnapshot);
    return;

  },

});
