import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';

import NotFound from './Pages/NotFound/NotFound';
import Home from './Pages/Home/Home';

class App extends Component {

	render() {
		return (
			<div className="App">

				<Switch>
					<Route exact path="/" component={Home}/>
					{/* <Route exact path="/create" component={Create}/> */}
					{/* <Route exact path="/game/:hash" component={Single}/> */}

					{/* 404 page */}
					<Route component={NotFound} />
				</Switch>

			</div>
		);
	}
}

export default App;
