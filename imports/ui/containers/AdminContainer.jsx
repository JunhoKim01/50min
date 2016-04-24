import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Status } from '../../api/Admin/Status.js';
import Admin from '../components/Admin.jsx';

export default createContainer(() => {
  const instancesHandle = Meteor.subscribe('status');
  const instancesReady = instancesHandle.ready();
  const instances = Status.find({}, { sort: { communityName: 1 } }).fetch();
  return {
    instancesReady,
    instances,
  };
}, Admin);
