import logo from './logo.svg';
import './App.css';
import Home from './Components/Home';
import Admin from './Components/Admin';
import Book from './Components/Book';
import Checkout from './Components/Checkout';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/Admin" component={Admin} />
        <Route path="/Checkout" component={Checkout} />
        <Route path="/Book" component={Book} />
      </Switch>
    </Router>
  );
}


export default App;
