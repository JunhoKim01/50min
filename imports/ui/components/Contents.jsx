import React from 'react';
import List from 'material-ui/lib/lists/list';

// import LoadingMoreContents from './indicators/LoadingMoreContents.jsx';
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
      // State of the contents page
      // 0 : Loading contents for the first time
      // 1 : No-data
      // 2 : Loading more contents
      // 3 : Load complete
      contentsState: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    this.setState({
      tabIndex: nextProps.tabIndex,
    });
    
    switch (nextProps.tabIndex) {
      case 0:
        this.setContentsState(nextProps.subsReadyJPG, nextProps.listsJPG);
        break;
      case 1:
        this.setContentsState(nextProps.subsReadyGIF, nextProps.listsGIF);
        break;
      case 2:
        this.setContentsState(nextProps.subsReadyAVI, nextProps.listsAVI);
        break;
      default:
        throw new Meteor.Error('INVALID tabIndex');
    }
  }
  setContentsState(scrapHandle, scrapDB) {
    if (! scrapHandle && (scrapDB.length === 0)) {
      // Loading contents for the first time
      this.setState({
        contentsState: 0,
      });
    } else if (scrapHandle && (scrapDB.length === 0)) {
      // No-data
      this.setState({
        contentsState: 1,
      });
    } else if (! scrapHandle && (scrapDB.length !== 0)) {
      // Loading more contents
      this.setState({
        contentsState: 2,
      });
    } else if (scrapHandle && (scrapDB.length !== 0)) {
      // Load complete
      if (this.state.contentsState !== 3) {
        this.props.contentsLoadingComplete();
        this.setState({
          contentsState: 3,
        });
      }
    }
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
  renderContents(type, scrapDB) {
    let renderResult = null;
    // console.log('render...');
    // render
    switch (this.state.contentsState) {
      case 0:
        // Loading contents for the first time
        renderResult = <LoadingContents />;
        break;
      case 1:
        // No-data
        renderResult = <NoData />;
        break;
      case 2:
        // Loading more contents
        renderResult = (
          <div>
            <List style={{ paddingTop: 0 }}>
              {this.renderEachItems(scrapDB)}
            </List>
            
          </div>
        );
        break;
      case 3:
        // Load complete
        renderResult = (
          <div>
            <List style={{ paddingTop: 0 }}>
              {this.renderEachItems(scrapDB)}
            </List>
          </div>
        );
        break;
      default:
        throw new Meteor.Error('INVALID contentsState');
    }
    return renderResult;
  }
  render() {
    let renderResult = null;
    const communityName = this.props.communityName;
    const postId = this.props.postId;
    const type = this.props.type;
    if ((type !== 'default') && (communityName !== 'default') && (postId !== '0')) {
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
          renderResult = this.renderContents('jpg', this.props.listsJPG);
          break;
        case 1:
          renderResult = this.renderContents('gif', this.props.listsGIF);
          break;
        case 2:
          renderResult = this.renderContents('avi', this.props.listsAVI);
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
