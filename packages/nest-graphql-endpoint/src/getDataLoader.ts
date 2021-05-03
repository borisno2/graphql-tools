import DataLoader from 'dataloader'
import batchFn from './batchFn'
import {DataLoaderKey, EndpointDataLoader, EndpointExecutionResult, ExecutionRef} from './types'

const dataloaderCache = new WeakMap<ExecutionRef, EndpointDataLoader<unknown>>()
const getDataLoader = (ref: ExecutionRef) => {
  const existingDataLoader = dataloaderCache.get(ref)
  if (existingDataLoader) return existingDataLoader
  const newDataLoader = new DataLoader<DataLoaderKey<unknown>, EndpointExecutionResult>(batchFn, {
    cache: false
  })
  dataloaderCache.set(ref, newDataLoader)
  return newDataLoader
}

export default getDataLoader
