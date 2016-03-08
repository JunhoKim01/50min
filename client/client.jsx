if (Meteor.isClient) {
  Meteor.startup(() => {
    // Dev
    ConsoleMe.subscribe();

    // Locale Set
    let locale = window.navigator.userLanguage || window.navigator.language;
    // Chrome: ko, Firefox: ko-KR, Safaru: ko-kr
    // And, moment only using for'ko'
    if (locale === 'ko-KR' || locale === 'ko-kr') {
      locale = 'ko';
    }
    moment.locale(locale);

    // User Meteor.startup to render the component after the page is ready
    ReactDOM.render(<App />, document.getElementById('render-target'));
  });
}
