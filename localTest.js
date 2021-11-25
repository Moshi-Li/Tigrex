const isAttribute = (name) => !isEvent(name) && name != "children";

const htmlRoot = document.getElementById("root");
const Clock = new Array(250).fill(0).map(() => {
  domElement = document.createElement("p");
  htmlRoot.appendChild(domElement);
  return domElement;
});

const updateTime = () => {
  const time = new Date().getTime();
  Clock.forEach((dom) => {
    dom["innerHTML"] = time;
  });
};
updateTime();

const Fiber = () => {
  let index = 0;
  let length = Clock.length;
  const workloop = (deadline) => {
    const time = new Date().getTime();

    while (deadline.timeRemaining() / 2 > 0) {
      Clock[index]["innerHTML"] = time;

      if (index === length - 1) {
        index = 0;
      } else {
        index++;
      }
    }
    requestIdleCallback(workloop);
  };
  requestIdleCallback(workloop);
};

const SynTree = () => {
  setInterval(updateTime, 10);
};
