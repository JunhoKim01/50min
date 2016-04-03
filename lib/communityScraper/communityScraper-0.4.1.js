// Dependency : cheerio, Meteor
import cheerio  from 'cheerio';
import iconv from 'iconv-lite';


class CommunityScraper {
  constructor() {
    // Create vars
    this.options = {};
    this.status = {}; // Save each community scraper live/stop
    this.batchCounter = {};
    this.batchHandle = {};
    this.batchIntervalMS = {};
    this.callback = {};
    this.parser = {
      clien: () => this._clienParser(),
      ddanzi: () => this._ddanziParser(),
      ruliweb: () => this._ruliwebParser(),
      bestiz: () => this._bestizParser(),
      pgr21: () => this._pgr21Parser(),
    };
  }



  // Public methods
  scrapStart(communityName, options, callback) {
    // Check options is valid
    // and get default Options if options is an empty obejct
    if (this._checkOptValid(options) === -1) {
      options = this._getDefaultOptions(communityName);
    }

    // Set batch interval
    const batchIntervalMin = options.intervalMin;
    if (batchIntervalMin && batchIntervalMin > 0) {
      this.batchIntervalMS[communityName] = this._getMS(batchIntervalMin); // Chagne to milliseconds
    } else {
      throw new Meteor.Error('INVALID batchInterval');
    }
    

    // Logging : Scrap start
    const batchStartTime = Date.now();   // Current Unix Timestamp
    this.batchCounter[communityName] = 0;
    options.types.forEach(type => {
      console.log(`[${communityName}] [${type.toUpperCase()}] Scrap started at : ${Date(batchStartTime)}`);
    });

    // Scrap start
    // Array declaration
    this.postIdsInsertedBefore = [];  // Array for insertied items

    // Save settings
    options['startTime'] = batchStartTime;
    options['status'] = this._setScraperHealth(communityName, true);  // Set scraper status to live(true)
    this.options[communityName] = options;
    this.callback[communityName] = callback;

    // Set interval of batch
    this.batchHandle[communityName] = Meteor.setInterval(
      () => {this._batch(communityName);},
      this.batchIntervalMS[communityName]);
  }

  _batch(communityName) {
    // Reset result array
    let result = [];                // Result array
    let resultWithoutDup = [];      // Result array without Dup

    // Reset dup checking array if 50 items pushed
    // if (this.postIdsInsertedBefore.length > 100) {
    //   this.postIdsInsertedBefore = [];
    // }

    // Get just scrapped result array that contains array of scrapped items
    //
    result = this._getScrap(communityName);

    // console.log(result);

    // TODO: Keep dup check array when server restarts
    // Check duplication then insert
    // by selecting itmes not inserted before
    for (let i = 0; i < result.length; i++) {
      if (this.postIdsInsertedBefore.indexOf(result[i].itemId) === -1) {
        // Insert the itme only if the item is not saved already
        resultWithoutDup.push(result[i]);
        this.postIdsInsertedBefore.push(result[i].itemId); // Save this post ID
      }

      if (i === result.length - 1) {
        this.callback[communityName](this.options[communityName], resultWithoutDup);
        break;
      }
    }

    // Logging : Batch done
    this.options[communityName].types.forEach(type => {
      console.log(`[${communityName}] [${type.toUpperCase()}] Batch # ${this.batchCounter[communityName]}`);
    });
    
    this.batchCounter[communityName] += 1;
  }

  // Stop scrap
  stopScrap(communityName, callback) {
    if (! this.options[communityName]) {
      throw new Meteor.Error('INVALID community options');
    }
    // Clear interval
    Meteor.clearInterval(this.batchHandle[communityName]);
    // Loggin : scarp stopped
    const batchStoppedTime = Date.now();   // Current Unix Timestamp
    this.options[communityName].types.forEach(type => {
      console.log(`[${communityName}] [${type.toUpperCase()}] Scrap stopped at : ${Date(batchStoppedTime)}`);
    });

    // Set scraper status dead
    callback(this._setScraperHealth(communityName, false));
    return true;
  }
  // Change scrap options for selected community
  changeScrapOptions(communityName, options, callback) {
    if (typeof communityName !== 'string') {
      throw new Meteor.Error('INVALID communityName type');
    }
    // Stop current batch
    Meteor.clearInterval(this.batchHandle[communityName]);
    // Validate options
    this._checkOptValid(options);
    // Change options
    const batchIntervalMin = options.intervalMin;
    if (batchIntervalMin && batchIntervalMin > 0) {
      this.batchIntervalMS[communityName] = this._getMS(batchIntervalMin); // Chagne to milliseconds
    } else {
      throw new Meteor.Error('INVALID batchInterval');
    }
    options['status'] = this._setScraperHealth(communityName, true);  // Set scraper status to live(true)
    options['startTime'] = Date.now(); // Batch restart time
    this.options[communityName] = options;
    // console.log(`batchIntervalMS : ${this.batchIntervalMS[communityName]}`);
    console.log('<Options changed>');
    console.log(options);
    
    
    // Restart new batch
    this.batchHandle[communityName] = Meteor.setInterval(
      () => {this._batch(communityName);},
      this.batchIntervalMS[communityName]);
    // Set scarper status live
    callback(this.options[communityName], this._setScraperHealth(communityName, true));
    return true;
  }

  // Private methods
  // Get scrap for every types
  _getScrap(communityName) {
    // Return result array from community specific parser

    return this.parser[communityName]();
  }

  // Community parser
  // Parse target & return matching items as array
  // * type : file extenstion
  // * regexp : regular expression used for capture item from title
  // # endPage : Last page of parsing batch (from 1 ~ endPage)
  //
  testParser() {
    const snapshotUrl = 'http://pgr21.com/pb/pb.php?id=humor&page=1';
    const basePostUrl = 'http://pgr21.com/pb/pb.php?id=humor&no=postId';
    const content = Meteor.http.get(snapshotUrl).content;
    const $ = cheerio.load(content);

    // Find items from snapshot
    const postElement = $('td .tdsub').find('a');

    // const url = postElement.attribs.href; // Get URL
    // const postId = url.slice(url.indexOf('srl=') + 4);
    // const title = postElement.children[0].data;  // Title
    let result = [];


    postElement.each((index, post) => {
      const title = post.children[0].data.trim();  // Title

      // const convertedTitle = iconv.decode(new Buffer(title), 'utf8');

      const url = post.attribs.href; // Get URL
      const postId = url.slice(url.indexOf('no=') + 3);

      result.push({ title, basePostUrl: basePostUrl.replace(/postId/, postId) });
      // result.push(post);
    });

    return result;
    // return postElement;
  }


  // Parsers
  _clienParser() {
    // Result array
    let result = [];
    const communityName = 'clien';
    const parserOptions = this.options[communityName];

    // Parsing target url
    const basePostUrl = 'http://www.clien.net/cs2/bbs/board.php?bo_table=park&wr_id=';

    // Extract matching posts from each pages
    for (let page = 1; page <= parserOptions.lastPage; page++) {
      // Make a snapshot for current page
      const snapshotUrl = `http://clien.net/cs2/bbs/board.php?bo_table=park&page=${page}`;
      const content = Meteor.http.get(snapshotUrl).content;
      const $ = cheerio.load(content);

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
          const matched = this._getMatched(title, parserOptions.types, parserOptions.regexps);
          // console.log(`[${index}] ${matched}`);
          matched.forEach((type) => {
            const url = post.attribs.href;
            const postId = url.slice(url.indexOf('id=') + 3, url.indexOf('&page')); // Get post Id
            const postUrl = basePostUrl + postId;
            const itemId = `clien.${postId}`;
            // Save matched item to result array
            const item = {
              createdAt: Date.now(),
              communityName,
              batchCount: this.batchCounter[communityName],
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

  _ddanziParser() {
    // Result array
    let result = [];
    const communityName = 'ddanzi';
    const parserOptions = this.options[communityName];
    
    // Parsing target url
    const basePostUrl = 'http://www.ddanzi.com/index.php?mid=free&page=1&document_srl=';
    
    // Extract matching posts from each pages
    for (let page = 1; page <= parserOptions.lastPage; page++) {
      // Make snapshot of current page
      const snapshotUrl = `http://www.ddanzi.com/index.php?mid=free&page=${page}`;
      const content = Meteor.http.get(snapshotUrl).content;
      const $ = cheerio.load(content);

      // Find items from snapshot
      const postElement = $('td.title').children();

      // Iterate over each post items
      postElement.each((index, post) => {
        if (post === undefined) {
          throw new Meteor.Error('Cannot find post');
        }
        // Get title
        const title = post.children[0].data.trim();
        // Get matched types
        const matched = this._getMatched(title, parserOptions.types, parserOptions.regexps);

        // Check if title contains target
        matched.forEach((type) => {
          const url = post.attribs.href; // Get URL
          const postId = url.slice(url.indexOf('srl=') + 4);
          const postUrl = basePostUrl + postId;
          const itemId = `ddanzi.${postId}`;
          // Save matching item to result array
          const item = {
            createdAt: Date.now(),
            communityName,
            batchCount: this.batchCounter[communityName],
            itemId,
            type,                      // Matched type
            title,
            postUrl,
            size: null,                // Size
            point: 0,                  // Point
          };
          result.push(item);
        });
      });
    }
    // Return result array
    return result;
  }

  // ruliweb
  _ruliwebParser() {
    // Result array
    let result = [];
    const communityName = 'ruliweb';
    const parserOptions = this.options[communityName];
    
    const basePostUrl = 'http://bbs2.ruliweb.daum.net/gaia/do/ruliweb/default/read?articleId=postId&bbsId=G005&itemId=143'; // 29290322

    for (let page = 1; page <= parserOptions.lastPage; page++) {
      // Make snapshot of current page
      const snapshotUrl = `http://ruliweb.daum.net/gallery/hit/article.daum?page=${page}`;
      const content = Meteor.http.get(snapshotUrl).content;
      const $ = cheerio.load(content);
      // Get the list of post items
      const postElement = $('td.subject').children();
      // Iterate over each post items
      postElement.each((index, post) => {
        if (post === undefined) {
          throw new Meteor.Error('Cannot find post');
        }

        const title = post.children[0].data.trim();  // Title

        // Check if title contains target
        const matched = this._getMatched(title, parserOptions.types, parserOptions.regexps);
        matched.forEach((type) => {
          const url = post.attribs.href; // Get URL
          const postId = url.slice(url.indexOf('articleId=') + 10, url.indexOf('articleId=') + 18);
          const postUrl = basePostUrl.replace(/postId/, postId);
          const itemId = `ruliweb.${postId}`;
          // Save matching item to result array
          const item = {
            createdAt: Date.now(),
            communityName,
            batchCount: this.batchCounter[communityName],
            itemId,
            type,
            title,
            postUrl,
            size: null,
            point: 0,
          };
          result.push(item);
        });
      });
    }

    // Return result array
    return result;
  }

  // bestiz
  _bestizParser() {
    // Result array
    let result = [];
    const communityName = 'bestiz';
    const parserOptions = this.options[communityName];
    
    const basePostUrl = 'http://hgc.bestiz.net/zboard/view.php?id=ghm2b&page=1&no=postId';

    for (let page = 1; page <= parserOptions.lastPage; page++) {
      // Make snapshot of current page
      const snapshotUrl = `http://hgc.bestiz.net/zboard/zboard.php?id=ghm2b&page=${page}`;
      const content = Meteor.http.get(snapshotUrl,
       { npmRequestOptions : { encoding: 'binary' } }).content;
      const $ = cheerio.load(content);
      // Get the list of post items
      const postElement = $('td[style="word-break:break-all;"]').find('a');
      // Iterate over each post items
      postElement.each((index, post) => {
        if (post === undefined) {
          throw new Meteor.Error('Cannot find post');
        }

        const title = post.children[0].data.trim();  // Title

        // Check if title contains target
        const matched = this._getMatched(title, parserOptions.types, parserOptions.regexps);
        matched.forEach((type) => {
          const convertedTitle = iconv.decode(new Buffer(title, 'binary'), 'euckr');
          const url = post.attribs.href; // Get URL
          const postId = url.slice(url.indexOf('no=') + 3, url.indexOf('no=') + 10);
          const postUrl = basePostUrl.replace(/postId/, postId);
          const itemId = `bestiz.${postId}`;
          // Save matching item to result array
          const item = {
            createdAt: Date.now(),
            communityName,
            batchCount: this.batchCounter[communityName],
            itemId,
            type,
            title: convertedTitle,
            postUrl,
            size: null,
            point: 0,
          };
          result.push(item);
        });
      });
    }

    // Return result array
    return result;
  }

  // pgr21
  _pgr21Parser() {
    // Result array
    let result = [];
    const communityName = 'pgr21';
    const parserOptions = this.options[communityName];
    
    const basePostUrl = 'http://pgr21.com/pb/pb.php?id=humor&no=postId';

    for (let page = 1; page <= parserOptions.lastPage; page++) {
      // Make snapshot of current page
      const snapshotUrl = `http://pgr21.com/pb/pb.php?id=humor&page=${page}`;
      const content = Meteor.http.get(snapshotUrl).content;
      const $ = cheerio.load(content);
      // Get the list of post items
      const postElement = $('td .tdsub').find('a');

      // Iterate over each post items
      postElement.each((index, post) => {
        if (post === undefined) {
          throw new Meteor.Error('Cannot find post');
        }

        const title = post.children[0].data.trim();  // Title
        // Check if title contains target
        const matched = this._getMatched(title, parserOptions.types, parserOptions.regexps);
        matched.forEach((type) => {
          const url = post.attribs.href; // Get URL
          const postId = url.slice(url.indexOf('no=') + 3);
          const postUrl = basePostUrl.replace(/postId/, postId);
          const itemId = `pgr21.${postId}`;
          // Save matching item to result array
          const item = {
            createdAt: Date.now(),
            communityName,
            batchCount: this.batchCounter[communityName],
            itemId,
            type,
            title,
            postUrl,
            size: null,
            point: 0,
          };
          result.push(item);
        });
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

  _setScraperHealth(communityName, status) {
    if (typeof status !== 'boolean') {
      throw new Meteor.Error('INVALID Scraper status');
    }
    this.status[communityName] = status;
    return status;
  }

  _getMS(minute) {
    if (typeof minute !== 'number' || minute === NaN) {
     throw new Meteor.Error(`INVALID number : ${minute}`);
    }
    return (minute * 60 * 1000);
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
}

export { CommunityScraper as default };

