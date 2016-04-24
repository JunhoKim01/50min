import React from 'react';

export default class NoData extends React.Component {
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
        <p> 데이터 수집 중 입니다... </p>
      </div>
    );
  }
}
