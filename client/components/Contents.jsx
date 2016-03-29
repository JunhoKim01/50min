import React from 'react';
import List from 'material-ui/lib/lists/list';
import RaisedButton from 'material-ui/lib/raised-button';

import LoadingMore from '../components/LoadingMore.jsx';
import NoData from '../components/NoData.jsx';

const LOAD_COUNTER_INIT = 20;
const LOAD_COUNTER_ADD = 20;

Contents = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState() {
    // Item show count
    
    return {
      // Loaded number of itmes
      loadedJPG: LOAD_COUNTER_INIT,
      loadedGIF: LOAD_COUNTER_INIT,
      loadedAVI: LOAD_COUNTER_INIT,
      initialLoad: true,
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
  initialLoadDone() {
    this.setState({ initialLoad: false });
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
            url={item.postUrl}
            source={item.communityName}
            createdAt={item.createdAt} />);
  },
  renderTabContents(type) {
    switch (type) {
      case 'jpg':
        if (! this.data.subsReadyJPG && (this.data.listsJPG.length === 0)) {
          // First loading
          return <Loading />;
        } else if (this.data.subsReadyJPG && (this.data.listsJPG.length === 0)) {
          // No-data
          return <NoData />;
        } else if (! this.data.subsReadyJPG && (this.data.listsJPG.length !== 0)) {
          // Loading more
          return (
            <div>
              <List>
                {this.renderItems(this.data.listsJPG)}
              </List>
              <LoadingMore />
            </div>
            );
        } else if (this.data.subsReadyJPG && (this.data.listsJPG.length !== 0)) {
          // Load complete
          return (
            <div>
              <List>
                {this.renderItems(this.data.listsJPG)}
              </List>
              <RaisedButton fullWidth={true} label="더 보기..." onTouchTap={this.loadMore} />
            </div>
            );
        }
        break;
      case 'gif':
        if (! this.data.subsReadyGIF && (this.data.listsGIF.length === 0)) {
          // First loading
          return <Loading />;
        } else if (this.data.subsReadyGIF && (this.data.listsGIF.length === 0)) {
          // No-data
          return <NoData />;
        } else if (! this.data.subsReadyGIF && (this.data.listsGIF.length !== 0)) {
          // Loading more
          return (
            <div>
              <List>
                {this.renderItems(this.data.listsGIF)}
              </List>
              <LoadingMore />
            </div>
            );
        } else if (this.data.subsReadyGIF && (this.data.listsGIF.length !== 0)) {
          // Load complete
          return (
            <div>
              <List>
                {this.renderItems(this.data.listsGIF)}
              </List>
              <RaisedButton fullWidth={true} label="더 보기..." onTouchTap={this.loadMore} />
            </div>
            );
        }
        break;
      case 'avi':
        if (! this.data.subsReadyAVI && (this.data.listsAVI.length === 0)) {
          // First loading
          return <Loading />;
        } else if (this.data.subsReadyAVI && (this.data.listsAVI.length === 0)) {
          // No-data
          return <NoData />;
        } else if (! this.data.subsReadyAVI && (this.data.listsAVI.length !== 0)) {
          // Loading more
          return (
            <div>
              <List>
                {this.renderItems(this.data.listsAVI)}
              </List>
              <LoadingMore />
            </div>
            );
        } else if (this.data.subsReadyAVI && (this.data.listsAVI.length !== 0)) {
          // Load complete
          return (
            <div>
              <List>
                {this.renderItems(this.data.listsAVI)}
              </List>
              <RaisedButton fullWidth={true} label="더 보기..." onTouchTap={this.loadMore} />
            </div>
            );
        }
        break;
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

