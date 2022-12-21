/**
 * * 合成事件
 * 把所有的事件都绑定到document上（新版React貌似是在App的root节点上），
 * 通过委托的方式，所有事件冒泡到document时进行处理；
 * 在生成Dom元素时，不同的事件都会绑定到document，同时给生成的Dom添加store对象，用来存储真实的事件处理函数，
 * 当触发Dom事件时（如click事件），由于Dom本身并未绑定Dom事件，会冒泡到document上，
 * document绑定到事件处理函数中则根据event对象获取真正的target和type，
 * 然后获取target上的store对象，根据type获取store中存储的真实事件处理函数并执行。
 * ! 注: 给dom传递SyntheticBaseEvent事件对象是为了做一些兼容性处理
 */

import { UpdateQueue } from "./component";

const addEvent = (dom, eventType, fn) => {
  const store = dom.store || (dom.store = {});
  store[eventType] = fn;
  if (fn && !document[eventType]) {
    document[eventType] = dispatchEvent;
  }
};

const dispatchEvent = (event) => {
  const {
    target: { store },
    type,
  } = event;
  const eventType = `on${type}`;
  const handler = store && store[eventType];

  const syntheticBaseEvent = createSyntheticBaseEvent(event);

  UpdateQueue.isBatch = true;
  handler && handler(syntheticBaseEvent);
  UpdateQueue.isBatch = false;
  UpdateQueue.batchUpdate();
};

const createSyntheticBaseEvent = (nativeEvent) => {
  const syntheticBaseEvent = {};
  for (const key in nativeEvent) {
    syntheticBaseEvent[key] = nativeEvent[key];
  }
  syntheticBaseEvent.nativeEvent = nativeEvent;

  return syntheticBaseEvent;
};

export { addEvent };
