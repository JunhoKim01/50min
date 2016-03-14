const {
    ListItem
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
  },
  moveTo() {
    location = this.props.url;
  },
  render() {
    return (
      // TODO: click to link
      <ListItem
        sytle={itemStyle}
        primaryText={'[' + this.props.number + '] ' + this.props.title}
        secondaryText={moment(this.props.createdAt).fromNow()}
        onTouchTap={this.moveTo}
        />
    );
  },
});
