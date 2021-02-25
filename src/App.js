import React, { Component }from 'react';
import TagSelection from "./components/TagSelection.js";
import Artist from "./components/Artist.js";
import Album from "./components/Album.js";
import './App.css';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={TagSelection} />
          <Route exact path="/artist/:artistName" component={Artist} />
          <Route exact path="/artist/:artistName/:albumName" component={Album} />
        </Switch>
      </Router>

  )};
}

export default App;
