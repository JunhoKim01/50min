import React from 'react';
import { Router, Route, browserHistory, Redirect } from 'react-router';

// route components
import AppNotFound from '../../ui/components/AppNotFound.jsx';
import AdminPage from '../../ui/pages/AdminPage.jsx';
import App from '../../ui/layouts/App.jsx';


export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="/:type/:communityName/:postId" component={App} />
    <Route path="/admin" component={AdminPage} />
    <Route path="*" component={AppNotFound} />
  </Router>
);
