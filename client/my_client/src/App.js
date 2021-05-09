import './App.css';
import { BrowserRouter as Router, Route, Register } from 'react-router-dom'

import { Room, Login, Register } from './components';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Login}/>
      <Route path="/register" component={Register}/>
      <Route path="/room/:roomId" component={Room} />
      <Route path="/rooms" component={Room} />
      <Route path="/login" component={Login} />
    </Router>
  );
}

export default App;
