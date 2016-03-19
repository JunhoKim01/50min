const {
  CircularProgress,
} = MUI;

Loading = React.createClass({
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
  },
});
