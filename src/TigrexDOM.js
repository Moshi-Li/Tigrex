export const render = (element, parentDom) => {
  const FUNCTION_ELEMENT = "FUNCTION_ELEMENT";
  const WRAPPER_ELEMENT = "WRAPPER_ELEMENT";
  const HTML_ELEMENT = "HTML_ELEMENT";
  const TEXT_ELEMENT = "TEXT ELEMENT";
  const isListener = name => name.startsWith("on");
  const isAttribute = name => !isListener(name) && name != "children";
  const getTypeProps = element => {
    let { type, props } = element;
    if (typeof type === "string") {
      if (type === TEXT_ELEMENT) {
        return { type: TEXT_ELEMENT, props: props };
      } else {
        return { type: HTML_ELEMENT, props: props };
      }
    } else {
      if (type.type) {
        return { type: WRAPPER_ELEMENT, props: props };
      } else {
        return { type: FUNCTION_ELEMENT, props: props };
      }
    }
  };
  //Rainbow Six 7 PC China STAGING
  const { type, props } = getTypeProps(element);
  switch (type) {
    case WRAPPER_ELEMENT:
      render(element.type, parentDom);
      break;
    case HTML_ELEMENT:
      const node = document.createElement(element.type);
      Object.keys(props)
        .filter(isListener)
        .forEach(name => {
          const eventType = name.toLowerCase().substring(2);
          node.addEventListener(eventType, props[name]);
        });
      Object.keys(props)
        .filter(isAttribute)
        .forEach(name => {
          node[name] = props[name];
        });

      const childElements = props.children || [];
      childElements.forEach(childElement => render(childElement, node));
      parentDom.appendChild(node);
      break;
    case TEXT_ELEMENT:
      parentDom.appendChild(document.createTextNode(props.nodeValue));
      break;
    case FUNCTION_ELEMENT:
      console.log(type);
      render(element.type(), parentDom);
  }
};

export default { render };
