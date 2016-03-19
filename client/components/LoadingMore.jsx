const {
  RefreshIndicator,
} = MUI;

LoadingMore = React.createClass({
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
  },
});
