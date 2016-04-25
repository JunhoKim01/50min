import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import AppBar from 'material-ui/lib/app-bar';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import RaisedButton from 'material-ui/lib/raised-button';

import ContentsContainer from '../containers/ContentsContainer.jsx';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,  // JPG
      pageNumber: [1, 1, 1],
    };
    // Kakao
    Kakao.init('3b876b4179514d9878854e2c1ff1fc64');
  }
  getTabIndexByType(type) {
    let tabIndex = 0;
    switch (type) {
      case 'jpg':
        tabIndex = 0;
        break;
      case 'gif':
        tabIndex = 1;
        break;
      case 'avi':
        tabIndex = 2;
        break;
      default:
        tabIndex = 0;
        break;
    }
    return tabIndex;
  }
  tabHandler(tabIndex) {
    this.setState({
      tabIndex,
    });

    // console.log(tabIndex);
    // Reset counter
    // this.loadCounterReset(tabIndex);
  }
  loadMore() {
    const pageNumberArr = this.state.pageNumber;
    pageNumberArr[this.state.tabIndex] += 1;
    this.setState({
      pageNumber: pageNumberArr,
    });
    // console.log(this.state.pageNumber);
  }
  loadMoreRender() {
    let renderResult = null;
    const communityName = this.props.communityName;
    const postId = this.props.postId;
    const type = this.props.type;
    if ((type !== 'default') && (communityName !== 'default') && (postId !== '0')) {
      // No loadMore button
      renderResult = null;
    } else {
      // loadMore button
      renderResult = (
        <RaisedButton
          fullWidth={true}
          style={{ height: '48px' }}
          label="더 보기..."
          onTouchTap={() => this.loadMore()}
        />);
    }
    return renderResult;
  }
  // Main renderer
  render() {
    return (
      <div className="container">
        <AppBar
          title="50min"
          style={{ flexWrap: 'wrap' }}
        >
          <div style={{ width: '100%' }}>
            <Tabs
              onChange={(tabIndex) => this.tabHandler(tabIndex)}
              value={this.state.tabIndex}
            >
              <Tab label="JPG" value={0} />
              <Tab label="GIF" value={1} />
              <Tab label="AVI" value={2} />
            </Tabs>
          </div>
        </AppBar>
          <ContentsContainer
            params={{
              type: this.props.type,
              communityName: this.props.communityName,
              postId: this.props.postId,
              pageNumberArr: this.state.pageNumber,
              tabIndex: this.state.tabIndex,
              devMode: this.props.devMode,
            }}
          />
      </div>
    );
  }
}

App.propTypes = {
  type: React.PropTypes.string.isRequired,
  communityName: React.PropTypes.string.isRequired,
  postId: React.PropTypes.string.isRequired,
  devMode: React.PropTypes.bool.isRequired,
};
