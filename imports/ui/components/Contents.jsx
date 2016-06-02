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
      pageNumber: [1, 1, 1, 1],
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
      case 0: // Pick
        this.setContentsState(nextProps.subsReadyPicks, nextProps.listsPicks);
        break;
      case 1: // Trend
        // this.setContentsState(nextProps.subsReadyTrendss, nextProps.listsTrends);
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
  renderContents(category, scrapDB) {
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
    const pickId = this.props.pickId || '0';
    if ((pickId !== '0')) {
      // if pickId is given, render Bridge page
      renderResult = (
        <BridgeContainer
          params={{
            pickId,
            devMode: this.props.devMode,
          }}
        />);
    } else {
      switch (this.state.tabIndex) {
        case 0: // Picks
          renderResult = this.renderContents('pick', this.props.listsPicks);
          break;
        case 1: // Trends
          // renderResult = this.renderContents('trend', this.props.listsTrends);
          renderResult = (<div> 열일중 입니다 </div>);
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
  listsPicks: React.PropTypes.array.isRequired,
  subsReadyPicks: React.PropTypes.bool.isRequired,
  tabIndex: React.PropTypes.number.isRequired,
  pickId: React.PropTypes.string.isRequired,
  devMode: React.PropTypes.bool.isRequired,
  contentsLoadingComplete: React.PropTypes.func.isRequired,
};
