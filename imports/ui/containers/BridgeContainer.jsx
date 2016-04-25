import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ScrapJPG, ScrapGIF, ScrapAVI } from '../../api/Contents/Scraps.js';
import Bridge from '../components/Bridge.jsx';

export default createContainer(({ params }) => {
  const { communityName, postId, type, devMode } = params;

  let url = '';
  let title = '';
  let item = undefined

  let subshandle = null;

  if ((communityName !== 'default') && (postId !== '0') && type !== 'default') {
    const itemId = `${communityName}.${postId}`;
    if (type === 'jpg') {
      subshandle = Meteor.subscribe('scrapJPG', 1, itemId);
      item = ScrapJPG.findOne({ itemId });
    } else if (type === 'gif') {
      subshandle = Meteor.subscribe('scrapGIF', 1, itemId);
      item = ScrapGIF.findOne({ itemId });
    } else if (type === 'avi') {
      subshandle = Meteor.subscribe('scrapAVI', 1, itemId);
      item = ScrapAVI.findOne({ itemId });
    } else {
      // Error
      // TODO: link to error page
      item = undefined;
    }
    url = item ? item.postUrl : '';
    title = item ? item.title : '';
  }
  
  return {
    subsReady: subshandle.ready(),
    // type,
    // communityName,
    // postId,
    url,
    title,
    // devMode,
  };
}, Bridge);
