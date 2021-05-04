import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Room, Login, AddMember, AddRoom } from './components';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Login}/>
      <Route exact path="/room/create" component={AddRoom} />
      <Route exact path="/rooms" component={Room} />
      <Route exact path="/rooms/:roomId" component={Room} />
      <Route exact path="/rooms/:roomId/invite" component={AddMember} />
      <Route exact path="/login" component={Login} />
    </Router>
  );
}

export default App;
