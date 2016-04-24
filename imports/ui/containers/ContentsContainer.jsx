import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ScrapJPG, ScrapGIF, ScrapAVI } from '../../api/Contents/Scraps.js';
import Contents from '../components/Contents.jsx';


export default createContainer(({ params }) => {
  const { type, communityName, postId, pageNumberArr, tabIndex } = params;
  
  const LOAD_COUNTER = 5;
  const postsCounter = {
    jpg: LOAD_COUNTER * pageNumberArr[0],
    gif: LOAD_COUNTER * pageNumberArr[1],
    avi: LOAD_COUNTER * pageNumberArr[2],
  };
  const subHandles = [
    Meteor.subscribe('scrapJPG', postsCounter.jpg),
    Meteor.subscribe('scrapGIF', postsCounter.gif),
    Meteor.subscribe('scrapAVI', postsCounter.avi),
  ];
  // if (pageNumberArr) {
  //   console.log(postsCounter);
  // }
  let bridgeUrl = '';
  let bridgeTitle = '';
  if ((communityName !== 'default') && (postId !== '0') && type !== 'default') {
    let item;
    if (type === 'jpg') {
      item = ScrapJPG.findOne({ itemId: `${communityName}.${postId}` });
    } else if (type === 'gif') {
      item = ScrapGIF.findOne({ itemId: `${communityName}.${postId}` });
    } else if (type === 'avi') {
      item = ScrapAVI.findOne({ itemId: `${communityName}.${postId}` });
    } else {
      item = undefined;
    }
    bridgeUrl = item ? item.postUrl : '';
    bridgeTitle = item ? item.title : '';
  }
  
  return {
    subsReadyJPG: subHandles[0].ready(),
    subsReadyGIF: subHandles[1].ready(),
    subsReadyAVI: subHandles[2].ready(),
    listsJPG: ScrapJPG.find({}, { sort: { createdAt: -1 } }).fetch(),
    listsGIF: ScrapGIF.find({}, { sort: { createdAt: -1 } }).fetch(),
    listsAVI: ScrapAVI.find({}, { sort: { createdAt: -1 } }).fetch(),
    type,
    tabIndex,
    communityName,
    postId,
    bridgeUrl,
    bridgeTitle,
  };
}, Contents);
