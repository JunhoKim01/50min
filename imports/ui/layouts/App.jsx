import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import AppBar from 'material-ui/lib/app-bar';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import RaisedButton from 'material-ui/lib/raised-button';

import LoadingMoreContents from '../components/indicators/LoadingMoreContents.jsx';
import ContentsContainer from '../containers/ContentsContainer.jsx';

import Theme from '../theme/theme.js';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: this.setTabIndex(),  // JPG
      pageNumber: [1, 1, 1],
      devMode: false,
      isBridge: this.setBridgeState(),
      isContentsLoaded: true,
    };
    // Kakao init
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
  setTabIndex() {
    const type = this.props.params.type || 'default';
    if (type === 'default' || type === 'jpg') {
      return 0;
    } else if (type === 'gif') {
      return 1;
    } else if (type === 'avi') {
      return 2;
    }
    // Wrong url goes to default type jpg
    return 0;
  }
  setBridgeState() {
    const type = this.props.params.type || 'default';
    const communityName = this.props.params.communityName || 'default';
    const postId = this.props.params.postId || '0';
    if ((type !== 'default') && (communityName !== 'default') && (postId !== '0')) {
      // Bridge
      return true;
      // this.setState({ isBridge: true });
    } else {
      // Contents
      return false;
      // this.setState({ isBridge: false });
    }
  }
  contentsLoadingComplete() {
    // console.log('complete');
    this.setState({
      isContentsLoaded: true,
    });
  }
  tabHandler(tabIndex) {
    this.setState({
      tabIndex,
    });
    // From Brige to Contents
    if (this.state.isBridge) {
      if (tabIndex === 0) {
        window.location = '/jpg/';
      } else if (tabIndex === 1) {
        window.location = '/gif/';
      } else if (tabIndex === 2) {
        window.location = '/avi/';
      }
    }
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
  }
  loadMoreRender() {
    let renderResult = null;
    if (this.state.isBridge) {
      // Bridge --> No loadMore button
      renderResult = null;
    } else {
      // Contents
      if (this.state.isContentsLoaded) {
        // Contents load complete
        renderResult = (
          <RaisedButton
            fullWidth={true}
            style={{ height: '48px' }}
            label="더 보기..."
            onTouchTap={() => this.loadMore()}
          />);
      } else {
        // Contents are loading...
        renderResult = <LoadingMoreContents />;
        // renderResult = (
        //   <RaisedButton
        //     fullWidth={true}
        //     style={{ height: '48px' }}
        //     label="더 보기..."
        //     onTouchTap={() => this.loadMore()}
        //   />);
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
          onTitleTouchTap={() => {window.location = '/';}}
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
            contentsLoadingComplete: () => this.contentsLoadingComplete(),
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
