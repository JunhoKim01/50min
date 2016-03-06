// Collections
ScrapJPG = new Mongo.Collection('scrapJPG');
ScrapGIF = new Mongo.Collection('scrapGIF');
ScrapAVI = new Mongo.Collection('scrapAVI');
ScrapTXT = new Mongo.Collection('scrapTXT');


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
      listsJPG: ScrapJPG.find({}, { sort: { date: -1 } }).fetch(),
      listsGIF: ScrapGIF.find({}, { sort: { date: -1 } }).fetch(),
      listsAVI: ScrapAVI.find({}, { sort: { date: -1 } }).fetch(),
      listsTXT: ScrapTXT.find({}, { sort: { date: -1 } }).fetch(),
    };
  },
  renderTicks(type) {
    switch (type) {
      case 'jpg':
        return this.data.listsJPG.map((lists) => {
          return [this.renderLists(lists, type), <Divider />];
        });
      case 'gif':
        return this.data.listsGIF.map((lists) => {
          return [this.renderLists(lists, type), <Divider />];
        });
      case 'avi':
        return this.data.listsAVI.map((lists) => {
          return [this.renderLists(lists, type), <Divider />];
        });
      case 'txt':
        return this.data.listsTXT.map((lists) => {
          return [this.renderLists(lists, type), <Divider />];
        });
      default:
        throw Meteor.Error('render Failed');
    }
  },
  renderLists(lists) {
    return lists.list.map((item) => {
      return <Item
            key={item._id}
            title={item.title}
            url={item.url} />;
    });
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
              {this.data.collectionJPGLoading ?
                <CircularProgress /> : <List>{this.renderTicks('jpg')}</List>
              }
            </div>
          </Tab>
          <Tab label="GIF" >
            <div>
              {this.data.collectionGIFLoading ?
                <CircularProgress /> : <List>{this.renderTicks('gif')}</List>
              }
            </div>
          </Tab>
          <Tab label="AVI">
            <div>
              {this.data.collectionAVILoading ?
                <CircularProgress /> : <List>{this.renderTicks('avi')}</List>
              }
            </div>
          </Tab>
          <Tab label="TXT">
            <div>
              {this.data.collectionTXTLoading ?
                <CircularProgress /> : <List>{this.renderTicks('txt')}</List>
              }
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  },
});
