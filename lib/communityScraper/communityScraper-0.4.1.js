// Dependency : cheerio, Meteor
CS = class CommunityScraperNew {
  constructor() {
    // HTTP parser
    this.cheerio = Meteor.npmRequire('cheerio');
    this.options = {};
    this.status = {}; // Save each community scraper live/stop
  }



  // Public methods
  scrapStart(communityName, options, callback) {
    // Check options is valid
    // and get default Options if options is an empty obejct
    if (this._checkOptValid(options) === -1) {
      options = this._getDefaultOptions(communityName);
    }

    // Set batch interval
    let batchIntervalMS;
    const batchInterval = options.intervalMin;
    if (batchInterval && batchInterval > 0) {
      batchIntervalMS = batchInterval * 60 * 1000; // Milliseconds
    } else {
      throw new Meteor.Error('INVALID batchInterval');
    }
    // Save settings
    this.options[communityName] = options;

    // Logging : Scrap start
    const batchStartTime = Date.now();   // Current Unix Timestamp
    let batchCounter = 0;
    options.types.forEach(type => {
      console.log(`[${type}] [${options.communityName}] Scrap started at : ${Date(batchStartTime)}`);
    });
    // Set scraper status to live(true)
    this._setScraperHealth(options.communityName, true);

    // Scrap start
    // Array declaration
    let result = [];                 // Result array
    let resultWithoutDup = [];       // Result array without Dup
    let postIdsInsertedBefore = [];  // Array for insertied items

    // Set interval of batch
    this.batchHandle = Meteor.setInterval(() => {
      // Reset result array
      result = [];
      resultWithoutDup = [];
      // Reset dup checking array if 50 items pushed
      if (postIdsInsertedBefore.length > 100) {
        postIdsInsertedBefore = [];
      }

      // Get just scrapped result array that contains array of scrapped items
      // 
      result = this._getScrap(this.options[communityName], batchCounter);

      // console.log(result);

      // TODO: Keep dup check array when server restarts
      // Check duplication then insert
      // by selecting itmes not inserted before
      for (let i = 0; i < result.length; i++) {
        if (postIdsInsertedBefore.indexOf(result[i].itemId) === -1) {
          // Insert the itme only if the item is not saved already
          resultWithoutDup.push(result[i]);
          postIdsInsertedBefore.push(result[i].itemId); // Save this post ID
        }

        if (i === result.length - 1) {
          callback(this.options[communityName], resultWithoutDup);
          break;
        }
      }

      // Logging : Batch done
      options.types.forEach(type => {
        console.log(`[${type}] [${options.communityName}] Batch # ${batchCounter}`);
      });
      
      batchCounter += 1;
    }, batchIntervalMS);
  }

  // Stop scrap
  stopScrap(options) {
    this.batchSoptTime = undefined; // remove starting time
    this._setScraperHealth(options.communityName, false); // Set scraper status dead
    return Meteor.clearInterval(this.batchHandle);
  }
  // Change scrap options for selected community
  changeScrapOptions(communityName, options) {
    if (typeof communityName !== 'string') {
      throw new Meteor.Error('INVALID communityName type');
    }
    // Validate options
    this._checkOptValid(options);
    // Change options
    this.options[communityName] = options;
    console.log('current opt : ');
    console.log(this.options[communityName]);

    return true;
  }

  // Private methods
  // Get scrap for every types
  _getScrap(options, batchCount) {
    // Return result array from community specific parser
    switch (options.communityName) {
      case 'clien':
        return this._clienParser(options.types, options.regexps, options.lastPage, batchCount);
      case 'pgr21':
        return this._pgrParser(options.types, options.regexps, options.lastPage, batchCount);
      case 'ddanzi':
        return this._ddanziParser(options.types, options.regexps, options.lastPage, batchCount);
      case 'ruliweb':
        return this._ruliwebParser(options.types, options.regexps, options.lastPage, batchCount);
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
  _clienParser(types, regexps, lastPage, batchCount) {
    // Result array
    let result = [];

    // Parsing target url
    const basePostUrl = 'http://www.clien.net/cs2/bbs/board.php?bo_table=park&wr_id=';

    // Extract matching posts from each pages
    for (let page = 1; page <= lastPage; page++) {
      // Make a snapshot for current page
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
          // Get title
          const title = post.children[0].data;

          // Get matched types
          const matched = this._getMatched(title, types, regexps);
          // console.log(`[${index}] ${matched}`);
          matched.forEach((type) => {
            const url = post.attribs.href;
            const postId = url.slice(url.indexOf('id=') + 3, url.indexOf('&page')); // Get post Id
            const postUrl = basePostUrl + postId;
            const itemId = `clien.${postId}`;
            // Save matched item to result array
            const item = {
              createdAt: Date.now(),
              communityName: 'clien',    // Community name
              batchCount,
              itemId,
              type,                      // Matched type
              title,
              postUrl,
              size: null,                // Size
              point: 0,                  // Point
            };
            result.push(item);
          });
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
            'ddanzi',
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
          const item = {
            createdAt: Date.now(),
            communityName: 'ruliweb',       // Community name
            batchCount,
            itemId,
            type,
            title,
            postUrl,
            size: null,
            point: 0,
          };

          result.push(item);
        }
      });
    }

    // Return result array
    return result;
  }

  // Utilities
  // Return default scrap option for selected community
  _getDefaultOptions(communityName) {
    if (typeof communityName !== 'string') {
      throw new Meteor.Error('INVALID communityName');
    }
    const option = {
      communityName,
      types: ['jpg', 'gif', 'avi'],
      regexps: ['default', 'default', 'default'],
      intervalMin: 1,
      lastPage: 1,
    };
    return option;
  }

  // get defulat regular expression (jpg, gif, avi, txt)
  _getDefaultRegexp(type) {
    switch (type.toUpperCase()) {
      case 'JPG':
        return /[^\s]+\s?\.\s?(?:jpg|jpeg|jyp|jy9|jpgee)/ig;
      case 'GIF':
        return /[^\s]+\s?\.\s?(?:gif|jpgif)/ig;
      case 'AVI':
        return /[^\s]+\s?\.\s?(?:avi|swf|ytb|youtube|mov|tube)/ig;
      case 'TXT':
        return /[^\s]+\s?\.\s?(?:txt|text)/ig;
      default:
        return null;
    }
  }

  // Return matched types in array if title contains type
  _getMatched(title, types, regexps) {
    let result = [];
    types.forEach((type, index) => {
      // Set regular expression
      let regexp;
      if (regexps[index] === 'default') {
        regexp = this._getDefaultRegexp(type);
      } else {
        if (! (regexps[index] instanceof RegExp)) {
          throw new Meteor.Error('INVALID regular expression');
        }
        regexp = regexps[index];
      }

      // Test title
      if (regexp.test(title)) {
        result.push(type);
      }
    });
    return result;
  }

  // Make a post item and retun it
  _makeItem(communityName, batchCount, itemId, type, title, url, size, point) {
    const item = {
      createdAt: Date.now(),
      communityName,                          // Community name of this item
      batchCount,
      itemId,                                 // Unique id of this item : 'communityName+postId'
      type,
      title,                                  // Title of this item
      url,                                    // URL of this item
      size,                                   // Size of media this item contians as kilo bytes
      point,                                  // Some calculatd point
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

  _setScraperHealth(communityName, status) {
    if (typeof status !== 'boolean') {
      throw new Meteor.Error('INVALID Scraper status');
    }
    this.status.communityName = status;
  }

  _checkOptValid(options) {
    // Check if options object have must-have options
    // {
    //   communityName,
    //   types: ['jpg', 'gif', 'avi'],
    //   regexps: ['default', 'default', 'default'],
    //   intervalMin: 5,
    //   lastPage: 1,
    // };
    if (options === undefined) {
      throw new Meteor.Error('INVALID options: options is undefined');
    }
    if (typeof options !== 'object') {
      throw new Meteor.Error('INVALID options: options is not anobject');
    }
    if (options === null) { // Using default options
      return -1;
    }
    if (typeof options.communityName !== 'string') {
      throw new Meteor.Error('INVALID options: \'communityName\' is not string');
    }
    if (! Array.isArray(options.types)) {
      throw new Meteor.Error('INVALID options: \'types\' is not array');
    }
    if (options.types.length === 0) {
      throw new Meteor.Error('INVALID options: \'types\' is an empty array');
    }
    if (! Array.isArray(options.regexps)) {
      throw new Meteor.Error('INVALID options: \'regexps\' is not array');
    }
    if (options.regexps.length === 0) {
      throw new Meteor.Error('INVALID options: \'regexps\' is an empty array');
    }
    if (typeof options.intervalMin !== 'number') {
      throw new Meteor.Error('INVALID options: \'intervalMin\' is not a number');
    }
    if (options.intervalMin <= 0) {
      throw new Meteor.Error('INVALID options: \'intervalMin\' must be greater than 0');
    }
    if (typeof options.lastPage !== 'number') {
      throw new Meteor.Error('INVALID options: \'lastPage\' is not a number');
    }
    if (options.lastPage < 1) {
      throw new Meteor.Error('INVALID options: \'lastPage\' must be greater than 1');
    }

    return 1;
  }
};
