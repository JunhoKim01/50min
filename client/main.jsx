// var postSample = {
//   createdAt: 123543765, // Unix timestamp
//   communityName: 'clien',                 // Community name of this post
//   batchCount: 1,                            // Batch number of the day which is reseted everyday
//   type: 'jpg',                            // Type of this post
//   title: 'This article is test01.jpg',    // Title of this post
//   url: 'http://www.clien.net/?id=123456', // URL of this post
//   size: '202',                            // Size of media this post contians as kilo bytes
//   postId: 'clien.123456',                 // Unique id of this post : 'communityName+postId'
//   point: 1,                               // Some calculatd point
// };

// Handle touch event
injectTapEventPlugin();

// Material ui init
var {
    AppCanvas,
    AppBar,
    Styles,
    FlatButton,
    CircularProgress,
    RefreshIndicator,
    } = MUI;
var { ThemeManager, LightRawTheme } = Styles;

App = React.createClass({

  mixins: [ReactMeteorData],

  getInitialState() {
    // Item show count
    return {
      loaded: 20,
    };
  },
  getMeteorData() {
    const subHandles = [
      Meteor.subscribe('scrapJPG', this.state.loaded),
      Meteor.subscribe('scrapGIF', this.state.loaded),
      Meteor.subscribe('scrapAVI', this.state.loaded),
      // Meteor.subscribe('scrapTXT', 10),
    ];

    const subsReady = _.all(subHandles, handle => handle.ready());

    return {
      subsReady,
      listsJPG: ScrapJPG.find({}, { sort: { createdAt: -1 } }).fetch(),
      listsGIF: ScrapGIF.find({}, { sort: { createdAt: -1 } }).fetch(),
      listsAVI: ScrapAVI.find({}, { sort: { createdAt: -1 } }).fetch(),
      // listsTXT: ScrapTXT.find({}, { sort: { createdAt: -1 } }).fetch(),
    };

    // style={{
    //         display: 'inline-block',
    //         position: 'relative' }}
  },
  remove() {
    Meteor.call('remove');
  },
  // Main renderer
  render() {
    return (
      <div className="container">
        <AppBar
          title="50min"
          iconElementRight={<FlatButton label="Reset" onClick={this.remove}/>} />
        <Pages data={this.data} />
        
      </div>
    );
  },
});
