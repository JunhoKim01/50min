var {
    Tabs,
    Tab,
    List,
    Divider,
    CircularProgress,
    RefreshIndicator,
    } = MUI;

Pages = React.createClass({


  renderItems(database) {
    if (database === undefined) {
      throw new Meteor.Error('database undefined');
    }
    return (
      <List>
        {database.map(item =>
         <Item key={item._id} title={item.title} url={item.url} createdAt={item.createdAt}/>)}
        
      </List>);
  },
  renderLists(type) {
    switch (type) {
      case 'jpg':
        return this.props.data.subsReady
          ? this.renderItems(this.props.data.listsJPG) : <CircularProgress />;
      case 'gif':
        return this.props.data.subsReady
          ? this.renderItems(this.props.data.listsGIF) : <CircularProgress />;
      case 'avi':
        return this.props.data.subsReady
          ? this.renderItems(this.props.data.listsAVI) : <CircularProgress />;
      case 'txt':
        return this.props.data.subsReady
          ? this.renderItems(this.props.data.listsTXT) : <CircularProgress />;
      default:
        throw Meteor.Error('INVALID type');
    }
  },
  renderTab(type) {
    return (
      <Tab label={type.toUpperCase()}>
        {this.renderLists(type)}
        <RefreshIndicator left={70} top={0} status="loading"
        style={{ display: 'inline-block', position: 'relative', margin: '0 auto' }}/>
      </Tab>
      );
  },

  render() {
    return (
      <Tabs>
        {this.renderTab('jpg')}
        {this.renderTab('gif')}
        {this.renderTab('avi')}
      </Tabs>

    );
  },
});
