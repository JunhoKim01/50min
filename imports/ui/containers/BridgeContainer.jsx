import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Picks } from '../../api/Contents/Scraps.js';
import Bridge from '../components/Bridge.jsx';

export default createContainer(({ params }) => {
  const { pickId, devMode } = params;

  let url = '';
  let title = '';
  let item = undefined;
  const communityName = pickId.split('.')[0];
  let subshandle = null;

  if (pickId !== '0') {
    // console.log(pickId);
    subshandle = Meteor.subscribe('Picks', 1, pickId);
    item = Picks.findOne({ itemId: pickId });
    // item = Picks.find({ pickId }, { limit: 1 });
    // console.log(pickId);
    // console.log(subshandle.ready());
    // console.log(item);
    url = item ? item.postUrl : '';
    title = item ? item.title : '';
    // TODO: link to error page
    // if (type === 'jpg') {
    //   subshandle = Meteor.subscribe('scrapJPG', 1, itemId);
    //   item = ScrapJPG.findOne({ itemId });
    // } else if (type === 'gif') {
    //   subshandle = Meteor.subscribe('scrapGIF', 1, itemId);
    //   item = ScrapGIF.findOne({ itemId });
    // } else if (type === 'avi') {
    //   subshandle = Meteor.subscribe('scrapAVI', 1, itemId);
    //   item = ScrapAVI.findOne({ itemId });
    // } else {
    //   // Error
    //   // TODO: link to error page
    //   item = undefined;
    // }
  }
  
  return {
    subsReady: subshandle.ready(),
    devMode,
    communityName,
    pickId,
    url,
    title,
  };
}, Bridge);
