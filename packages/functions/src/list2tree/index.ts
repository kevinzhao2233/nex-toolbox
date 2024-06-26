/**
 * 将数组转换为树形结构
 * @param list 原始 list
 * @param idKey 每一项数据的唯一标识
 * @param pidKey 每一项数据的父数据的唯一标识
 * @param childrenKey 子数据集合
 */
export const list2Tree = (list: Record<string | number | symbol, any>[], idKey = 'id', pidKey = 'pid', childrenKey = 'children') => {
  const map = new Map();
  list.forEach((item) => {
    map.set(item[idKey], item);
  });
  const rootList: Record<string | number | symbol, any>[] = [];
  list.forEach((item) => {
    const parent = map.get(item[pidKey]);
    if (parent) {
      (parent[childrenKey] || (parent[childrenKey] = [])).push(item);
    } else {
      rootList.push(item);
    }
  });
  return rootList;
};
