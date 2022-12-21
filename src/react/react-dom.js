/**
 * * 虚拟节点处理
 */

import { isVNodeObj } from "./util";
import { addEvent } from "./event";

/**
 * * 把虚拟节点渲染到指定容器中
 * @param {*} vnode 虚拟节点
 * @param {*} container 挂载容器
 */
const render = (vnode, container) => {
  mount(vnode, container);
};

// 初始挂载节点
// 根据虚拟节点生成真实节点，添加到容器节点中
const mount = (vnode, container) => {
  const dom = createDom(vnode);
  container.appendChild(dom);
  // 组件挂载完毕狗子
  dom.componentDidMount && dom.componentDidMount();
};

// 更新节点
const updateDom = (oldVNode, newVNode) => {
  const newDom = createDom(newVNode);
  const oldDom = oldVNode.dom;
  const parentDom = oldDom.parentNode;

  parentDom.replaceChild(newDom, oldDom);
};

// 创建真实节点
const createDom = (vnode) => {
  let dom;
  if (isVNodeObj(vnode)) {
    const { props, ref, type } = vnode;
    // 处理函数式组件和类组件
    if (typeof type === "function") {
      if (type.isClassComponent) {
        // 类组件
        return handleClassVNode(vnode);
      } else {
        // 函数式组件
        return handleFuncVNode(vnode);
      }
    } else if (type && typeof type.type === "symbol") {
      // 处理ForwardRef函数组件
      return handleForwardFuncVNode(vnode);
    } else {
      // 创建Dom节点
      dom = document.createElement(type);

      // 添加属性
      if (props) {
        // 处理dom属性
        updateAttr(dom, {}, props);

        // 处理子节点
        updateChildren(dom, props.children);
      }

      if (ref) {
        // 原生组件ref
        vnode.ref.current = dom;
      }
      vnode.dom = dom;
    }
  } else {
    // 创建文本节点
    dom = document.createTextNode(vnode);
  }

  return dom;
};

// 处理类组件虚拟节点
const handleClassVNode = (clsNode) => {
  const { type: ClassComponent, props, ref } = clsNode;
  const clsInstance = new ClassComponent(props);
  if (ref) {
    // 类组件ref
    clsNode.ref.current = clsInstance;
  }

  // 组件将要挂在狗子
  clsInstance.componentWillMount && clsInstance.componentWillMount();
  const vnode = clsInstance.render();
  clsInstance.vnode = vnode;

  const dom = createDom(vnode);
  // 把组件实例的”组件挂在完毕狗子“添加到真实dom上，等待真实dom添加到页面上之后调用
  if (clsInstance.componentDidMount) {
    dom.componentDidMount = clsInstance.componentDidMount;
  }
  return dom;
};

// 处理函数式组件虚拟节点
const handleFuncVNode = (vnode) => {
  const { type: FuncComponent, props } = vnode;
  const vDom = FuncComponent(props);

  return createDom(vDom);
};

// 处理ForwardRef组件
const handleForwardFuncVNode = (forwardRefVNode) => {
  const {
    props,
    ref,
    type: { render },
  } = forwardRefVNode;
  const vnode = render(props, ref);
  return createDom(vnode);
};

// 更新节点属性
const updateAttr = (dom, oldProps, newProps) => {
  // 删除新props中不存在的旧属性
  for (const prop in oldProps) {
    if (Object.hasOwnProperty.call(oldProps, prop) && !newProps[prop]) {
      dom[prop] = null;
    }
  }

  // 添加新props
  for (const prop in newProps) {
    if (Object.hasOwnProperty.call(newProps, prop)) {
      if (prop === "children") {
        continue;
      } else if (prop === "style") {
        const styleObj = newProps[prop];
        for (const attr in styleObj) {
          if (Object.hasOwnProperty.call(styleObj, attr)) {
            dom.style[attr] = styleObj[attr];
          }
        }
      } else if (prop.startsWith("on")) {
        // dom[prop.toLowerCase()] = newProps[prop];
        addEvent(dom, prop.toLowerCase(), newProps[prop]);
      } else {
        const element = newProps[prop];
        dom[prop] = element;
      }
    }
  }
};

// 更新子节点
const updateChildren = (dom, children) => {
  if (children === undefined || children === null) {
    return;
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      mount(child, dom);
    });
  } else {
    mount(children, dom);
  }
};

const ReactDOM = {
  render,
};

export default ReactDOM;

export { updateDom };
