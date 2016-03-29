// var postSample = {
//   createdAt: 123543765, // Unix timestamp
//   communityName: 'clien',                 // Community name of this post
//   batchCount: 1,                            // Batch number of the day which is reseted everyday
//   type: 'jpg',                            // Type of this post
//   title: 'This article is test01.jpg',    // Title of this post
//   url: 'http://www.clien.net/?id=123456', // URL of this post
//   size: '202',                            // Size of media this post contians as kilo bytes
//   postId: 'clien.123456',                 // Unique id of this post : 'communityName+postId'
//   point: 1,                               // Some calculatd point
// };



// Handle touch event
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import FlatButton from 'material-ui/lib/flat-button';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';



// Material ui init
// const {
//     AppBar,
//     Styles,
//     FlatButton,
//     CircularProgress,
//     RefreshIndicator,
//     Tabs,
//     Tab,
//     } = MUI;
// const { ThemeManager, LightRawTheme } = Styles;

App = React.createClass({

  getInitialState() {
    return {
      // Selected tab
      currentTabIndex: 0,
    };
  },
  tabHandler(tabIndex) {
    this.setState({
      currentTabIndex: tabIndex,
    });
    // Reset counter
    // this.loadCounterReset(tabIndex);
  },
  // <div sytle={{ display: 'flex', justifyContent: 'center' }}>
  //         <RefreshIndicator left={70} top={0} status="loading"
  //       style={{}}/>
  // </div>
// <Contents tabHandler={this.tabHandler} state={this.state}/>
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
              onChange={this.tabHandler}
              value={this.state.currentTabIndex}
            >
              <Tab label="JPG" value={0} />
              <Tab label="GIF" value={1} />
              <Tab label="AVI" value={2} />
            </Tabs>
          </div>
        </AppBar>
        <Contents tabHandler={this.tabHandler} tabIndex={this.state.currentTabIndex}/>
      </div>
    );
  },
});
