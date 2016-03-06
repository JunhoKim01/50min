var {
    List,
    } = MUI;

Lists = React.createClass({
  
  getItems() {
    return [
      { key: '01', title: 'sample 1', url: 'http://www.clien.net' },
      { key: '02', title: 'sample 2', url: 'http://www.clien.net' },
      { key: '03', title: 'sample 3', url: 'http://www.clien.net' },
    ];
  },
  renderItems() {
    return this.getItems().map((item) => {
      return <Item key={item.key} title={item.title} url={item.url} />;
    });
  },


  render() {

    return (
      <List>
        {this.renderItems()}
      </List>
      );
  },
});
