/** @jsx Tigrex.createElement */
import Tigrex from "../src/Tigrex";
import TigrexDOM from "../src/TigrexDOM";

const App1 = () => {
  return (
    <div>
      <p>App1</p>
    </div>
  );
};

class App2 extends Tigrex.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 1
    };
  }
  add() {
    this.setState({ number: this.state.number + 1 });
  }
  minus() {
    this.setState({ number: this.state.number - 1 });
  }
  render() {
    return (
      <div className="container">
        <p style={"padding: '100px'"}>{this.state.number}</p>
        <Display number={this.state.number} />
        <button onClick={this.add.bind(this)}>+</button>
        <button onClick={this.minus.bind(this)}>-</button>
      </div>
    );
  }
}

class Display extends Tigrex.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <p>+{this.props.number}+</p>;
  }
}

const App3 = (
  <div className="container">
    <p>APP3</p>
    <p>Hi, there</p>
  </div>
);

console.log("=========");
//TigrexDOM.render(<App1 id="app1" />, document.getElementById("root"));
TigrexDOM.render(<App2 id="app2" />, document.getElementById("root"));
//TigrexDOM.render(<App3 id="app3" />, document.getElementById("root"));
console.log("=========");
