CSNEW = class CommunityScraperNew {
  constructor(communityName) {
    // Common settings
    // Community names
    if (communityName) {
      this.communityName = communityName;
    } else {
      throw Meteor.Error('INVALID communityName');
    }

    // HTTP DOM finder
    this.cheerio = Meteor.npmRequire('cheerio');

    

    // // File extentions types & regexp & colletions
    // this.extOptions = [];
    // for (let i = 0; i < options.length; i++) {
    //   this.extOptions.push(options[i]);
    //   // Get default regular expressions
    //   if (this.extOptions[i].regexp === 'default') {
    //     this.extOptions[i].regexp = _getDefaultRegexp(this.extOptions[i].type);
    //   }
    // }
  }

  // Public methods
  scrapStart(type, regexp, pages, batchInterval, callback) {
    // Input validation
    if (typeof type !== 'string') {
      throw new Meteor.Error('INVALID type');  
    }
    if (typeof pages !== 'number' || pages > 5 ) {
      throw new Meteor.Error('Too much pages');  
    }
    if (typeof callback !== 'function') {
      throw new Meteor.Error('INVALID callback');  
    }

    // Batch options
    let batchIntervalMS;
    if (batchInterval && batchInterval > 0) {
      batchIntervalMS = batchInterval * 15 * 1000; // Milliseconds
    } else {
      throw new Meteor.Error('INVALID batchInterval');
    }
    const batchStartTime = Date.now();   // Unix Timestamp
    let batchCounter = 0;

    // Start
    console.log('[' + type + '] Scrap started at ' + Date(batchStartTime));
    let result = [];
    let postIdsInsertedBefore = [];

    this.batchHandle = Meteor.setInterval(() => {
      result = this._getScrapByType(type, regexp, pages, batchCounter);

      // Check duplication then insert
      result.forEach((item, index, array) => {
        if (postIdsInsertedBefore.indexOf(item.postId) === -1) {
          callback(item);  // Insert the itme only if the item is not saved already

          postIdsInsertedBefore.push(item.postId); // Save this post ID
        }
      });

      // Reset array if 50 items pushed
      if (postIdsInsertedBefore.length > 50) {
        postIdsInsertedBefore = [];
      }
      
      console.log('[' + type + '] Batch # ' + batchCounter);
      // console.log('[${type}] Batch # ${batchCounter}');
      batchCounter += 1;
    }, batchIntervalMS);
  }

  // Stop scrap
  scrapStop() {
    this.batchSoptTime = undefined; // remove starting time
    return Meteor.clearInterval(this.batchHandle);
  }


  // Private methods
  // Get scrap result by type
  _getScrapByType(type, regexp, pages, batchCount) {
    // Return result array from community specific parser
    switch (this.communityName) {
      case 'clien':
        const item = {

        };
        return this._clienParser(type, regexp, pages, batchCount);
      case 'pgr21':
        return this._pgrParser(type, regexp, pages, batchCount);
      default:
        throw new Meteor.Error('Invalid community name');
    }
  }

  // Community parser
  // Parse target & return matching items as array
  _clienParser(type, regexp, endPage, batchCount) {
    // Result array
    let result = [];

    // Extract matching posts from each pages
    for (let page = 1; page <= endPage; page++) {
      // Make snapshot of current page
      const snapshotUrl = 'http://clien.net/cs2/bbs/board.php?bo_table=park&page=' + page;
      const basePostUrl = 'http://www.clien.net/cs2/bbs/board.php?bo_table=park&wr_id=';
      const content = Meteor.http.get(snapshotUrl).content;
      const $ = this.cheerio.load(content);

      // Find items from snapshot
      const postElement = $('.post_subject').children(); // Get post element
      postElement.each((index, post) => {
        if (post === undefined) {
          throw new Meteor.Error('Cannot find post');
        }

        // Test only inside fo <a></a> tag
        if (post.name === 'a') {
          const title = post.children[0].data;

          // Check if title contains target
          if (this._isTitleConatins(title, type, regexp)) {
            const url = post.attribs.href;
            const postId = url.slice(url.indexOf('id=') + 3, url.indexOf('&page')); // Get post Id
            const postUrl = basePostUrl + postId;
            const itemId = 'clien.' + postId;
            // Save matching item to result array
            const item = this._makeItem(
              this.communityName,
               batchCount,
               itemId,
               type,
               title,
               postUrl,
               null,
               0);
            result.push(item);
          }
        }
      });
    }

    // Return result array
    return result;
  }

  _pgrParser(type, regexp, endPage, batchCount) {

  }

  // Utilities
  // get defulat regular expression (jpg, gif, avi, txt)
  _getDefaultRegexp(type) {
    switch (type.toUpperCase()) {
      case 'JPG':
        return /[^\s]+\s?\.(?:jpg|jpeg|jyp|jy9|jpgee)/ig;
      case 'GIF':
        return /[^\s]+\s?\.(?:gif|jpgif)/ig;
      case 'AVI':
        return /[^\s]+\s?\.(?:avi|swf|ytb|youtube|mov)/ig;
      case 'TXT':
        return /[^\s]+\s?\.(?:txt|text)/ig;
      default:
        return null;
    }
  }

  // Return true if title contains such file ext type
  _isTitleConatins(title, type, regexp) {
    if (regexp === 'default') {
      // Use defaultregexp
      const regexpDefault = this._getDefaultRegexp(type);
      return regexpDefault.test(title);
    }

    // Use custpm regexp
    if (! (regexp instanceof RegExp)) {
      throw new Meteor.Error('INVALID regular expression');
    }
    return regexp.test(title);
  }

  // Make a post item and retun it
  _makeItem(communityName, batchCount, postId, type, title, url, size, point) {
    const item = {
      createdAt: Date.now(),
      communityName,                          // Community name of this post
      batchCount, 
      postId,                                 // Unique id of this post : 'communityName+postId'
      type, 
      title,                                  // Title of this post
      url,                                    // URL of this post
      size: 202,                              // Size of media this post contians as kilo bytes
      point: 1,                               // Some calculatd point
    };
    return item;
  }

  _makeDoc(itemArray) {
    const doc = {
      createdAt: Date.now(),
      batchCount: this.batchCount,
      posts: itemArray,
    };
    return doc;
  }



};
