import cheerio from 'cheerio';
import Utils from '../communityScraper/utils.js';

export default class DdanziParser {

  constructor(options) {
    this.communityName = 'ddanzi';
    this.parserOptions = options;
    this.basePostUrl = 'http://www.ddanzi.com/index.php?mid=free&page=1&document_srl=';
  }

  getResult() {
    // Result array
    let result = [];

    // Extract matching posts from each pages
    for (let page = 1; page <= this.parserOptions.lastPage; page++) {
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
        const matched = Utils._getMatched(title, this.parserOptions.types, this.parserOptions.regexps);

        // Check if title contains target
        matched.forEach((type) => {
          const url = post.attribs.href; // Get URL
          const postId = url.slice(url.indexOf('srl=') + 4);
          const postUrl = this.basePostUrl + postId;
          const itemId = `ddanzi.${postId}`;
          // Save matching item to result array
          const item = {
            createdAt: Date.now(),
            communityName: this.communityName,
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

  
}