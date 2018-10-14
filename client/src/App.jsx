import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';

import NotFound from './Pages/NotFound/NotFound';
import Home from './Pages/Home/Home';
import Create from './Pages/Create/Create';
import Single from './Pages/Single/Single';

class App extends Component {

	render() {
		return (
			<div className="App">
				<Switch>
					<Route exact path="/" component={Home}/>
					<Route exact path="/create" component={Create}/>
					<Route exact path="/game/:hash" component={Single}/>

					{/* 404 page */}
					<Route component={NotFound} />
				</Switch>

			</div>
		);
	}
}

export default App;
