import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.jsx';
import moment from 'moment';
import mobileChecker from '../imports/api/lib/browserCheck.js';

Meteor.startup(() => {
  // Dev
  ConsoleMe.subscribe(); // TODO: Switch to NPM module from Meteor module
  // Locale Set
  let locale = window.navigator.userLanguage || window.navigator.language;
  // Chrome: ko, Firefox: ko-KR, Safaru: ko-kr
  // And, moment only using for'ko'
  if (locale === 'ko-KR' || locale === 'ko-kr') {
    locale = 'ko';
  }
  moment.locale(locale);
  // Check if user agent is mobile
  isMobile = mobileChecker();

  // App redner using routes
  render(renderRoutes(), document.getElementById('render-target'));
});
