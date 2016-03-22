const {
  AppBar,
  Divider,
  FlatButton,
  TextField,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText,
  Toggle,
  Styles,
  Snackbar,
} = MUI;


const cardStyles = {
  width: 350,
  // minHeight: 400,
  margin: 8,
};

ScrapInstance = React.createClass({
  propTypes: {
    communityName: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    regexp: React.PropTypes.string.isRequired,
    intervalMin: React.PropTypes.number.isRequired,
    lastPage: React.PropTypes.number.isRequired,
    totalItemCount: React.PropTypes.number.isRequired,
  },
  getInitialState() {
    return {
      open: false,
      snackbarMessage: '',
    };
  },
  snackbarOpener() {
    this.setState({ open: true });
  },
  snackbarCloser() {
    this.setState({ open: false });
  },
  instanceStart() {
    // Start the scrap instance
  },
  instanceStop() {
    // Stop the scrap instance
  },
  instanceSave() {
    // Save current settings and re-start the instance
    this.setState({ snackbarMessage: 'Save & Go' });
    this.snackbarOpener();
  },
  render() {
    return (
      <div>
      <Card style={cardStyles}>
        <CardTitle
          title={`${this.props.communityName} / ${this.props.type.toUpperCase()}`}
          subtitle={'LIVE'}
          subtitleColor={Styles.Colors.green500}
        />
        <CardText>
          <h3>Options</h3>
            <div style={{ display: 'inlineBlock' }}>
              <div>Scraps every : <TextField style={{ width: 'maxContent' }} defaultValue={this.props.intervalMin}/> min</div>
              <div>Scraps <TextField style={{ width: 'maxContent' }} defaultValue={this.props.lastPage}/> pages </div>
            </div>
          <h3>Status</h3>
            <div>Total items : {this.props.totalItemCount}</div>
        </CardText>
        <CardActions style={{ display: 'flex', justifyContent: 'spaceBetween' }}>
          <FlatButton label="Save & Go" onClick={this.instanceSave}/>
          <FlatButton label="Start" />
          <FlatButton label="Stop" />
        </CardActions>
      </Card>
      <Snackbar
        open={this.state.open}
        message={this.state.snackbarMessage}
        autoHideDuration={3000}
        onRequestClose={this.snackbarCloser}
        style={{ width: 'maxContent' }}
      />
      </div>
    );
  },

});

Admin = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const statusHandle = Meteor.subscribe('status');
    return {
      statusReady: statusHandle.ready(),
      status: Status.find().fetch(),
    };
  },
  remove() {
    Meteor.call('remove');
  },
  instancesRender() {
    return (
      this.data.status.map((instance) =>
        <ScrapInstance 
          key={instance._id}
          communityName={instance.communityName}
          type={instance.type}
          regexp={instance.regexp}
          intervalMin={instance.intervalMin}
          lastPage={instance.lastPage}
          totalItemCount={instance.totalItemCount}
        />
      ));
  },
  render() {
    return (
      <div>
        <AppBar title="Admin" />
        <div style={{ display: 'flex', justifyContent: 'spaceBetween', flexWrap: 'wrap' }}>
          {this.instancesRender()}
        </div>
        Reset DB : <FlatButton label="Reset" onClick={this.remove}/>
      </div>
    );
  },
});


