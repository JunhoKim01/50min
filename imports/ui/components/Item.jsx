import React from 'react';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import moment from 'moment';
import MoreHorizIcon from 'material-ui/lib/svg-icons/navigation/more-horiz';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Styles from 'material-ui/lib/styles';

const productionUrl = 'https://meteor-50min.herokuapp.com';
const developUrl = 'http://192.168.1.60:3000';

const itemStyle = {
  paddingTop: 8,
  paddingBottm: 8,
};

 const iconButtonElement = (
      <IconButton>
          <MoreHorizIcon color={Styles.Colors.grey400} />
        </IconButton>
      );

export default class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharingPlatform: null,
      appUrl: this.props.devMode ? developUrl : productionUrl,
    };
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
  sharingItemOnChange(platform) {
    const postId = this.props.postId.slice(this.props.postId.indexOf('.') + 1);

    if (platform === 'kakao') {
      const content = {
        label: this.props.title,
        webButton: {
          text: '50min에서 보기',
          url: `${this.state.appUrl}/${this.props.type}/${this.props.communityName}/${postId}`,
        },
      };
      console.log(content);
      Kakao.Link.sendTalkLink(content);
    } else if (platform === 'facebook') {
      // Facebook
    } else {
      // 
    }
  }
  itemMenu() {
    const kakaoImg = (
      <img
        
        src="http://dn.api1.kage.kakao.co.kr/14/dn/btqa9B90G1b/GESkkYjKCwJdYOkLvIBKZ0/o.jpg"
      />);
    const RightIconMenu = (
      <IconMenu
        onChange={(event, value) => {this.sharingItemOnChange(value);}}
        iconButtonElement={iconButtonElement}
        useLayerForClickAway={true}
        // onItemTouchTap={(event, value) => {this.share(value);}}
      >
        <MenuItem
          leftIcon={kakaoImg}
          value={'kakao'}
          primaryText={'카카오톡으로 공유하기'}
        />
      </IconMenu>
      );

    return RightIconMenu;
  }
  render() {
    return (
      <ListItem
        sytle={itemStyle}
        primaryText={this.props.title}
        leftAvatar={
          <Avatar
            size={40}
            color={'rgba(255, 255, 255, 1)'}
            backgroundColor={this.getCommunityColor(this.props.communityName)}
           // src={faviconSrc}
          >
          {this.props.communityName.charAt(0).toUpperCase()}
          </Avatar>}
        secondaryText={moment(this.props.createdAt).fromNow()}
        onTouchTap={() => this.redirectTo()}
        rightIconButton={this.itemMenu()}
      />
    );
  }
}

Item.propTypes = {
  url: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  postId: React.PropTypes.string.isRequired,
  communityName: React.PropTypes.string.isRequired,
  createdAt: React.PropTypes.number.isRequired,
  devMode: React.PropTypes.bool.isRequired,
};
