import React from 'react';
import CircularProgress from 'material-ui/lib/circular-progress';
  
export default class LoadingContents extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '65vh',
        }}
      >
        <CircularProgress size={1.5} />
      </div>
    );
  }
}
