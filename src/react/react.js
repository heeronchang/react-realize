/**
 * * 处理虚Dom到真实Dom的转换
 */

import Component from "./component";
import { TYPE_ELEMENT, TYPE_FORWARD_REF } from "./constant";

// 方法根据jsx语法的babel转换规则实现
function createElement(type, props, ...children) {
  const combinedProps = { ...props };
  if (children && children.length > 0) {
    if (children.length === 1) {
      combinedProps.children = children[0];
    } else {
      combinedProps.children = children;
    }
  }

  const { key, ref } = combinedProps;
  if (key) {
    delete combinedProps.key;
  }
  if (ref) {
    delete combinedProps.ref;
  }

  return {
    $$typeof: TYPE_ELEMENT,
    key,
    type,
    ref,
    props: combinedProps,
  };
}

function createRef() {
  return { current: null };
}

function forwardRef(FuncComponent) {
  return {
    type: TYPE_FORWARD_REF,
    render: FuncComponent
  }
}

const React = {
  createElement,
  createRef,
  forwardRef,
  Component,
};

export default React;
