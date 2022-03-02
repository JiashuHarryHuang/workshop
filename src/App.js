import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Workshop 1</h1>
      <h3>First website</h3>
      <p>Check this out!</p>
      <img src="t2.jpg" alt="Santa photo" />
      <br />
      <a href="#" class="click"> Click me </a>
      <input class="click" type="button" onclick="sayHello()" value=" Click me too" />

      <script src="workshop1.js"></script>
    </div>
  );
}

export default App;
