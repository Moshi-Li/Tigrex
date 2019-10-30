/** @jsx Tigrex.createElement */
import Tigrex from "../src/Tigrex";
import TigrexDOM from "../src/TigrexDOM";

const App1 = () => {
  return (
    <div id="3">
      <p>hello</p>
      <p>world</p>
      inline_as_const
    </div>
  );
};
const Test1 = () => {
  return <p>!</p>;
};
const Test2 = <div>312</div>;
const App2 = (
  <div id="213">
    <p>hello</p>
    <p>world</p>
    <Test1 id="1" />
    inline_as_const
    <Test2 id="2" />
  </div>
);

TigrexDOM.render(<App1 id="yahah" />, document.getElementById("root"));
console.log("=========");
//ReactDOM.render(<App2 />, document.getElementById("root"));
