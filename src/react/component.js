/**
 * * class component 组件基类
 */

import { updateDom } from "./react-dom";

class Component {
  static isClassComponent = true;

  constructor(props) {
    this.props = props;
    this.state = {};
    this.vnode = null; // 组件实例对应的虚拟节点
    this.updater = new Updater(this);
  }

  setState(state) {
    if (typeof state === "function") {
      // todo: setState 传入函数作为参数时
    } else if (typeof state === "object") {
      this.updater.collectState(state);
    }
  }

  forceUpdate() {
    const newVNode = this.render();
    const currentVNode = this.vnode;
    this.vnode = newVNode;

    updateDom(currentVNode, newVNode);
  }
}

/**
 * * 状态批量更新队列
 */

const UpdateQueue = {
  isBatch: false,
  updaters: [],
  batchUpdate: () => {
    UpdateQueue.updaters.forEach((updater) => updater.emitUpdate());
    UpdateQueue.updaters = [];
  },
};

/**
 * * 状态更新器
 */
class Updater {
  constructor(component) {
    this.component = component; // 持有组件实例
    this.penddingStates = []; // 所有待更新的状态数据
  }

  // 收集待更新状态数据
  collectState(state) {
    this.penddingStates.push(state);
    this.emitUpdate();
  }

  // 触发更新
  emitUpdate() {
    if (UpdateQueue.isBatch) {
      UpdateQueue.updaters.push(this);
    } else {
      this.update();
    }
  }

  // 更新
  update() {
    if (this.penddingStates.length > 0) {
      shouldUpdateComponent(this.component, null, this.getState()); // this.getState();触发待更新状态数据合并
    }
  }

  // 合并&获取状态数据
  getState() {
    let { state } = this.component;
    this.penddingStates.forEach((penddingState) => {
      state = { ...state, ...penddingState };
    });
    this.penddingStates = []; // 合并收集的待更新数据后清空
    return state;
  }
}

/**
 *  更新组件
 */
const shouldUpdateComponent = (component, nextProps, nextState) => {
  component.state = nextState;

  let shouldUpdate = true;
  if (component.shouldComponentUpdate) {
    shouldUpdate = component.shouldComponentUpdate(nextProps, nextState);
  }

  // 生命周期狗子
  if (shouldUpdate) {
    // 将要更新勾子
    component.componentWillUpdate && component.componentWillUpdate();

    // 执行更新
    component.forceUpdate();

    // 更新完毕狗子
    component.componentDidUpdate && component.componentDidUpdate();
  }
};

export default Component;
export { UpdateQueue };
