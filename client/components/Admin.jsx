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
  SelectField,
  MenuItem,
} = MUI;


const cardStyles = {
  
  // minHeight: 400,
  margin: 8,
};

ScrapInstance = React.createClass({
  propTypes: {
    communityName: React.PropTypes.string.isRequired,
    // types: React.PropTypes.string.isRequired,
    // regexp: React.PropTypes.string.isRequired,
    intervalMin: React.PropTypes.number.isRequired,
    lastPage: React.PropTypes.number.isRequired,
    totalItemCount: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return {
      open: false,
      snackbarMessage: '',
      intervalMin: this.props.intervalMin,
      lastPage: this.props.lastPage,
      status: this.props.status,
      startTime: this.props.startTime,
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
    Meteor.call('stopScrap', this.props.communityName);
    this.setState({ snackbarMessage: `[${this.props.communityName}] Intance stopped` });
    this.snackbarOpener();
  },
  instanceSave() {
    // Save current settings and re-start the instance
    // console.log(this.state.intervalMin);
    // console.log(this.state.lastPage);
    Meteor.call(
      'changeCommunityScrapOption',
      this.props.communityName,
      this.state.intervalMin,
      this.state.lastPage
    );
    this.setState({ snackbarMessage: `[${this.props.communityName}] Setting saved & instance restarted` });
    this.snackbarOpener();
  },
  intervalMinChange(event, index, value) {
    this.setState({ intervalMin: value });
    // console.log(value);
  },
  lastPageChange(event, index, value) {
    this.setState({ lastPage: value });
    // console.log(value);
  },
  counterRenderer() {
    return (
      <ol>
        {Object.keys(this.props.totalItemCount).map((key) => {
          return (<li key={key}>{`${key}: ${this.props.totalItemCount[key]}`}</li>);
        })}
      </ol>
    );
  },
  render() {
    return (
      <div>
      <Card style={cardStyles}>
        <CardTitle
          title={`${this.props.communityName}`}
          subtitle={this.props.status ? 'LIVE' : 'STOP'}
          subtitleColor={this.props.status ? Styles.Colors.green500 : Styles.Colors.red500}
        />
        <CardText>
          <h3>Start time</h3>
            <div>{moment(this.props.startTime).format('LLLL')}</div>
          <h3>Options</h3>
            <div style={{ display: 'inlineBlock' }}>
              <div>
                Scraps every :
                <SelectField
                  value={this.state.intervalMin}
                  onChange={this.intervalMinChange}
                >
                  <MenuItem value={1} primaryText="1 minute"/>
                  <MenuItem value={5} primaryText="5 minutes"/>
                  <MenuItem value={10} primaryText="10 minutes"/>
                  <MenuItem value={30} primaryText="30 minutes"/>
                  <MenuItem value={60} primaryText="1 hour"/>
                  <MenuItem value={360} primaryText="6 hours"/>
                </SelectField>
              </div>
              <div>
                Scraps to :
                <SelectField
                  value={this.state.lastPage}
                  onChange={this.lastPageChange}
                >
                  <MenuItem value={1} primaryText="1 page"/>
                  <MenuItem value={2} primaryText="2 page"/>
                  <MenuItem value={3} primaryText="3 page"/>
                  <MenuItem value={4} primaryText="4 page"/>
                  <MenuItem value={5} primaryText="5 page"/>
                </SelectField>
              </div>
            </div>
          <h3>Status</h3>
            <div>Total items : {this.counterRenderer()} </div>
        </CardText>
        <CardActions style={{ display: 'flex', justifyContent: 'spaceBetween' }}>
          <FlatButton label="Save & Go" onClick={this.instanceSave} />
          <FlatButton label="Start" />
          <FlatButton label="Stop" onClick={this.instanceStop} />
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
  instancesRenderer() {
    return (
      this.data.status.map((instance) =>
        <ScrapInstance
          key={instance._id}
          communityName={instance.communityName}
          types={instance.types}
          status={instance.status}
          startTime={instance.startTime}
          // regexp={instance.regexp}
          intervalMin={instance.intervalMin}
          lastPage={instance.lastPage}
          totalItemCount={instance.itemCount}
        />
      ));
  },
  render() {
    return (
      <div>
        <AppBar title="Admin" />
        <div style={{ display: 'flex', justifyContent: 'spaceBetween', flexWrap: 'wrap' }}>
          {this.instancesRenderer()}
        </div>
        Reset DB : <FlatButton label="Reset" onClick={this.remove}/>
      </div>
    );
  },
});


