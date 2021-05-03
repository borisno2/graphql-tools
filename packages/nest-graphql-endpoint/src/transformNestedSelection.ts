import {DocumentNode, FragmentDefinitionNode, GraphQLResolveInfo, visit} from 'graphql'

const pruneUnusedNodes = (info: GraphQLResolveInfo) => {
  const usedVariables = new Set<string>()
  const usedFragmentSpreads = new Set<string>()
  const fragmentDefinitions = [] as FragmentDefinitionNode[]
  const querySelectionSet = {
    kind: 'SelectionSet' as const,
    selections: info.fieldNodes.flatMap(({selectionSet}) => selectionSet!.selections)
  }
  const variableDefinitions = info.operation.variableDefinitions || []
  const fragments = info.fragments || {}
  const allVariables = info.variableValues || {}

  visit(querySelectionSet, {
    Variable(node) {
      const {name} = node
      const {value} = name
      usedVariables.add(value)
    },
    FragmentSpread(node) {
      const {name} = node
      const {value} = name
      usedFragmentSpreads.add(value)
    }
  })

  const prunedVariableDefinitions = variableDefinitions.filter((varDef) => {
    const {variable} = varDef
    const {name} = variable
    const {value} = name
    return usedVariables.has(value)
  })
  Object.keys(fragments).forEach((fragmentName) => {
    if (usedFragmentSpreads.has(fragmentName)) {
      fragmentDefinitions.push(fragments[fragmentName])
    }
  })

  const variables = {}
  usedVariables.forEach((variableName) => {
    variables[variableName] = allVariables[variableName]
  })

  return {
    variables,
    document: {
      kind: 'Document' as const,
      definitions: [
        {
          kind: info.operation.kind,
          operation: info.operation.operation,
          variableDefinitions: prunedVariableDefinitions,
          selectionSet: querySelectionSet
        },
        ...fragmentDefinitions
      ]
    }
  }
}

const unprefixTypes = (document: DocumentNode, prefix: string) => {
  return visit(document, {
    NamedType(node) {
      const {name} = node
      const {value} = name
      return {
        ...node,
        name: {
          ...node.name,
          value: value.slice(prefix.length)
        }
      }
    }
  })
}

const transformNestedSelection = (info: GraphQLResolveInfo, prefix: string) => {
  const {variables, document: prefixedDoc} = pruneUnusedNodes(info)
  const document = unprefixTypes(prefixedDoc, prefix)
  return {document, variables}
}

export default transformNestedSelection
