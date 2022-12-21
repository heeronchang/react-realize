// 判断是否是虚拟Dom对象，虚拟DOM对象具有$$typeof属性
export const isVNodeObj = (p) => {
  if (p && p.$$typeof) return true
  return false
}