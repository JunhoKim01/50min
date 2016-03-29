import React from 'react';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';

export default class LoadingMore extends React.Component {
  render() {
    return (
      <div style={{ position: 'relative' }}>
        <RefreshIndicator
          size={40}
          left={-20}
          top={0}
          status={'loading'}
          style={{ marginLeft: '50%' }}
        />
      </div>
      );
  }
}
