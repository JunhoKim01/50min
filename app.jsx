// Collections
ScrapJPG = new Mongo.Collection('scrapJPG');
ScrapGIF = new Mongo.Collection('scrapGIF');
ScrapAVI = new Mongo.Collection('scrapAVI');
ScrapTXT = new Mongo.Collection('scrapTXT');



var postSample = {
  createdAt: 123543765, // Unix timestamp
  communityName: 'clien',                 // Community name of this post
  batchCount: 1,                            // Batch number of the day which is reseted everyday
  type: 'jpg',                            // Type of this post
  title: 'This article is test01.jpg',    // Title of this post
  url: 'http://www.clien.net/?id=123456', // URL of this post
  size: '202',                            // Size of media this post contians as kilo bytes
  postId: 'clien.123456',                 // Unique id of this post : 'communityName+postId'
  point: 1,                               // Some calculatd point
};


injectTapEventPlugin();

var {
    AppCanvas,
    AppBar,
    Styles,
    Tabs,
    Tab,
    List,
    Divider,
    CircularProgress,
    FlatButton,
    } = MUI;
var { ThemeManager, LightRawTheme } = Styles;

App = React.createClass({

  mixins: [ReactMeteorData],

  getInitialState() {
    // Init
    return null;
  },
  getMeteorData() {

    var collectionJPG = Meteor.subscribe('scrapJPG');
    var collectionGIF = Meteor.subscribe('scrapGIF');
    var collectionAVI = Meteor.subscribe('scrapAVI');
    var collectionTXT = Meteor.subscribe('scrapTXT');

    return {
      collectionJPGLoading: ! collectionJPG.ready(),
      collectionGIFLoading: ! collectionGIF.ready(),
      collectionAVILoading: ! collectionAVI.ready(),
      collectionTXTLoading: ! collectionTXT.ready(),
      listsJPG: ScrapJPG.find({}, { sort: { createdAt: -1 } }).fetch(),
      listsGIF: ScrapGIF.find({}, { sort: { createdAt: -1 } }).fetch(),
      listsAVI: ScrapAVI.find({}, { sort: { createdAt: -1 } }).fetch(),
      listsTXT: ScrapTXT.find({}, { sort: { createdAt: -1 } }).fetch(),
    };
  },
  renderBatches(type) {
    switch (type) {
      case 'jpg':
        if (this.data.collectionJPGLoading) {
          return <CircularProgress />;
        } else {
          return (
            <List>
              {this.data.listsJPG.map((item) => {
                return <Item key={item._id} title={item.batchCount + ' ' + item.title} url={item.url} />;
              })}
              <Divider />
            </List>
            );
        }
      case 'gif':
        if (this.data.collectionGIFLoading) {
          return <CircularProgress />;
        } else {
          return (
            <List>
              {this.data.listsGIF.map((item) => {
                return <Item key={item._id} title={item.batchCount + ' ' + item.title} url={item.url} />;
              })}
              <Divider />
            </List>
            );
        }
      case 'avi':
        if (this.data.collectionAVILoading) {
          return <CircularProgress />;
        } else {
          return (
            <List>
              {this.data.listsAVI.map((item) => {
                return <Item key={item._id} title={item.batchCount + ' ' + item.title} url={item.url} />;
              })}
              <Divider />
            </List>
            );
        }
      case 'txt':
        if (this.data.collectionTXTLoading) {
          return <CircularProgress />;
        } else {
          return (
            <List>
              {this.data.listsTXT.map((item) => {
                return <Item key={item._id} title={item.batchCount + ' ' + item.title} url={item.url} />;
              })}
              <Divider />
            </List>
            );
        }
      default:
        throw Meteor.Error('render Failed');
    }
  },
  remove() {
    Meteor.call('remove');
  },
  // Main renderer
  render() {
    return (
      <div className="container">
        <AppBar title="50min" iconElementRight={<FlatButton label="Reset" onClick={this.remove}/>} />
        <Tabs>
          <Tab label="JPG">
            <div>
              {this.renderBatches('jpg')}
            </div>
          </Tab>
          <Tab label="GIF" >
            <div>
              {this.renderBatches('gif')}
            </div>
          </Tab>
          <Tab label="AVI">
            <div>
              {this.renderBatches('avi')}
            </div>
          </Tab>
          <Tab label="TXT">
            <div>
              {this.renderBatches('txt')}
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  },
});
