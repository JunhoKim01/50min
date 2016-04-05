import cheerio from 'cheerio';
import Utils from '../communityScraper/utils.js';
import iconv from 'iconv-lite';

// bestiz
export default class BestizParser {

  constructor(options) {
    this.communityName = 'bestiz';
    this.parserOptions = options;
    this.basePostUrl = 'http://hgc.bestiz.net/zboard/view.php?id=ghm2b&page=1&no=postId';
  }

  getResult() {// Result array
    let result = [];
  
    for (let page = 1; page <= this.parserOptions.lastPage; page++) {
      // Make snapshot of current page
      const snapshotUrl = `http://hgc.bestiz.net/zboard/zboard.php?id=ghm2b&page=${page}`;
      const content = Meteor.http.get(snapshotUrl,
       { npmRequestOptions: { encoding: 'binary' } }).content;
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
        const matched = Utils._getMatched(title, this.parserOptions.types, this.parserOptions.regexps);
        matched.forEach((type) => {
          const convertedTitle = iconv.decode(new Buffer(title, 'binary'), 'euckr');
          const url = post.attribs.href; // Get URL
          const postId = url.slice(url.indexOf('no=') + 3, url.indexOf('no=') + 10);
          const postUrl = this.basePostUrl.replace(/postId/, postId);
          const itemId = `bestiz.${postId}`;
          // Save matching item to result array
          const item = {
            createdAt: Date.now(),
            communityName: this.communityName,
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
}
