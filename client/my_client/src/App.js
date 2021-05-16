import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Room, Login, Register, Confirm, AddMember, AddRoom, Accept, Decline } from './components';

import RequireAuth from './middlewares/RequireAuth.jsx';
import IsNotAuth from './middlewares/IsNotAuth.jsx';

function App() {
  return (
    <Router>
      <Route exact path="/" component={IsNotAuth(Login)}/>
      <Route exact path="/room/create" component={RequireAuth(AddRoom)} />
      <Route exact path="/rooms" component={RequireAuth(Room)}/>
      <Route exact path="/rooms/:roomId" component={RequireAuth(Room)} />
      <Route exact path="/rooms/:roomId/invite" component={RequireAuth(AddMember)} />
      <Route exact path="/rooms/:roomId/invite/accept" component={RequireAuth(Accept)} />
      <Route exact path="/rooms/:roomId/invite/decline" component={RequireAuth(Decline)} />
      <Route exact path="/login" component={IsNotAuth(Login)} />
      <Route exact path="/register" component={IsNotAuth(Register)}/>
      <Route path="/confirm/:user" component={IsNotAuth(Confirm)} />
    </Router>
  );
}

export default App;
