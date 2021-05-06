import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Room, Login, AddMember, AddRoom, Accept } from './components';

import RequireAuth from './middlewares/RequireAuth.jsx';
import IsNotAuth from './middlewares/IsNotAuth.jsx';

let socket;
let connectUser;

function App() {
  return (
    <Router>
      <Route exact path="/" component={IsNotAuth(Login)}/>
      <Route exact path="/room/create" component={RequireAuth(AddRoom)} />
      <Route exact path="/rooms" component={RequireAuth(Room)}/>
      <Route exact path="/rooms/:roomId" component={RequireAuth(Room)} />
      <Route exact path="/rooms/:roomId/invite" component={RequireAuth(AddMember)} />
      <Route exact path="/rooms/:roomId/invite/accept" component={RequireAuth(Accept)} />
      <Route exact path="/rooms/:roomId/invite/decline" component={RequireAuth(AddMember)} />
      <Route exact path="/login" component={IsNotAuth(Login)} />
    </Router>
  );
}

export default App;

