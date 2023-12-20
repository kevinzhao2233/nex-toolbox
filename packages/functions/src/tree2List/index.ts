/**
 * 将树形结构的数组转换为单层级的数组
 * @param treeArray 树形结构数组
 * @param idKey 每一项数据的唯一标识
 * @param pidKey 每一项数据的父数据的唯一标识
 * @param childrenKey 子数据集合
 */
export const tree2List = (treeArray: Record<string | number | symbol, any>[], idKey = 'id', pidKey = 'pid', childrenKey = 'children') => {
  // 定义一个空数组来存储转换后的结果
  const list: Record<string | number | symbol, any>[] = [];

  // 定义一个递归函数来转换树形结构的数组
  const convertTreeToArray = (arr: Record<string | number | symbol, any>[], parent: string | number | null) => {
    arr.forEach((item) => {
      // 将当前节点添加到结果数组中
      list.push({ ...item, [pidKey]: parent || null });
      // 如果当前节点有子节点，则递归处理子节点
      if (item[childrenKey].length > 0) {
        convertTreeToArray(item[childrenKey], item[idKey]);
        delete item[childrenKey];
      }
    });
  };

  convertTreeToArray(treeArray, null);

  return list;
};
