import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Room, Login } from './components';
import Register from './components/Register/Register';
import Confirm from './components/Register/Confirm'

function App() {
  return (
    <Router>
      <Route exact path="/" component={Login}/>
      <Route path="/register" component={Register}/>
      <Route path="/room/:roomId" component={Room} />
      <Route path="/rooms" component={Room} />
      <Route path="/login" component={Login} />
      <Route path="/confirm/:user" component={Confirm} />
    </Router>
  );
}

export default App;
