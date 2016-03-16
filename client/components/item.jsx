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
    location = this.props.url;
  },
  getFavicon(source) {
    if (typeof source !== 'string') {
      throw new Meteor.Error('getFavicon source type is not string');
    }
    return 'images/' + source + '.ico';
  },
  render() {
    return (
      // TODO: click to link
      <ListItem
        sytle={itemStyle}
        primaryText={this.props.title}
        leftAvatar={<Avatar size={40} src={this.getFavicon(this.props.source)} />}
        secondaryText={moment(this.props.createdAt).fromNow()}
        onTouchTap={this.moveTo}
        />
    );
  },
});
