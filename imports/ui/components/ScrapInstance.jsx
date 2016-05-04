import React from 'react';
import moment from 'moment';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import Snackbar from 'material-ui/lib/snackbar';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Styles from 'material-ui/lib/styles';
import FlatButton from 'material-ui/lib/flat-button';

const cardStyles = {
  margin: 8,
};

export default class ScrapInstance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSnackbarOpen: false,
      snackbarMessage: '',
      intervalMin: this.props.intervalMin,
      lastPage: this.props.lastPage,
      status: this.props.status,
      startTime: this.props.startTime,
    };
  }
  snackbarOpener() {
    this.setState({ isSnackbarOpen: true });
  }
  snackbarCloser() {
    this.setState({ isSnackbarOpen: false });
  }
  instanceStart() {
    // Start the scrap instance
  }
  instanceStop() {
    // Stop the scrap instance
    Meteor.call('stopScrap', this.props.communityName);
    this.setState({ snackbarMessage: `[${this.props.communityName}] Intance stopped` });
    this.snackbarOpener();
  }
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
    this.setState({
      snackbarMessage: `[${this.props.communityName}] Setting saved & instance restarted`,
    });
    this.snackbarOpener();
  }
  intervalMinChange(event, index, value) {
    this.setState({ intervalMin: value });
    // console.log(value);
  }
  lastPageChange(event, index, value) {
    this.setState({ lastPage: value });
    // console.log(value);
  }
  counterRenderer() {
    return (
      <ol>
        {Object.keys(this.props.totalItemCount).map((key) =>
          <li key={key}>
            {`${key}: ${this.props.totalItemCount[key]}`}
          </li>
        )}
      </ol>
    );
  }
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
                  onChange={(event, index, value) => this.intervalMinChange(event, index, value)}
                >
                  <MenuItem value={1} primaryText="1 minute" />
                  <MenuItem value={5} primaryText="5 minutes" />
                  <MenuItem value={10} primaryText="10 minutes" />
                  <MenuItem value={30} primaryText="30 minutes" />
                  <MenuItem value={60} primaryText="1 hour" />
                  <MenuItem value={360} primaryText="6 hours" />
                </SelectField>
              </div>
              <div>
                Scraps to :
                <SelectField
                  value={this.state.lastPage}
                  onChange={(event, index, value) => this.lastPageChange(event, index, value)}
                >
                  <MenuItem value={1} primaryText="1 page" />
                  <MenuItem value={2} primaryText="2 page" />
                  <MenuItem value={3} primaryText="3 page" />
                  <MenuItem value={4} primaryText="4 page" />
                  <MenuItem value={5} primaryText="5 page" />
                </SelectField>
              </div>
            </div>
          <h3>Status</h3>
            <div>Total items : {this.counterRenderer()} </div>
        </CardText>
        <CardActions style={{ display: 'flex', justifyContent: 'spaceBetween' }}>
          <FlatButton label="Save & Go" onClick={() => this.instanceSave()} />
          <FlatButton label="Start" />
          <FlatButton label="Stop" onClick={() => this.instanceStop()} />
        </CardActions>
      </Card>
      <Snackbar
        open={this.state.isSnackbarOpen}
        message={this.state.snackbarMessage}
        autoHideDuration={3000}
        onRequestClose={() => this.snackbarCloser()}
        style={{ width: 'maxContent' }}
      />
      </div>
    );
  }
}

ScrapInstance.propTypes = {
  communityName: React.PropTypes.string.isRequired,
  intervalMin: React.PropTypes.number.isRequired,
  status: React.PropTypes.bool.isRequired,
  startTime: React.PropTypes.number.isRequired,
  lastPage: React.PropTypes.number.isRequired,
  totalItemCount: React.PropTypes.object.isRequired,
};
