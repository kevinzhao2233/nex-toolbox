import { reactive, ref, watch } from 'vue';

export interface IPagination {
  pageNum: number;
  pageSize: number;
}

export interface IInitSearchParams extends Partial<IPagination> {
  [key: string]: any;
}

export interface IOptions {
  immediate?: boolean;
  searchAfterReset?: boolean;
  loop?: boolean;
  loopInterval?: number;
}

export function useSearch(
  searchFn: (params: any) => Promise<any>,
  initSearchParams: IInitSearchParams = {},
  options: IOptions = {},
) {
  const {
    immediate = true,
    searchAfterReset = true,
    loop = false,
    loopInterval = 10 * 1000,
  } = options;

  const { pageNum, pageSize, ...params } = initSearchParams;
  const searchParams = ref(params);

  const pagination = reactive<IPagination>({
    pageNum: pageNum || 1,
    pageSize: pageSize || 10,
  });

  let innerParams = { ...pagination, ...searchParams.value };
  const searchResult = ref<any>();

  watch(pagination, onPagination);

  function resetParams() {
    const { pageNum: initPageNum, pageSize: initPageSize, ...initParams } = initSearchParams;
    pagination.pageNum = initPageNum || 1;
    pagination.pageSize = initPageSize || 10;
    searchParams.value = initParams;
    innerParams = { ...pagination, ...searchParams.value };
  }

  const resetting = ref(false);
  async function reset() {
    resetting.value = true;
    try {
      resetParams();
      if (searchAfterReset) {
        await search();
      }
    } finally {
      resetting.value = false;
    }
  }

  async function search() {
    Object.assign(innerParams, searchParams.value);
    await dosearch();
  }

  async function onPagination() {
    if (resetting.value) return;
    Object.assign(innerParams, pagination);
    await dosearch();
  }

  const lastSearchTimeStamp = ref<number | null>(null);
  const searching = ref(false);
  async function dosearch() {
    searching.value = true;
    const result = await searchFn(innerParams);
    lastSearchTimeStamp.value = Date.now();
    searchResult.value = result;
    searching.value = false;
  }

  if (immediate) {
    search();
  }

  if (loop) {
    setInterval(() => {
      search();
    }, loopInterval);
  }

  return {
    searchParams,
    pagination,
    search,
    searchResult,
    reset,
    resetting,
    searching,
    lastSearchTimeStamp,
  };
}
