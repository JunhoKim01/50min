import cheerio from 'cheerio';
import Utils from '../communityScraper/utils.js';

export default class RuliwebParser {

  constructor(options) {
    this.communityName = 'ruliweb';
    this.parserOptions = options;
    this.basePostUrl = 'http://bbs2.ruliweb.daum.net/gaia/do/ruliweb/default/read?articleId=postId&bbsId=G005&itemId=143'; // 29290322
  }

  getResult() {
    // Result array
    let result = [];

    for (let page = 1; page <= this.parserOptions.lastPage; page++) {
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
        const matched = Utils._getMatched(title, this.parserOptions.types, this.parserOptions.regexps);
        matched.forEach((type) => {
          const url = post.attribs.href; // Get URL
          const postId = url.slice(url.indexOf('articleId=') + 10, url.indexOf('articleId=') + 18);
          const postUrl = this.basePostUrl.replace(/postId/, postId);
          const itemId = `ruliweb.${postId}`;
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
