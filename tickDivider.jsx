var {
    Divider,
    ListItem,
  } = MUI;


TickDivider = React.createClass({
  propTypes: {
    tick: React.PropTypes.string.isRequired,
  },
  render() {
    return (
      <ListItem primaryText={this.props.tick} />
    );
  },
});
