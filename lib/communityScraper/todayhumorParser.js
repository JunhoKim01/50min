import cheerio from 'cheerio';
import Utils from '../communityScraper/utils.js';

export default class TodayhumorParser {

  constructor(options) {
    this.communityName = 'todayhumor';
    this.parserOptions = options;
    this.basePostUrl = 'http://www.todayhumor.co.kr/board/view.php?table=bestofbest&no=';
  }

  getResult() {
    // Result array
    let result = [];
    
    // Extract matching posts from each pages
    for (let page = 1; page <= this.parserOptions.lastPage; page++) {
      // Make a snapshot for current page
      const snapshotUrl = `http://www.todayhumor.co.kr/board/list.php?table=bestofbest&page=${page}`;
      const content = Meteor.http.get(snapshotUrl,
     { npmRequestOptions: { headers: { 'User-Agent': 'request' } } }).content;
      const $ = cheerio.load(content);

      // Find items from snapshot
      const postElement = $('td.subject').find('a'); // Get post element

      postElement.each((index, post) => {
        if (post === undefined) {
          throw new Meteor.Error('Cannot find post');
        }
        
        // Get title
        const title = post.children[0].data.trim();

        // Get matched types
        const matched = Utils._getMatched(title, this.parserOptions.types, this.parserOptions.regexps);
        // console.log(`[${index}] ${matched}`);
        matched.forEach((type) => {
          const url = post.attribs.href;
          const postId = url.slice(url.indexOf('&no=') + 4, url.indexOf('&s_no='));
          const postUrl = this.basePostUrl + postId;
          const itemId = `todayhumor.${postId}`;
          // Save matched item to result array
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
