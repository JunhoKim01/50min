var {
    Tabs,
    Tab,
  } = MUI;

Page = React.createClass({

    

  render() {
    return (
      <Tabs>
        <Tab label="JPG">
          <div>
            <Lists />
          </div>
        </Tab>
        <Tab label="GIF" >
          <div>
            <Lists />
          </div>
        </Tab>
        <Tab label="AVI">
          <div>
            <Lists />
          </div>
        </Tab>
      </Tabs>
    );
  },
});
