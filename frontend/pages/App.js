import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/admin" component={Admin} />
        <Route path="/Checkout" component={Checkout} />
        <Route path="/Book" component={Book} />
      </Switch>
    </Router>
  );
}

export default App;
