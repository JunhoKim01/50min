// Dependency : cheerio, Meteor

class CommunityScraper {
  constructor(communityName, batchInterval, fileExtOptions) {
    // Initialize parser
    this.cheerio = Meteor.npmRequire('cheerio');

    // Inpu validation
    if (communityName === undefined || communityName === '') {
      // Invalid communityName
      // TODO: Error handlig
      throw new Meteor.Error('Invalid community name');
    } else if (batchInterval === undefined || typeof batchInterval !== 'number') {
      // Invalid batch interval
      // TODO: Error handlig
      throw new Meteor.Error('Invalid batch interval');
    } else if (fileExtOptions.length <= 0) {
      // Invalid fileExtOptions
      // TODO: Error handlig
      throw new Meteor.Error('Invalid file extenstion options');
    } else {
      // Init local variables
      this.communityName = communityName;
      // Time & ticks
      this.batchStartTime = undefined;
      this.tick = 0; // Today`s number of batch which is reseted every day
    }

    // Set URLs
    switch (this.communityName) {
      case 'clien':
        // Here goes clien
        this.targetUrl = 'http://www.clien.net/cs2/bbs/board.php?bo_table=park';
        this.postUrl = 'http://www.clien.net/cs2/bbs/board.php?bo_table=park&wr_id=';
        break;
      default:
        // Invalid communityName
        // TODO: Error handlig
        throw new Meteor.Error('Invalid community name');
    }

    // Set targeted file extensions & DB
    // Currently supported extenstions : jpg, gif
    this.resultDB = [];
    this.fileExtTypes = fileExtOptions.map((option) => {
      switch (option.type.toLowerCase()) {
        case 'jpg':
          // Push collection of the file extentions
          this.resultDB.push(option.collection);
          return 'jpg';
        case 'gif':
          this.resultDB.push(option.collection);
          return 'gif';
        case 'avi':
            this.resultDB.push(option.collection);
            return 'avi';
        case 'txt':
            this.resultDB.push(option.collection);
            return 'txt';
        default:
          // TODO: Error handling
          // Invalid file extenstion
          throw new Meteor.Error('Invalid file extenstion');
      }
    });

    if (this.resultDB.length === 0) {
      throw new Meteor.Error('Invalid resultDB');
    } else if (this.fileExtTypes.length === 0) {
      throw new Meteor.Error('Invalid fileExtTypes');
    }

    // Regular expression for each file extenstions
    // this.regexpJpg = /[ㄱ-ㅎ가-힣a-z]+\s?\.(jpg|jpeg|jyp|jy9)/ig;
    this.regexpJpg = /[^\s]+\s?\.(?:jpg|jpeg|jyp|jy9|jpgee)/ig;
    this.regexpGif = /[^\s]+\s?\.(?:gif|jpgif)/ig;
    this.regexpAvi = /[^\s]+\s?\.(?:avi|swf|ytb|youtube|mov)/ig;
    this.regexpTxt = /[^\s]+\s?\.(?:txt|text)/ig;

    // snapshot array
    this.resultJPG = [];
    this.resultGIF = [];

    // Set scrap batch interval
    this.batchInterval = batchInterval * 60 * 1000; // Minute to milliseconds
  }

  // Scrap all file extenstion & save snapshot
  _scrapAll() {
    // Show current tick
    console.log('Current batch(tick) #' + this.tick);
    // Get result by each file extention type
    let resultByType = [];
    for (let i = 0; i < this.fileExtTypes.length; i++) {
      const type = this.fileExtTypes[i];
      resultByType[this._getTypeId(type)] = this._getScrapResultByType(type);
    }
    this._tickPlus();
    this._saveSnapshots(resultByType);

    return null;
  }

  // Insert each type result to matching DB
  // Server function
  _saveSnapshotByType(resultByType, type) {
    const snapshot = {
      date: Date.now(),
      tick: this.tick,
      list: resultByType[this._getTypeId(type)],
    };
    const index = this._getTypeId(type);
    if (index < 0) {
      throw new Meteor.Error('Invalid index');
    }

    this.resultDB[index].insert(snapshot);
  }
  // Insert all type result to matching DB
  _saveSnapshots(resultByType) {
    for (let i = 0; i < this.fileExtTypes.length; i++) {
      this._saveSnapshotByType(resultByType, this.fileExtTypes[i]);
    }
  }
  // Scrap selected file extenstion & return result array from selected community
  _getScrapResultByType(type) {
    // Load content
    const content = Meteor.http.get(this.targetUrl).content;
    const $ = this.cheerio.load(content);

    if (content === undefined || $ === undefined) {
      throw Error;
    }

    // Save scrap result
    let result = [];
    switch (this.communityName) {
      case 'clien':
        this._clienParser($, type, result);
        break;
      default:
        // Error
        throw new Meteor.Error('Invalid community name');
    }


    return result;
  }

  // Community parser
  _clienParser($, type, result) {
    if (Object.prototype.toString.call(result) !== '[object Array]') {
      throw new Meteor.Error('This is not an array : _clienParser');
    }

    this.postElement = $('.post_subject').children(); // post element
    // console.log(this.postElement);

    this.postElement.each((index, post) => {
      if (post === undefined) {
        throw new Meteor.Error('Cannot find post');
      }

      if (post.name === 'a') {
        const title = post.children[0].data;
        const url = post.attribs.href;
        const postId = url.slice(url.indexOf('id=') - url.length + 3); // Extract post ID

        // Extract matching posts
        this._extractMatchingPost(type, title, this.postUrl, postId, result);
      }
    });
  }

  // Find matching item & save them to result array
  _extractMatchingPost(type, title, postUrl, postId, result) {
    if (Object.prototype.toString.call(result) !== '[object Array]' ) {
      throw new Meteor.Error('This is not an array : _extractMatchingPost');
    }

    const url = postUrl + postId;
    const regexp = this._getTypeRegexp(type);

    if (regexp === null) {
      throw new Meteor.Error('Cannot get regexp');
    }

    if (regexp.test(title)) {
      this._pushItem(title, postId, url, null, result); // title, url, size result array
    }
  }
  // Push each post item into result array
  _pushItem(title, postId, url, size, result) {
    const item = {
      communityName: this.communityName,
      title,
      postId,
      url,
      size,
    };
    // Save result
    if (Object.prototype.toString.call(result) === '[object Array]' ) {
      result.push(item);
    } else {
     throw new Meteor.Error('This is not an array : _pushItem'); 
    }
  }

  // Time methods
  // Start scraper
  scrapStart() {
    this.batchStartTime = Date.now(); // set starting time as Unix Timestamp
    this.batchHandle = Meteor.setInterval(() => {this._scrapAll();}, this.batchInterval);
    console.log('Scrap started at ' + Date(this.batchStartTime));
    return this.batchHandle;
  }
  // Stop scraper
  scrapStop() {
    this.batchStartTime = undefined; // remove starting time
    return Meteor.clearInterval(this.batchHandle);
  }


  // Get current tick
  getCurrentTick() {
    return this.tick;
  }
  // Reset tick
  _resetCurrentTick() {
    this.tick = 0;
  }
  // Plus 1 to tick
  _tickPlus() {
    this.tick += 1;
  }

  // Return scrap results of selected file extenston
  // Parameter : file extenstion
  // Return : array of selected file extension
  getSnapshotByType(type) {
    let result;

    if (this.fileExtTypes.indexOf(type) !== -1) {
      result.push(this.resultDB[this._getTypeId(type)].find().fetch());
    } else {
      // Type missing error
      // TODO: Error handling
      throw Meteor.Error('Invalid file extenstion type');
    }

    if (result.length === 0) {
      // No matching post
      return null;
    }
    return result;
  }
  
  // Return snapshot of specific tick or time
  getSnapshotAt(t) {
    if (t < 30) {
      // t is tick
      // TODO: return specific result of tick

    } else {
      // t is Unix Timestamp
      // TODO: return specific result of time
    }
  }

  // Get remained time to the next snapshot as string (mm:ss)
  getETS() {
    if (this.batchStartTime === undefined) {
      return 'batch Stopped';
    }
    const timeGap = new Date(Date.now() - this.batchStartTime);
    return '{timeGap.getMinutes()}:{timeGap.getSeconds()}';
  }

  // Utilities
  _getTypeId(type) {
    if (type === undefined) {
      return -1;
    } else {
      return this.fileExtTypes.indexOf(type);
    }
  }

  _getTypeRegexp(type) {

    if (type === undefined) {
      return null;
    } else {
      let regexp = '';
      switch (type) {
        case 'jpg':
          regexp = this.regexpJpg;
          break;
        case 'gif':
          regexp = this.regexpGif;
          break;
        case 'avi':
          regexp = this.regexpAvi;
          break;
        case 'txt':
          regexp = this.regexpTxt;
          break;
        default:
          // TOOD: Error handling
          throw new Meteor.Error('Invalid file extenstion type');
      }
      return regexp;
    }
  }
};
