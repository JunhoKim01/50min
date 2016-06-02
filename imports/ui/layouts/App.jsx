import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Paper from 'material-ui/lib/paper';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import RaisedButton from 'material-ui/lib/raised-button';

import LoadingMoreContents from '../components/indicators/LoadingMoreContents.jsx';
import ContentsContainer from '../containers/ContentsContainer.jsx';

import Theme from '../theme/theme.js';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import Styles from 'material-ui/lib/styles';

import { browserHistory } from 'react-router';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: this.getTabIndex(),  // JPG
      pageNumber: [1],
      devMode: false,
      isBridge: this.getBridgeState(),
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
  // getTabIndexByType(type) {
  //   let tabIndex = 0;
  //   return tabIndex;
  // }
  getTabIndex() {
    // // const type = this.props.params.pick || 'default';
    // if (type === 'default' || type === 'pick') {
    //   return 0;
    // } else if (type === 'gif') {
    //   return 1;
    // }
    // // Wrong url goes to default tab(pick tab)
    return 0;
  }
  getBridgeState() {
    // const type = this.props.params.type || 'default';
    // const communityName = this.props.params.communityName || 'default';
    const pickId = this.props.params.pickId || '0';
    if (pickId !== '0') {
      // Bridge mode
      return true;
      // this.setState({ isBridge: true });
    } else {
      // Contents mode
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
    if (tabIndex === 0) {
      browserHistory.replace('/pick/'); // Push the current tab to locale history
    } else if (tabIndex === 1) {
      // TODO: Trending tab
      browserHistory.replace('/trend/'); // Push the current tab to locale history
    }
    // // From Brige to Contents
    // if (this.state.isBridge) {
      
    // }
    // if (this.state.isBridge) {
    //   if (tabIndex === 0) {
    //     // window.location = '/jpg/';
    //     browserHistory.replace('/jpg/'); // Push the current tab to locale history
    //   } else if (tabIndex === 1) {
    //     // window.location = '/gif/';
    //     browserHistory.replace('/gif/'); // Push the current tab to locale history
    //   } else if (tabIndex === 2) {
    //     // window.location = '/avi/';
    //     browserHistory.replace('/avi/'); // Push the current tab to locale history
    //   }
    // }

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
  goHome() {
    if (!(window.location.pathname === '/' || window.location.pathname === '/pick/')) {
      if (this.state.isBridge) {
        // Change to contents mode
        browserHistory.push('/pick/'); // Push the current tab to locale history
        this.setState({ isBridge: false });
      } else {
        // Go to main page
        window.location = '/';
      }
    }
  }
  // Main renderer
  render() {
    return (
      <div
        className="container"
        style={{
          flexWrap: 'wrap',
        }}
      >
        <Paper
          onTouchTap={() => this.goHome()}
          children="Piccup"
          style={{
            position: 'fixed',
            zIndex: 1,
            width: '100%',
            // flexWrap: 'wrap',
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: Styles.Colors.cyan500,
            fontFamiliy: 'Roboto, sans-serif',
            color: 'white',
            fontSize: 20,
            fontWeight: 400,
            textAlign: 'center',
          }}
          zDepth={0}
        />
        <div
          style={{
            width: '100%',
            paddingTop: 32,
          }}
        >
            <Tabs
              onChange={(tabIndex) => this.tabHandler(tabIndex)}
              value={this.state.tabIndex}

            >
              <Tab label="픽" value={0} />
              <Tab label="실시간 트렌드" value={1} />
            </Tabs>
          </div>
        
        <ContentsContainer
          params={{
            // type: this.props.params.type || 'default',
            // communityName: this.props.params.communityName || 'default',
            pickId: this.props.params.pickId || '0',
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
  // pickId: React.PropTypes.string,
  params: React.PropTypes.object.isRequired,
  // type: React.PropTypes.string,
  // communityName: React.PropTypes,
  // postId: React.PropTypes.string,
  // devMode: React.PropTypes.bool,
};
