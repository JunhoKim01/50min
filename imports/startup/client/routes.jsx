import React from 'react';
import { Router, Route, browserHistory, Redirect } from 'react-router';

// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';
import AppNotFound from '../../ui/components/AppNotFound.jsx';
import AdminPage from '../../ui/pages/AdminPage.jsx';


export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer} />
    <Route path="/:type/:communityName/:postId" component={AppContainer} />
    <Route path="/admin" component={AdminPage} />
    <Route path="*" component={AppNotFound} />
  </Router>
);
