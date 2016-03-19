const {
    ListItem,
    Avatar,
  } = MUI;

const itemStyle = {
  paddingTop: 8,
  paddingBottm: 8,
};


Item = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    createdAt: React.PropTypes.number.isRequired,
    source: React.PropTypes.string.isRequired,
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
  render() {
    return (
      // TODO: click to link
      <ListItem
        sytle={itemStyle}
        primaryText={this.props.title}
        leftAvatar={<Avatar size={40} src={communities[this.props.source]} />}
        secondaryText={moment(this.props.createdAt).fromNow()}
        onTouchTap={this.moveTo}
        />
    );
  },
});
