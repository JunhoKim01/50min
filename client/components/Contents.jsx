const LOAD_COUNTER_INIT = 20;
const LOAD_COUNTER_ADD = 20;

// if (! SwipeableViews) {
//   throw Meteor.Error('SwipeableViews undefined');
// } else if (SwipeableViews === null) {
//   throw Meteor.Error('SwipeableViews null');
// } else {
//   console.log(SwipeableViews);
// }

// SwipeableView
SwipeableViews = SV.default;

const {
    Tabs,
    Tab,
    List,
    Divider,
    CircularProgress,
    LinearProgress,
    RefreshIndicator,
    RaisedButton,
    } = MUI;

Contents = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState() {
    // Item show count
    
    return {
      // Loaded number of itmes
      loadedJPG: LOAD_COUNTER_INIT,
      loadedGIF: LOAD_COUNTER_INIT,
      loadedAVI: LOAD_COUNTER_INIT,
    };
  },
  getMeteorData() {
    const subHandles = [
      Meteor.subscribe('scrapJPG', this.state.loadedJPG),
      Meteor.subscribe('scrapGIF', this.state.loadedGIF),
      Meteor.subscribe('scrapAVI', this.state.loadedAVI),
      // Meteor.subscribe('scrapTXT', 10),
    ];
    return {
      subsReadyJPG: subHandles[0].ready(),
      subsReadyGIF: subHandles[1].ready(),
      subsReadyAVI: subHandles[2].ready(),
      listsJPG: ScrapJPG.find({}, { sort: { createdAt: -1 } }).fetch(),
      listsGIF: ScrapGIF.find({}, { sort: { createdAt: -1 } }).fetch(),
      listsAVI: ScrapAVI.find({}, { sort: { createdAt: -1 } }).fetch(),
      // listsTXT: ScrapTXT.find({}, { sort: { createdAt: -1 } }).fetch(),
    };
  },
  loadMore() {
    const type = this.props.tabIndex;
    switch (type) {
      case 0:
        this.setState({ loadedJPG: this.state.loadedJPG + LOAD_COUNTER_ADD });
        break;
      case 1:
        this.setState({ loadedGIF: this.state.loadedGIF + LOAD_COUNTER_ADD });
        break;
      case 2:
        this.setState({ loadedAVI: this.state.loadedAVI + LOAD_COUNTER_ADD });
        break;
      default:
        return;
    }
  },
  renderItems(lists) {
    if (lists === undefined) {
      throw new Meteor.Error('database undefined');
    }
    return lists.map((item, index) =>
          <Item
            number={index}
            key={item._id}
            title={item.title}
            url={item.url}
            source={item.communityName}
            createdAt={item.createdAt} />);
  },
  renderTabContents(type) {
    switch (type) {
      case 'jpg':
        return (
          <div>
            <List>
              {this.renderItems(this.data.listsJPG)}
            </List>
            <RaisedButton fullWidth={true} label="더 보기..." onTouchTap={this.loadMore} />
          </div>
          );
        // return this.data.subsReadyJPG
        //   ? this.renderItems(this.data.listsJPG) : <CircularProgress />;
      case 'gif':
        return (
          <div>
            <List>
              {this.renderItems(this.data.listsGIF)}
            </List>
            <RaisedButton fullWidth={true} label="더 보기..." onTouchTap={this.loadMore} />
          </div>
          );
      case 'avi':
        return (
          <div>
            <List>
              {this.renderItems(this.data.listsAVI)}
            </List>
            <RaisedButton fullWidth={true} label="더 보기..." onTouchTap={this.loadMore} />
          </div>
          );
      default:
        throw Meteor.Error('INVALID type');
    }
  },
  loadCounterReset(tabIndex) {
    switch (tabIndex) {
      case 0:
        this.setState({ loadedJPG: LOAD_COUNTER_INIT });
        break;
      case 1:
        this.setState({ loadedGIF: LOAD_COUNTER_INIT });
        break;
      case 2:
        this.setState({ loadedAVI: LOAD_COUNTER_INIT });
        break;
      default:
        return;
    }
  },
  componentWillReceiveProps(nextProps) {
    this.loadCounterReset(nextProps.tabIndex);
  },
  render() {
    switch (this.props.tabIndex) {
      case 0:
        return this.renderTabContents('jpg');
      case 1:
        return this.renderTabContents('gif');
      case 2:
        return this.renderTabContents('avi');
      default:
        return (<div> ERROR! </div>);
    }
  },
});

