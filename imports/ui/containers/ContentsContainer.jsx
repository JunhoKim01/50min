import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Picks } from '../../api/Contents/Scraps.js';
import Contents from '../components/Contents.jsx';


export default createContainer(({ params }) => {
  const { pickId, pageNumberArr, tabIndex, devMode, contentsLoadingComplete } = params;
  
  const LOAD_COUNTER = 20;
  const postsCounter = {
    picks: LOAD_COUNTER * pageNumberArr[0],
  };
  const subHandles = [
    Meteor.subscribe('Picks', postsCounter.picks, null),
  ];
  
  return {
    subsReadyPicks: subHandles[0].ready(),
    listsPicks: Picks.find({}, { sort: { createdAt: -1 } }).fetch(),
    tabIndex,
    pickId,
    devMode,
    contentsLoadingComplete,
  };
}, Contents);
