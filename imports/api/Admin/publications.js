import { Meteor } from 'meteor/meteor';
import { Status } from './Status.js';

Meteor.publish('status', () => Status.find());
