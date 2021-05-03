import {DocumentNode} from 'graphql'
import dealiasResult from './dealiasResult'
import filterErrorsForDocument from './filterErrorsForDocument'
import mergeGQLDocuments from './mergeGQLDocuments'
import {DataLoaderKey, EndpointExecutionResult, Variables} from './types'
import wrapExecutor from './wrapExecutor'

interface BatchedExecParams<TContext> {
  document: DocumentNode,
  variables: Variables,
  context: TContext
  idx: number
}
interface ExecParamsByToken<TContext> {
  [accessToken: string]: BatchedExecParams<TContext>[]
}

const batchFn = async <TContext>(keys: readonly DataLoaderKey<TContext>[]) => {
  const [firstKey] = keys
  const {options} = firstKey
  const {batchKey, executor, isMutation, prefix} = options
  const wrappedExecutor = wrapExecutor(executor, prefix)
  const execParamsByToken = keys.reduce((obj, key, idx) => {
    const {context} = key
    const accessToken = context[batchKey]
    obj[accessToken] = obj[accessToken] || []
    obj[accessToken].push({
      document: key.document,
      variables: key.variables,
      context,
      idx
    })
    return obj
  }, {} as ExecParamsByToken<TContext>)

  const results = [] as EndpointExecutionResult[]
  await Promise.all(
    Object.values(execParamsByToken).map(async (execParams) => {
      const [firstParam] = execParams
      // context is per-fetch
      const {context} = firstParam
      const {document, variables, aliasMappers} = mergeGQLDocuments(execParams, isMutation)
      const result = await wrappedExecutor(document, variables, context)
      const {errors, data} = result
      execParams.forEach((execParam, idx) => {
        const aliasMapper = aliasMappers[idx]
        const {idx: resultsIdx, document} = execParam
        results[resultsIdx] = {
          data: dealiasResult(data, aliasMapper),
          errors: filterErrorsForDocument(document, errors)
        }
      })
    })
  )
  return results
}

export default batchFn
