

// Utilities
export default class Utils {
  // Return default scrap option for selected community
  static _getDefaultOptions(communityName) {
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
  static _getDefaultRegexp(type) {
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
  static _getMatched(title, types, regexps) {
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

  static _getMS(minute) {
    if (typeof minute !== 'number' || isNaN(minute)) {
      throw new Meteor.Error(`INVALID number : ${minute}`);
    }
    return (minute * 60 * 1000);
  }

  static _checkOptValid(options) {
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
