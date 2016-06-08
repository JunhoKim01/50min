// Kadira performance monitoring
import { Meteor } from 'meteor/meteor';

Meteor.onConnection((conn) => {
  if (conn.clientAddress !== '192.168.1.60') {
    Kadira.connect('HTQXMxmoKrGiud2Ch', '30ceb4b8-f337-4ab4-9777-004f4311ba08');
  }
});
