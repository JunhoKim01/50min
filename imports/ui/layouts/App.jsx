import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import AppBar from 'material-ui/lib/app-bar';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import ContentsContainer from '../containers/ContentsContainer.jsx';

import RaisedButton from 'material-ui/lib/raised-button';

import Theme from '../theme/theme.js';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,  // JPG
      pageNumber: [1, 1, 1],
      devMode: false,
      isContentsLoaded: true,
    };
    // Kakao
    Kakao.init('3b876b4179514d9878854e2c1ff1fc64');
  }
  getChildContext() {
    return {
      muiTheme: getMuiTheme(Theme),
    };
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
  contentsLoadingComplete() {
    this.setState({
      isContentsLoaded: true,
    });
    console.log(this.state.isContentsLoaded);
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
      isContentsLoaded: false,
    });
    // console.log(this.state.pageNumber);
  }
  loadMoreRender() {
    let renderResult = null;
    const type = this.props.params.type || 'default';
    const communityName = this.props.params.communityName || 'default';
    const postId = this.props.params.postId || '0';
    if ((type !== 'default') && (communityName !== 'default') && (postId !== '0')) {
      // No loadMore button
      renderResult = null;
    } else {
      if (this.state.isContentsLoaded) {
        renderResult = (
          <RaisedButton
            fullWidth={true}
            style={{ height: '48px' }}
            label="더 보기..."
            onTouchTap={() => this.loadMore()}
          />);
      } else {
        // Contents loading...
        renderResult = null;
      }
    }
    return renderResult;
  }
  // Main renderer
  render() {
    return (
      <div className="container">
        <AppBar
          title="50min"
          titleStyle={{
            // height: 48,
            // lineHeight: '48px',
          }}
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
            type: this.props.params.type || 'default',
            communityName: this.props.params.communityName || 'default',
            postId: this.props.params.postId || '0',
            pageNumberArr: this.state.pageNumber,
            tabIndex: this.state.tabIndex,
            devMode: this.state.devMode,
            contentsLoadingComplete: () => this.contentsLoadingComplete,
          }}
        />
        <div>
          {this.loadMoreRender()}
        </div>
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object,
};

App.propTypes = {
  params: React.PropTypes.object.isRequired,
  // type: React.PropTypes.string,
  // communityName: React.PropTypes,
  // postId: React.PropTypes.string,
  // devMode: React.PropTypes.bool,
};
