import { describe, expect, it } from 'vitest';
import { list2Tree } from '.';

describe('list2Tree', () => {
  it('list2Tree::应该返回具有指定id和children的对象数组', () => {
    const list = [
      { id: 1, pid: 0 },
      { id: 2, pid: 1 },
      { id: 3, pid: 2 },
      { id: 4, pid: 0 },
      { id: 5, pid: 4 },
    ];
    const expectedResult = [
      {
        id: 1,
        pid: 0,
        children: [
          {
            id: 2,
            pid: 1,
            children: [
              {
                id: 3,
                pid: 2,
              },
            ],
          },
        ],
      },
      {
        id: 4,
        pid: 0,
        children: [
          {
            id: 5,
            pid: 4,
          },
        ],
      },
    ];

    const result = list2Tree(list);
    console.log(result);

    expect(result).toEqual(expectedResult);
  });

  it('should handle empty input list', () => {
    const list: any[] = [];

    const result = list2Tree(list);

    expect(result).toEqual([]);
  });
});
