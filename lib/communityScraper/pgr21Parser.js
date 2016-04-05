import cheerio from 'cheerio';
import Utils from '../communityScraper/utils.js';

  
// pgr21
export default class pgr21Parser {
  constructor(options) {
    this.communityName = 'pgr21';
    this.parserOptions = options;
    this.basePostUrl = 'http://pgr21.com/pb/pb.php?id=humor&no=postId';
  }

  getResult() {
    // Result array
    let result = [];

    for (let page = 1; page <= this.parserOptions.lastPage; page++) {
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
        const matched = Utils._getMatched(title, this.parserOptions.types, this.parserOptions.regexps);
        matched.forEach((type) => {
          const url = post.attribs.href; // Get URL
          const postId = url.slice(url.indexOf('no=') + 3);
          const postUrl = this.basePostUrl.replace(/postId/, postId);
          const itemId = `pgr21.${postId}`;
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
