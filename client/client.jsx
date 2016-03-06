if (Meteor.isClient) {
  Meteor.startup(() => {

    
    ConsoleMe.subscribe();

    // User Meteor.startup to render the component after the page is ready
    ReactDOM.render(<App />, document.getElementById('render-target'));
  });

  Template.body.helpers({
    
  });

  Template.body.events({
    
  });
}
