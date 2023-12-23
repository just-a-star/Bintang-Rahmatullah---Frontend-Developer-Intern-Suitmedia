import React from "react";

import { Banner, ListPost } from "./container";
import {Navbar} from "./components";
import './App.scss';
const App = () => {
  return (
  <div className="app">
    <Navbar />
    <Banner />
    <ListPost />
  </div>
  );
};

export default App;
