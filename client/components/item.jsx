var {
    ListItem
  } = MUI;


Item = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    createdAt: React.PropTypes.number.isRequired,
  },
  moveTo() {
    location = this.props.url;
  },
  render() {
    return (
      // TODO: click to link
      <ListItem
        primaryText={this.props.title}
        secondaryText={moment(this.props.createdAt).fromNow()}
        onClick={this.moveTo} />
    );
  },
});
