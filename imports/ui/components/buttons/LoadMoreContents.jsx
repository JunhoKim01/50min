import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

export default class LoadMoreContents extends React.Component {
  render() {
    return (
      <RaisedButton
        fullWidth={true}
        style={{ height: '48px' }}
        label="더 보기..."
        onTouchTap={() => this.props.loadMore()}
      />
      );
  }
}

LoadMoreContents.propTypes = {
  loadMore: React.PropTypes.func.isRequired,
};
