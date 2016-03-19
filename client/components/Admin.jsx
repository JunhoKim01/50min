const {
  FlatButton,
} = MUI;

Admin = React.createClass({
  remove() {
    Meteor.call('remove');
  },
  render() {
    return (
      <div>

        <FlatButton label="Reset" onClick={this.remove}/>
      </div>
    );
  },
});
