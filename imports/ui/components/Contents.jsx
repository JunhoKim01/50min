import React from 'react';
import List from 'material-ui/lib/lists/list';

import LoadingMore from './LoadingMore.jsx';
import Loading from './Loading.jsx';
import NoData from './NoData.jsx';
import Item from './Item.jsx';
import BridgeContainer from '../containers/BridgeContainer.jsx';

// const LOAD_COUNTER_INIT = 20;
// const LOAD_COUNTER_ADD = 20;

export default class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: this.props.tabIndex,
      // pageNumber: this.props.pageNumber,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.state = {
      tabIndex: nextProps.tabIndex,
    };
  }
  renderItems(lists) {
    if (lists === undefined) {
      throw new Meteor.Error('database undefined');
    }
    return lists.map((item) =>
          <Item
            key={item._id}
            title={item.title}
            type={item.type}
            url={item.postUrl}
            communityName={item.communityName}
            postId={item.itemId}
            createdAt={item.createdAt}
            devMode={this.props.devMode}
          />);
  }
  renderTabContents(type) {
    let renderResult = null;
    let scrapHandle = null;
    let scrapDB = null;

    switch (type) {
      case 'jpg':
        scrapHandle = this.props.subsReadyJPG;
        scrapDB = this.props.listsJPG;
        break;
      case 'gif':
        scrapHandle = this.props.subsReadyGIF;
        scrapDB = this.props.listsGIF;
        break;
      case 'avi':
        scrapHandle = this.props.subsReadyAVI;
        scrapDB = this.props.listsAVI;
        break;
      default:
        throw Meteor.Error('INVALID type');
    }

    // render
    if (! scrapHandle && (scrapDB.length === 0)) {
      // First loading
      renderResult = <Loading />;
    } else if (scrapHandle && (scrapDB.length === 0)) {
      // No-data
      renderResult = <NoData />;
    } else if (! scrapHandle && (scrapDB.length !== 0)) {
      // Loading more
      renderResult = (
        <div>
          <List>
            {this.renderItems(scrapDB)}
          </List>
          <LoadingMore />
        </div>
      );
    } else if (scrapHandle && (scrapDB.length !== 0)) {
      // Load complete
      renderResult = (
        <div>
          <List>
            {this.renderItems(scrapDB)}
          </List>
          
        </div>
      );
    }

    return renderResult;
  }
  render() {
    let renderResult = null;
    const communityName = this.props.communityName;
    const postId = this.props.postId;
    const type = this.props.type;
    if ((type !== 'default') && (communityName !== 'default') && (postId !== 0)) {
      // if CommnunityName & postId were given, render Bridge page
      renderResult = (
        <BridgeContainer
          params={{
            communityName,
            postId,
            type,
            devMode: this.props.devMode,
          }}
        />);
    } else {
      switch (this.state.tabIndex) {
        case 0:
          renderResult = this.renderTabContents('jpg');
          break;
        case 1:
          renderResult = this.renderTabContents('gif');
          break;
        case 2:
          renderResult = this.renderTabContents('avi');
          break;
        default:
          renderResult = (<div> ERROR! </div>);
          break;
      }
    }
    return renderResult;
  }
}

Contents.propTypes = {
  devMode: React.PropTypes.bool.isRequired,
  communityName: React.PropTypes.string.isRequired,
  postId: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.number.isRequired,
  listsJPG: React.PropTypes.array.isRequired,
  listsGIF: React.PropTypes.array.isRequired,
  listsAVI: React.PropTypes.array.isRequired,
  subsReadyJPG: React.PropTypes.bool.isRequired,
  subsReadyGIF: React.PropTypes.bool.isRequired,
  subsReadyAVI: React.PropTypes.bool.isRequired,
};
