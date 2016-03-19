

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

    // Check if user agent is mobile
    isMobile = mobileChecker();

    // TODO: favicon existence checker
    // Load favicon`s source
    // communities = {
    //   clien: null,
    //   ddanzi: null,
    //   ruliweb: null,
    // };
    communities = {
      clien: 'images/clien.ico',
      ddanzi: 'images/ddanzi.ico',
      ruliweb: 'images/ruliweb.png',
    };

    
    // for (const name in communities) {
    //   let src = `images/${name}.png`;
    //   var favicon = new Image();


    //   favicon.src = src;
      
    //   // Check if favicon with .png exits.
    //   // And if not, return favicon src with .ico
    //   if (favicon.height === 0) {
    //     src = `images/${name}.ico`;
    //   }

    //   // Save favicon src
    //   communities[name] = src;
    // }


    // User Meteor.startup to render the component after the page is ready
    // ReactDOM.render(<App />, document.getElementById('render-target'));

  
    // const router = ReactRouter.createRoutes({
    //   routes,
    //   location: ReactRouter.HistoryLocation,
    // });
    const {
      Route,
      Router,
      browserHistory,
    } = ReactRouter;

    ReactDOM.render(
      <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/admin" component={Admin} />
        <Route path="*" component={AppNotFound} />
      </Router>, document.getElementById('render-target'));

    
  });
}
