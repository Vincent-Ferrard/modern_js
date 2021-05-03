import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Room } from './components';

function App() {
  return (
    <Router>
      <Route path="/room/:roomId" component={Room} />
      <Route path="/rooms" component={Room} />
    </Router>
  );
}

export default App;
