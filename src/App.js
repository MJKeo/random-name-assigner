import { Routes, Route } from 'react-router-dom';
import './css/Main.css';
import './css/App.css';
import { Login }  from './screens/Login';
import { CreateRoom } from './screens/CreateRoom';
import { JoinRoom } from './screens/JoinRoom';
import { Lobby } from './screens/Lobby';
import { AssignName } from './screens/AssignName';

function App() {
  return (
    <div className="white-bg app-main-div">
        <Routes>
          <Route path="/" element={Login()} exact/>
          <Route path="/create-room" element={<CreateRoom />} exact/>
          <Route path="/join-room" element={<JoinRoom />} exact/>
          <Route path="/lobby" element={<Lobby />} exact/>
          <Route path="/assign-name" element={<AssignName />} exact/>
        </Routes>
    </div>
  );
}

export default App;
