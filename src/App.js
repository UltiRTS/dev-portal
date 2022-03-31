import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

const ws = new WebSocket("ws://178.18.243.134:10083");
ws.onopen = ev => {
  console.log("connected");
}

function App() {
  const [msg, setMsg] = useState({});

  ws.onmessage = ev => {
    try {
      const tmp = JSON.parse(ev.data);
      setMsg(tmp);
    } catch(e) {
      console.log(e);
      console.log("droping unknown format: ", ev.data);
    }
  }

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Home msg={JSON.stringify(msg)}/>} />
        </Routes>
      </div>
    </Router>
  );
}

const login = (username, password) => {
  const msg = {
      action: 'register',
      parameters: {
          username,
          password,
      }
  }

  ws.send(JSON.stringify(msg));
}


const hello = () => {
  console.log("Hello");
}

function Home(props) {
  return (
    <div>
      <div>newest message: {props.msg}</div>
      <button onClick={ ()=>{login('test', 'testpassword')} }>login</button>
    </div>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export default App;
