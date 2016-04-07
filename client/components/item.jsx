import React from 'react';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import moment from 'moment';

const itemStyle = {
  paddingTop: 8,
  paddingBottm: 8,
};


Item = React.createClass({
  propTypes: {
    // title: React.PropTypes.string.isRequired,
    // url: React.PropTypes.string.isRequired,
    // createdAt: React.PropTypes.number.isRequired,
    // source: React.PropTypes.string.isRequired,
  },
  moveTo() {
    let url = this.props.url;

    // Ruliweb mobile
    if (url.indexOf('ruliweb') > -1) {
      if (isMobile) {
        const position = url.indexOf('/ruliweb');
        const mobeilUrl
         = `${url.substr(0, position + 1)}mobile${url.substr(position)}`;
        location = mobeilUrl;
        return;
      }
    }

    location = url;
  },
  getFavicon(source) {
    if (typeof source !== 'string') {
      throw new Meteor.Error('getFavicon source type is not string');
    }
    let src = `images/${source}.png`;
    const favicon = new Image();
    favicon.src = src;
    
    // Check if favicon with .png exits.
    // And if not, return favicon src with .ico
    if (favicon.height === 0) {
      src = `images/${source}.ico`;
    }

    return src;
  },
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
  },
  render() {
    // const faviconSrc = communities[this.props.source];
    return (
      // TODO: click to link
      <ListItem
        sytle={itemStyle}
        primaryText={this.props.title}
        leftAvatar={
          <Avatar
           size={40}
           color={'rgba(255, 255, 255, 1)'}
           backgroundColor={this.getCommunityColor(this.props.source)}
           // src={faviconSrc}
          >
          {this.props.source.charAt(0).toUpperCase()}
          </Avatar>}
        secondaryText={moment(this.props.createdAt).fromNow()}
        onTouchTap={this.moveTo}
        />
    );
  },
});
