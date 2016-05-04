import React from 'react';
import List from 'material-ui/lib/lists/list';


import LoadingMoreContents from './indicators/LoadingMoreContents.jsx';
import LoadingContents from './indicators/LoadingContents.jsx';
import NoData from './indicators/NoData.jsx';
import Item from './Item.jsx';
import BridgeContainer from '../containers/BridgeContainer.jsx';

export default class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: this.props.tabIndex,
      pageNumber: [1, 1, 1],
    };
  }
  componentWillReceiveProps(nextProps) {
    this.state = {
      tabIndex: nextProps.tabIndex,
    };
  }
 
  renderEachItems(itemList) {
    if (itemList === undefined) {
      throw new Meteor.Error('database undefined');
    }
    return itemList.map((item) =>
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
  renderContents(type) {
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
      // Loading contents for the first time
      renderResult = <LoadingContents />;
    } else if (scrapHandle && (scrapDB.length === 0)) {
      // No-data
      renderResult = <NoData />;
    } else if (! scrapHandle && (scrapDB.length !== 0)) {
      // Loading more contents
      renderResult = (
        <div>
          <List style={{ paddingTop: 0 }}>
            {this.renderEachItems(scrapDB)}
          </List>
          <LoadingMoreContents />
        </div>
      );
    } else if (scrapHandle && (scrapDB.length !== 0)) {
      // Load complete
      this.props.contentsLoadingComplete();
      renderResult = (
        <div>
          <List style={{ paddingTop: 0 }}>
            {this.renderEachItems(scrapDB)}
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
          renderResult = this.renderContents('jpg');
          break;
        case 1:
          renderResult = this.renderContents('gif');
          break;
        case 2:
          renderResult = this.renderContents('avi');
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
  listsJPG: React.PropTypes.array.isRequired,
  listsGIF: React.PropTypes.array.isRequired,
  listsAVI: React.PropTypes.array.isRequired,
  subsReadyJPG: React.PropTypes.bool.isRequired,
  subsReadyGIF: React.PropTypes.bool.isRequired,
  subsReadyAVI: React.PropTypes.bool.isRequired,
  type: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.number.isRequired,
  communityName: React.PropTypes.string.isRequired,
  postId: React.PropTypes.string.isRequired,
  devMode: React.PropTypes.bool.isRequired,
  contentsLoadingComplete: React.PropTypes.func.isRequired,
};
