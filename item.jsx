var {
    ListItem
  } = MUI;


Item = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
  },
  moveTo() {

    // Move to the url
    location = this.props.url;
    
  },
  render() {
    return (
      // TODO: click to link
      <ListItem primaryText={this.props.title} onClick={this.moveTo}/>
    
    );
  },
});
