import type { Ref } from 'vue'
import { ref } from 'vue'

type TApiFun<TData, TParams extends Array<any>> = (...params: TParams) => Promise<TData>

interface RequestOptions {
  // 定义一下初始状态
  loading?: boolean
}

type RequestResult<TData, TParams extends Array<any>> = [Ref<boolean>, TApiFun<TData, TParams>]

export function useRequest<TData, TParams extends any[] = any[]>(fun: TApiFun<TData, TParams>, options?: RequestOptions): RequestResult<TData, TParams> {
  const { loading = false } = options || { loading: false }

  const requestLoading = ref(loading)

  const run: TApiFun<TData, TParams> = async (...params) => {
    requestLoading.value = true
    return await fun(...params)
      .finally(() => {
        requestLoading.value = false
      })
  }

  return [requestLoading, run]
}

type LoadingResult = [
  Ref<boolean>,
  <T>(requestPromise: Promise<T>) => Promise<T>,
]
export function useLoading(defaultLoading = false): LoadingResult {
  const loading = ref(defaultLoading)
  function execute<T>(requestPromise: Promise<T>): Promise<T> {
    loading.value = true
    return requestPromise.finally(() => {
      loading.value = false
    })
  }
  return [loading, execute]
}

type ExecuteFun<TData, TParams extends Array<any>> = (...params: TParams) => Promise<TData>

interface ExecuteOptions {
  // 定义一下初始状态
  loading?: boolean
}

export function useExecute<TData, TParams extends any[] = any[]>(fun: ExecuteFun<TData, TParams>, options?: ExecuteOptions): [Ref<boolean>, ExecuteFun<TData, TParams>] {
  const { loading = false } = options || { loading: false }

  const executeLoading = ref(loading)

  const run: ExecuteFun<TData, TParams> = async (...params) => {
    executeLoading.value = true
    return await fun(...params)
      .finally(() => {
        executeLoading.value = false
      })
  }

  return [executeLoading, run]
}
