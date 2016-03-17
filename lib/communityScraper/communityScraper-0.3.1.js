// Dependency : cheerio, Meteor

CS = class CommunityScraperNew {
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
    if (typeof pages !== 'number' || pages > 5) {
      throw new Meteor.Error('Too much pages');
    }
    if (typeof callback !== 'function') {
      throw new Meteor.Error('INVALID callback');
    }

    // Batch options
    let batchIntervalMS;
    if (batchInterval && batchInterval > 0) {
      batchIntervalMS = batchInterval * 60 * 1000; // Milliseconds
    } else {
      throw new Meteor.Error('INVALID batchInterval');
    }
    const batchStartTime = Date.now();   // Unix Timestamp
    let batchCounter = 0;

    // Start
    console.log(`[${type}] [${this.communityName}] Scrap started at : ${Date(batchStartTime)}`);
    let result = [];
    let postIdsInsertedBefore = [];

    this.batchHandle = Meteor.setInterval(() => {
      result = this._getScrapByType(type, regexp, pages, batchCounter);

      // TODO: Keep dup check array when server restarts
      // Check duplication then insert
      result.forEach((item, index) => {
        if (postIdsInsertedBefore.indexOf(item.postId) === -1) {
          callback(item);  // Insert the itme only if the item is not saved already

          postIdsInsertedBefore.push(item.postId); // Save this post ID
        }
      });

      // Reset array if 50 items pushed
      if (postIdsInsertedBefore.length > 50) {
        postIdsInsertedBefore = [];
      }

      console.log(`[${type}] [${this.communityName}] Batch # ${batchCounter}`);

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
        return this._clienParser(type, regexp, pages, batchCount);
      case 'pgr21':
        return this._pgrParser(type, regexp, pages, batchCount);
      case 'ddanzi':
        return this._ddanziParser(type, regexp, pages, batchCount);
      case 'ruliweb':
        return this._ruliwebParser(type, regexp, pages, batchCount);
      default:
        throw new Meteor.Error('Invalid community name');
    }
  }

  // Community parser
  // Parse target & return matching items as array
  // * type : file extenstion
  // * regexp : regular expression used for capture item from title
  // # endPage : Last page of parsing batch (from 1 ~ endPage)
  //
  testParser() {
    const snapshotUrl = 'http://ruliweb.daum.net/gallery/hit/article.daum?page=1';
    const basePostUrl = 'http://bbs2.ruliweb.daum.net/gaia/do/ruliweb/default/read?articleId=29290322&bbsId=G005&itemId=143'; // 29290322
    const content = Meteor.http.get(snapshotUrl).content;
    const $ = this.cheerio.load(content);

    // Find items from snapshot
    const postElement = $('td.subject').children();


    // const url = postElement.attribs.href; // Get URL
    // const postId = url.slice(url.indexOf('srl=') + 4);
    // const title = postElement.children[0].data;  // Title
    let result = [];

    postElement.each((index, post) => {
      const title = post.children[0].data.trim();  // Title

      const url = post.attribs.href; // Get URL
      const postId = url.slice(url.indexOf('articleId=') + 10, url.indexOf('articleId=') + 18);

      result.push({ url, postId, title });
      // result.push(post);
    });

    return result;
    // return postElement;
  }


  // Parsers 

  _clienParser(type, regexp, endPage, batchCount) {
    // Result array
    let result = [];

    const basePostUrl = 'http://www.clien.net/cs2/bbs/board.php?bo_table=park&wr_id=';

    // Extract matching posts from each pages
    for (let page = 1; page <= endPage; page++) {
      // Make snapshot of current page
      const snapshotUrl = `http://clien.net/cs2/bbs/board.php?bo_table=park&page=${page}`;
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
            const itemId = `clien.${postId}`;
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

  _ddanziParser(type, regexp, endPage, batchCount) {
    // Result array
    let result = [];

    const basePostUrl = 'http://www.ddanzi.com/index.php?mid=free&page=1&document_srl=';
    // Extract matching posts from each pages
    for (let page = 1; page <= endPage; page++) {
      // Make snapshot of current page
      const snapshotUrl = `http://www.ddanzi.com/index.php?mid=free&page=${page}`;
      const content = Meteor.http.get(snapshotUrl).content;
      const $ = this.cheerio.load(content);
      // Get the list of post items
      const postElement = $('td.title').children();

      // Iterate over each post items
      postElement.each((index, post) => {
        if (post === undefined) {
          throw new Meteor.Error('Cannot find post');
        }

        const title = post.children[0].data.trim();  // Title

        // Check if title contains target
        if (this._isTitleConatins(title, type, regexp)) {
          const url = post.attribs.href; // Get URL
          const postId = url.slice(url.indexOf('srl=') + 4);
          const postUrl = basePostUrl + postId;
          const itemId = `ddanzi.${postId}`;
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
      });
    }

    // Return result array
    return result;
  }


  _ruliwebParser(type, regexp, endPage, batchCount) {
    // Result array
    let result = [];
    
    const basePostUrl = 'http://bbs2.ruliweb.daum.net/gaia/do/ruliweb/default/read?articleId=postId&bbsId=G005&itemId=143'; // 29290322

    for (let page = 1; page <= endPage; page++) {
      // Make snapshot of current page
      const snapshotUrl = `http://ruliweb.daum.net/gallery/hit/article.daum?page=${page}`;
      
      const content = Meteor.http.get(snapshotUrl).content;
      const $ = this.cheerio.load(content);
      // Get the list of post items
      const postElement = $('td.subject').children();

      // Iterate over each post items
      postElement.each((index, post) => {
        if (post === undefined) {
          throw new Meteor.Error('Cannot find post');
        }

        const title = post.children[0].data.trim();  // Title

        // Check if title contains target
        if (this._isTitleConatins(title, type, regexp)) {
          const url = post.attribs.href; // Get URL
          const postId = url.slice(url.indexOf('articleId=') + 10, url.indexOf('articleId=') + 18);
          
          const postUrl = basePostUrl.replace(/postId/, postId);

          const itemId = `ruliweb.${postId}`;
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
      });
    }

    // Return result array
    return result;
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
        return /[^\s]+\s?\.(?:avi|swf|ytb|youtube|mov|tube)/ig;
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
