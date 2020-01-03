import { reconcile } from "./Tigrex";

let rootInstance = null;

export const render = (element, parentDOM) => {
  console.log("\n=====element: ");
  console.log(element);
  const preInstance = rootInstance;
  const nextInstance = reconcile(parentDOM, preInstance, element);
  rootInstance = nextInstance;
};

export default { render };
