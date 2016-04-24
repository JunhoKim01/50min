import React from 'react';

import AppBar from 'material-ui/lib/app-bar';
import FlatButton from 'material-ui/lib/flat-button';

import Loading from './Loading.jsx';
import NoData from './NoData.jsx';
import ScrapInstance from './ScrapInstance.jsx';

export default class Admin extends React.Component {
  remove() {
    Meteor.call('remove');
  }
  instancesRenderer() {
    return (
      this.props.instances.map((instance) =>
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
  }
  rednerSwitcher() {
    let renderResult = null;
    if (! this.props.instancesReady && (this.props.instances.length === 0)) {
      // First loading
      renderResult = <Loading />;
    } else if (this.props.instancesReady && (this.props.instances.length === 0)) {
      // No-data
      renderResult = <NoData />;
    } else if (! this.props.instancesReady && (this.props.instances.length !== 0)) {
      // Loading more
      renderResult = this.instancesRenderer();
    } else if (this.props.instancesReady && (this.props.instances.length !== 0)) {
      // Load complete
      renderResult = this.instancesRenderer();
    }
    return renderResult;
  }
  render() {
    return (
      <div>
        <AppBar title="Admin" />
        <div style={{ display: 'flex', justifyContent: 'spaceBetween', flexWrap: 'wrap' }}>
          { this.rednerSwitcher() }
        </div>
        Reset DB : <FlatButton label="Reset" onClick={this.remove} />
      </div>
    );
  }
}

Admin.propTypes = {
  instancesReady: React.PropTypes.bool.isRequired,
  instances: React.PropTypes.array.isRequired,
};
