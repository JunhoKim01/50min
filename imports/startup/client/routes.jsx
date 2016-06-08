import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import AppNotFound from '../../ui/components/AppNotFound.jsx';
import AdminPage from '../../ui/pages/AdminPage.jsx';
import App from '../../ui/layouts/App.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="/pick/" component={App} />
    <Route path="/pick/:pickId" component={App} />
    <Route path="/pick/page/:page" component={App} />
    <Route path="/trend/" component={App} />
    <Route path="/admin" component={AdminPage} />
    <Route path="*" component={AppNotFound} />
  </Router>
);
