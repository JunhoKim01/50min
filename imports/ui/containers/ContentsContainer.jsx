import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ScrapJPG, ScrapGIF, ScrapAVI } from '../../api/Contents/Scraps.js';
import Contents from '../components/Contents.jsx';


export default createContainer(({ params }) => {
  const { type, communityName, postId, pageNumberArr, tabIndex, devMode, contentsLoadingComplete } = params;
  
  const LOAD_COUNTER = 20;
  const postsCounter = {
    jpg: LOAD_COUNTER * pageNumberArr[0],
    gif: LOAD_COUNTER * pageNumberArr[1],
    avi: LOAD_COUNTER * pageNumberArr[2],
  };
  const subHandles = [
    Meteor.subscribe('scrapJPG', postsCounter.jpg, null),
    Meteor.subscribe('scrapGIF', postsCounter.gif, null),
    Meteor.subscribe('scrapAVI', postsCounter.avi, null),
  ];
  
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
    devMode,
    contentsLoadingComplete,
  };
}, Contents);
