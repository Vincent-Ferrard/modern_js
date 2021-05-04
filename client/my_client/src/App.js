import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Room, Login } from './components';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Login}/>
      <Route path="/room/:roomId" component={Room} />
      <Route path="/rooms" component={Room} />
      <Route path="/login" component={Login} />
    </Router>
  );
}

export default App;
