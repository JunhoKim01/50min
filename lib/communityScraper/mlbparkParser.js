import cheerio from 'cheerio';
import Utils from '../communityScraper/utils.js';

export default class MlbparkParser {

  constructor(options) {
    this.communityName = 'mlbpark';
    this.parserOptions = options;
    this.basePostUrl = 'http://mlbpark.donga.com/mlbpark/b.php?p=1&b=bullpen2&id=postId&select=title&query=&user=&reply=';
  }

  getResult() {
    // Result array
    let result = [];

    for (let page = 1; page <= this.parserOptions.lastPage; page++) {
      // Make snapshot of current page
      const mlbparkPage = (page - 1) * 30 + 1;
      const snapshotUrl = `http://mlbpark.donga.com/mlbpark/b.php?p=${mlbparkPage}&m=list&b=bullpen2&query=&select=title&user=`;
      const content = Meteor.http.get(snapshotUrl).content;
      const $ = cheerio.load(content);
      // Get the list of post items
      const postElement = $('td.t_left').find('a');
      // Iterate over each post items
      postElement.each((index, post) => {
        if (post === undefined) {
          throw new Meteor.Error('Cannot find post');
        }

        const title = post.attribs.title; // title

        // Check if title contains target
        const matched = Utils._getMatched(title, this.parserOptions.types, this.parserOptions.regexps);
        matched.forEach((type) => {
          const url = post.attribs.href; // Get URL
          const postId = url.slice(url.indexOf('id=') + 3, url.indexOf('id=') + 10);
          const postUrl = this.basePostUrl.replace(/postId/, postId);
          const itemId = `mlbpark.${postId}`;
          // Save matching item to result array
          const item = {
            createdAt: Date.now(),
            communityName: this.communityName,
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
}
