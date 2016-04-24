import React from 'react';
import Avatar from 'material-ui/lib/avatar';
import ListItem from 'material-ui/lib/lists/list-item';
import Styles from 'material-ui/lib/styles';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';

export default class Bridge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlLoaded: false,
    };
  }
  componentWillReceiveProps() {
    this.setState({
      urlLoaded: true,
    });
  }
  getCommunityColor(source) {
    const communityColor = {
      clien: 'rgba(55, 66, 115, 1)',
      bestiz: 'rgba(187, 202, 231, 1)',
      mlbpark: 'rgba(255, 143, 1, 1)',
      ruliweb: 'rgba(26, 112, 221, 1)',
      pgr21: 'rgba(171, 70, 72, 1)',
      todayhumor: 'rgba(59, 161, 199, 1)',
    };
    return communityColor[source];
  }
  shareKakao() {
    const content = {
      label: '50min에서 공유',
      webLink: {
        text: this.props.title,
        url: `https://meteor-50min.herokuapp.com/${this.props.type}/${this.props.communityName}/${this.props.postId}`,
      },
    };
    Kakao.Link.sendTalkLink(content);
  }
  share() {
    <Paper
            style={{
              flexGrow: 1,
              marginLeft: 10,
              marginRight: 10,
              padding: 8,
            }}
            zDepth={1}
          >
             Home
          </Paper>
  }
  redirectTo() {
    let url = this.props.url;

    // Ruliweb mobile
    if ((url.indexOf('ruliweb') > -1) && isMobile) {
      const position = url.indexOf('/ruliweb');
      const mobeilUrl
       = `${url.substr(0, position + 1)}mobile${url.substr(position)}`;
      url = mobeilUrl;
    }
    window.location = url;
  }
  renderNoItem() {
    return (<div> 없는 페이지 입니다 </div>);
  }
  renderRedirectGuide() {
    return (
      <div
        style={{
          textAlign: 'center',
          // borderStyle: 'solid',
          // borderWidth: 1,
          // borderColor: Styles.Colors.grey300,

        }}
      >
        <Paper zDepth={1}>
          <ListItem
            primaryText={this.props.title}
            leftAvatar={
              <Avatar
                size={40}
                color={'rgba(255, 255, 255, 1)'}
                backgroundColor={this.getCommunityColor(this.props.communityName)}
              >
              { this.props.communityName.charAt(0).toUpperCase()}
              </Avatar>}
            onTouchTap={() => this.redirectTo()}
          />
        </Paper>
        
        <div
          style={{
            marginTop: 4,
            color: Styles.Colors.grey400,
            fontSize: 12,
          }}
        >
          (클릭하여 보러가기)
        </div>
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            // justifyContent: 'center',

          }}
        >
          <div onTouchTap={() => this.shareKakao()}>
            <img
              width="40px"
              height="40px"
              src="http://dn.api1.kage.kakao.co.kr/14/dn/btqa9B90G1b/GESkkYjKCwJdYOkLvIBKZ0/o.jpg" />
          </div>
        </div>
      </div>
    );
  }
  loadingRender() {
    let renderResult;
    if (this.state.urlLoaded) {
      renderResult = (this.props.url !== '') ? this.renderRedirectGuide() : this.renderNoItem();
    } else {
      renderResult = <CircularProgress size={1.5} />;
    }
    return renderResult;
  }
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '65vh',
        }}
      >
        {this.loadingRender()}
      </div>
    );
  }
}

Bridge.propTypes = {
  communityName: React.PropTypes.string.isRequired,
  postId: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
};
