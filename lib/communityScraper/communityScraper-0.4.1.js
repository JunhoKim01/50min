// Dependency : cheerio, Meteor
import cheerio from 'cheerio';
import Utils from '../communityScraper/utils.js';

// Parsers
import ClienParser from '../communityScraper/clienParser.js';
import RuliwebParser from '../communityScraper/ruliwebParser.js';
import DdanziParser from '../communityScraper/ddanziParser.js';
import BestizParser from '../communityScraper/bestizParser.js';
import Pgr21Parser from '../communityScraper/pgr21Parser.js';
import MlbparkParser from '../communityScraper/mlbparkParser.js';

export default class CommunityScraper {
  constructor() {
    // Create vars
    this.options = {};
    this.status = {}; // Save each community scraper live/stop
    this.batchCounter = {};
    this.batchHandle = {};
    this.batchIntervalMS = {};
    this.callback = {};
    this.parser = {};
  }

  // Public methods
  scrapStart(communityName, options, callback) {
    // Check options is valid
    // and get default Options if options is an empty obejct
    if (Utils._checkOptValid(options) === -1) {
      options = Utils._getDefaultOptions(communityName);
    }

    this.parser[communityName] = this._parserBuilder(communityName, options);


    // Set batch interval
    const batchIntervalMin = options.intervalMin;
    if (batchIntervalMin && batchIntervalMin > 0) {
      this.batchIntervalMS[communityName] = Utils._getMS(batchIntervalMin); // Chagne to milliseconds
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
    // Get just scrapped result array that contains array of scrapped items
    let result = this.parser[communityName].getResult(); // Result array
    let resultWithoutDup = [];      // Result array without Dup

    // Reset dup checking array if 50 items pushed
    if (this.postIdsInsertedBefore.length > 200) {
      this.postIdsInsertedBefore = [];
    }

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
    Utils._checkOptValid(options);
    // Change options
    const batchIntervalMin = options.intervalMin;
    if (batchIntervalMin && batchIntervalMin > 0) {
      this.batchIntervalMS[communityName] = Utils._getMS(batchIntervalMin); // Chagne to milliseconds
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
  

  // Community parser
  // Parse target & return matching items as array
  // * type : file extenstion
  // * regexp : regular expression used for capture item from title
  // # endPage : Last page of parsing batch (from 1 ~ endPage)
  //
  testParser() {
    const snapshotUrl = 'http://mlbpark.donga.com/mlbpark/b.php?p=1&m=list&b=bullpen2&query=&select=title&user=';
    const basePostUrl = 'http://mlbpark.donga.com/mlbpark/b.php?p=1&b=bullpen2&id=postId&select=title&query=&user=&reply=';
    const content = Meteor.http.get(snapshotUrl).content;
    const $ = cheerio.load(content);

    // Find items from snapshot
    const postElement = $('td.t_left').find('a');

    // const url = postElement.attribs.href; // Get URL
    // const postId = url.slice(url.indexOf('srl=') + 4);
    // const title = postElement.children[0].data;  // Title
    let result = [];


    postElement.each((index, post) => {
      const title = post.attribs.title;

      // // const convertedTitle = iconv.decode(new Buffer(title), 'utf8');

      const url = post.attribs.href; // Get URL
      // const postId = url.slice(url.indexOf('no=') + 3);

      // result.push({ title, basePostUrl: basePostUrl.replace(/postId/, postId) });
      result.push({ title, url });
    });

    return result;
    // return postElement;
  }


  // Parsers
  

  _setScraperHealth(communityName, status) {
    if (typeof status !== 'boolean') {
      throw new Meteor.Error('INVALID Scraper status');
    }
    this.status[communityName] = status;
    return status;
  }

  _parserBuilder(communityName, options) {
    const parsers = {
      clien: () => new ClienParser(options),
      ddanzi: () => new DdanziParser(options),
      ruliweb: () => new RuliwebParser(options),
      bestiz: () => new BestizParser(options),
      pgr21: () => new Pgr21Parser(options),
      mlbpark: () => new MlbparkParser(options),
    };

    return parsers[communityName]();
  }


}
