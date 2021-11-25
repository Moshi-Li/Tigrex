import { Component } from "./Tigrex";

export const CLASS_COMPONENT = "CLASS_COMPONENT";
export const HOOK_COMPONENT = "HOOK_COMPONENT";
export const WRAPPER_ELEMENT = "WRAPPER_ELEMENT";
export const HTML_ELEMENT = "HTML_ELEMENT";
export const TEXT_ELEMENT = "TEXT ELEMENT";

const getElementType = (element) => {
  let { type } = element;

  if (typeof type === "string") {
    if (type === TEXT_ELEMENT) {
      return TEXT_ELEMENT;
    } else {
      return HTML_ELEMENT;
    }
  } else {
    if (type.type) {
      return WRAPPER_ELEMENT;
    } else if (type.prototype instanceof Component) {
      return CLASS_COMPONENT;
    } else {
      return HOOK_COMPONENT;
    }
  }
};

export const reconcile = (parentDom, instance, element) => {
  if (instance == null) {
    // Create instance
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    // Remove instance
    parentDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type !== element.type) {
    // Replace instance
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  } else if (typeof element.type === "string") {
    // Update instance
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    //Update composite instance
    instance.publicInstance.props = element.props;
    const childElement =
      getElementType(element) === CLASS_COMPONENT
        ? instance.publicInstance.render()
        : instance.element.type;
    const oldChildInstance = instance.childInstance;
    const childInstance = reconcile(parentDom, oldChildInstance, childElement);
    instance.dom = childInstance.dom;
    instance.childInstance = childInstance;
    instance.element = element;
    return instance;
  }
};

const instantiate = (element) => {
  const elementType = getElementType(element);

  if (elementType === CLASS_COMPONENT) {
    const instance = {};
    const publicInstance = createPublicInstance(element, instance);
    const childElement = publicInstance.render();
    const childInstance = instantiate(childElement);
    const dom = childInstance.dom;

    Object.assign(instance, { dom, element, childInstance, publicInstance });
    console.log(instance);
    return instance;
  } else if (elementType === HOOK_COMPONENT) {
    const dom = document.createElement("p");
    dom.innerHTML = "Do not support hooks currently";
    return { dom, element, childInstance: [] };
  } else if (elementType === HTML_ELEMENT) {
    const { type, props } = element;
    const dom = document.createElement(type);
    updateDomProperties(dom, [], props);

    const childElements = props.children || [];
    const childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map((childInstance) => childInstance.dom);
    childDoms.forEach((childDom) => dom.appendChild(childDom));
    const instance = { dom, element, childInstances };

    return instance;
  } else if (elementType === TEXT_ELEMENT) {
    const { props } = element;
    const dom = document.createTextNode("");
    updateDomProperties(dom, [], props);

    const childElements = props.children || [];
    const childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map((childInstance) => childInstance.dom);
    childDoms.forEach((childDom) => dom.appendChild(childDom));
    const instance = { dom, element, childInstances };

    return instance;
  } else if (elementType === WRAPPER_ELEMENT) {
    const { type, props } = element;
    const instance = {};
    const childInstance = instantiate(type);
    const dom = childInstance.dom;
    const publicInstance = {
      props,
      __internalInstance: instance,
    };
    Object.assign(instance, { dom, element, childInstance, publicInstance });
    return instance;
  } else {
    const instance = {};
    const dom = document.createElement("p");
    dom.innerHTML = "error parsing component";
    Object.assign(instance, { dom, element });
    return instance;
  }
};

const reconcileChildren = (instance, element) => {
  const dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances = [];
  const count = Math.max(childInstances.length, nextChildElements.length);
  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }
  return newChildInstances.filter((instance) => instance != null);
};

const updateDomProperties = (dom, prevProps, nextProps) => {
  const isEvent = (name) => name.startsWith("on");
  const isAttribute = (name) => !isEvent(name) && name != "children";

  // Remove event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove attributes
  Object.keys(prevProps)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = null;
    });

  // Set attributes
  Object.keys(nextProps)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
};

const createPublicInstance = (element, internalInstance) => {
  const { type, props } = element;
  const publicInstance = new type(props);
  publicInstance.__internalInstance = internalInstance;
  console.log(publicInstance);
  return publicInstance;
};

export const updateInstance = (internalInstance) => {
  const parentDom = internalInstance.dom.parentNode;
  const element = internalInstance.element;
  reconcile(parentDom, internalInstance, element);
};

let rootInstance = null;

export const render = (element, parentDOM) => {
  const preInstance = rootInstance;
  const nextInstance = reconcile(parentDOM, preInstance, element);
  rootInstance = nextInstance;
};

export default { render };
