# @graphql-tools/utils

## 7.8.1

### Patch Changes

- dbdb78e0: fix(visitResult): don't throw on encountering \_\_typename in request (#2860)

## 7.8.0

### Minor Changes

- 03c579b1: enhance(utils): astFromDirective doesn't need schema anymore

## 7.7.3

### Patch Changes

- d2a17c70: enhance(printSchemaWithDirectives): show directives before other definitions #2752

## 7.7.2

### Patch Changes

- a4f1ee58: \_\_ is reserved for introspection

## 7.7.1

### Patch Changes

- 194ac370: fix(utils): add createSchemaDefinition again to fix breaking change

## 7.7.0

### Minor Changes

- 58fd4b28: feat(types): add TContext to stitchSchemas and executor

### Patch Changes

- 43da6b59: enhance(merge): reduce number of iterations

## 7.6.0

### Minor Changes

- 5b637e2f: Add generic pruning filter option

## 7.5.2

### Patch Changes

- de16fff4: Fix pruneSchema with unimplemented interfaces

## 7.5.1

### Patch Changes

- 33d1b9e7: Fix pruneSchema with unused interfaces

## 7.5.0

### Minor Changes

- 219ed392: enhance(utils): Extract getDocumentNodeFromSchema from printSchemaWithDirectives

### Patch Changes

- 219ed392: fix(utils): fix missing default value of input object type field
- 219ed392: fix(utils): print specifiedBy directive definitions correctly

## 7.4.0

### Minor Changes

- 8f331aaa: enhance(utils): Extract getDocumentNodeFromSchema from printSchemaWithDirectives

### Patch Changes

- 8f331aaa: fix(utils): fix missing default value of input object type field

## 7.3.0

### Minor Changes

- 6387572c: feat(utils): export astFrom\* helper functions

## 7.2.6

### Patch Changes

- e53f97b3: fix(utils): provide { done: true } from iterator when complete is called on observer in observableToAsyncIterable

## 7.2.5

### Patch Changes

- 4fc05eb7: Fixes the handling of repeatable directives in the `getDirectives` method. Previously repeatable directives were nested and duplicated. They will now return as a flat array map:

  ```graphql
  @mydir(arg: "first") @mydir(arg: "second")
  ```

  translates into:

  ```js
  {
    mydir: [{ arg: 'first' }, { arg: 'second' }];
  }
  ```

## 7.2.4

### Patch Changes

- 6e50d9fc: enhance(stitching-directives): use keyField

  When using simple keys, i.e. when using the keyField argument to `@merge`, the keyField can be added implicitly to the types's key. In most cases, therefore, `@key` should not be required at all.

## 7.2.3

### Patch Changes

- 3d1340a3: fix(printSchemaWithDirectives): typo

## 7.2.2

### Patch Changes

- 63ab0034: fix(printSchemaWithDirectives): should print directives where used, even if directives themselves are not defined within the schema.

## 7.2.1

### Patch Changes

- 270046a1: fix(TransformInputObjectFields): transform variables #2353

## 7.2.0

### Minor Changes

- c3996f60: enhance(utils): support code-first schemas by allowing directives to be read from extensions

### Patch Changes

- c3996f60: fix(stitchingDirectives): complete support for code first schemas
- c3996f60: fix(printSchemaWithDirectives): should work for code-first schemas as well
- c3996f60: enhance(utils) filter root field arguments with filterSchema

## 7.1.6

### Patch Changes

- cd5da458: fix(utils): fix crashes when return null while visitSchema

## 7.1.5

### Patch Changes

- 298cd39e: fix(url-loader): do not fail multipart request when null variable given

## 7.1.4

### Patch Changes

- 4240a959: fix(utils): fix Observable signature for observableToAsyncIterator

## 7.1.3

### Patch Changes

- 6165c827: Trow on SDL syntax errors

## 7.1.2

### Patch Changes

- 21da6904: fix release

## 7.1.1

### Patch Changes

- b48a91b1: add ability to specify merge config within subschemas using directives

## 7.1.0

### Minor Changes

- 4f5a4efe: enhance(schema): add some options to improve schema creation performance

## 7.0.2

### Patch Changes

- e3176633: fix(utils): revert to old observableToAsyncIterable return type

## 7.0.1

### Patch Changes

- 8133a907: fix(utils): Remove \$ from invalidPathRegex
- 2b6c813e: fix(utils): fix typing mismatch between linkToSubscriber and observableToAsyncIterable

## 7.0.0

### Major Changes

- be1a1575: ## Breaking Changes:

  #### Schema Generation and Decoration API (`@graphql-tools/schema`)

  - Resolver validation options should now be set to `error`, `warn` or `ignore` rather than `true` or `false`. In previous versions, some of the validators caused errors to be thrown, while some issued warnings. This changes brings consistency to validator behavior.

  - The `allowResolversNotInSchema` has been renamed to `requireResolversToMatchSchema`, to harmonize the naming convention of all the validators. The default setting of `requireResolversToMatchSchema` is `error`, matching the previous behavior.

  #### Schema Delegation (`delegateToSchema` & `@graphql-tools/delegate`)

  - The `delegateToSchema` return value has matured and been formalized as an `ExternalObject`, in which all errors are integrated into the GraphQL response, preserving their initial path. Those advanced users accessing the result directly will note the change in error handling. This also allows for the deprecation of unnecessary helper functions including `slicedError`, `getErrors`, `getErrorsByPathSegment` functions. Only external errors with missing or invalid paths must still be preserved by annotating the remote object with special properties. The new `getUnpathedErrors` function is therefore necessary for retrieving only these errors. Note also the new `annotateExternalObject` and `mergeExternalObjects` functions, as well as the renaming of `handleResult` to `resolveExternalValue`.

  - Transform types and the `applySchemaTransforms` are now relocated to the `delegate` package; `applyRequestTransforms`/`applyResultTransforms` functions have been deprecated, however, as this functionality has been replaced since v6 by the `Transformer` abstraction.

  - The `transformRequest`/`transformResult` methods are now provided additional `delegationContext` and `transformationContext` arguments -- these were introduced in v6, but previously optional.

  - The `transformSchema` method may wish to create additional delegating resolvers and so it is now provided the `subschemaConfig` and final (non-executable) `transformedSchema` parameters. As in v6, the `transformSchema` is kicked off once to produce the non-executable version, and then, if a wrapping schema is being generated, proxying resolvers are created with access to the (non-executable) initial result. In v7, the individual `transformSchema` methods also get access to the result of the first run, if necessary, they can create additional wrapping schema proxying resolvers.

  - `applySchemaTransforms` parameters have been updated to match and support the `transformSchema` parameters above.

  #### Remote Schemas & Wrapping (`wrapSchema`, `makeRemoteExecutableSchema`, and `@graphql-tools/wrap`)

  - `wrapSchema` and `generateProxyingResolvers` now only take a single options argument with named properties of type `SubschemaConfig`. The previously possible shorthand version with first argument consisting of a `GraphQLSchema` and second argument representing the transforms should be reworked as a `SubschemaConfig` object.

  - Similarly, the `ICreateProxyingResolverOptions` interface that provides the options for the `createProxyingResolver` property of `SubschemaConfig` options has been adjusted. The `schema` property previously could be set to a `GraphQLSchema` or a `SubschemaConfig` object. This property has been removed in favor of a `subschemaConfig` property that will always be a `SubschemaConfig` object. The `transforms` property has been removed; transforms should be included within the `SubschemaConfig` object.`

  - The format of the wrapping schema has solidified. All non-root fields are expected to use identical resolvers, either `defaultMergedResolver` or a custom equivalent, with root fields doing the hard work of proxying. Support for custom merged resolvers throught `createMergedResolver` has been deprecated, as custom merging resolvers conflicts when using stitching's type merging, where resolvers are expected to be identical across subschemas.

  - The `WrapFields` transform's `wrappingResolver` option has been removed, as this complicates multiple wrapping layers, as well as planned functionality to wrap subscription root fields in potentially multiple layers, as the wrapping resolvers may be different in different layers. Modifying resolvers can still be performed by use of an additional transform such as `TransformRootFields` or `TransformObjectFields`.

  - The `ExtendSchema` transform has been removed, as it is conceptually simpler just to use `stitchSchemas` with one subschema.

  - The `ReplaceFieldsWithFragment`, `AddFragmentsByField`, `AddSelectionSetsByField`, and `AddMergedTypeSelectionSets` transforms has been removed, as they are superseded by the `AddSelectionSets` and `VisitSelectionSets` transforms. The `AddSelectionSets` purposely takes parsed SDL rather than strings, to nudge end users to parse these strings at build time (when possible), rather than at runtime. Parsing of selection set strings can be performed using the `parseSelectionSet` function from `@graphql-tools/utils`.

  #### Schema Stitching (`stitchSchemas` & `@graphql-tools/stitch`)

  - `stitchSchemas`'s `mergeTypes` option is now true by default! This causes the `onTypeConflict` option to be ignored by default. To use `onTypeConflict` to select a specific type instead of simply merging, simply set `mergeTypes` to false.

  - `schemas` argument has been deprecated, use `subschemas`, `typeDefs`, or `types`, depending on what you are stitching.

  - When using batch delegation in type merging, the `argsFromKeys` function is now set only via the `argsFromKeys` property. Previously, if `argsFromKeys` was absent, it could be read from `args`.

  - Support for fragment hints has been removed in favor of selection set hints.

  - `stitchSchemas` now processes all `GraphQLSchema` and `SubschemaConfig` subschema input into new `Subschema` objects, handling schema config directives such aso`@computed` as well as generating the final transformed schema, stored as the `transformedSchema` property, if transforms are used. Signatures of the `onTypeConflict`, `fieldConfigMerger`, and `inputFieldConfigMerger` have been updated to include metadata related to the original and transformed subschemas. Note the property name change for `onTypeConflict` from `schema` to `subschema`.

  #### Mocking (`addMocksToSchema` and `@graphql-tools/mock`)

  - Mocks returning objects with fields set as functions are now operating according to upstream graphql-js convention, i.e. these functions take three arguments, `args`, `context`, and `info` with `parent` available as `this` rather than as the first argument.

  #### Other Utilities (`@graphql-tools/utils`)

  - `filterSchema`'s `fieldFilter` will now filter _all_ fields across Object, Interface, and Input types. For the previous Object-only behavior, switch to the `objectFieldFilter` option.
  - Unused `fieldNodes` utility functions have been removed.
  - Unused `typeContainsSelectionSet` function has been removed, and `typesContainSelectionSet` has been moved to the `stitch` package.
  - Unnecessary `Operation` type has been removed in favor of `OperationTypeNode` from upstream graphql-js.
  - As above, `applySchemaTransforms`/`applyRequestTransforms`/`applyResultTransforms` have been removed from the `utils` package, as they are implemented elsewhere or no longer necessary.

  ## Related Issues

  - proxy all the errors: #1047, #1641
  - better error handling for merges #2016, #2062
  - fix typings #1614
  - disable implicit schema pruning #1817
  - mocks not working for functions #1807

## 6.2.4

### Patch Changes

- 32c3c4f8: Fix duplication of scalar directives in merge
- 533d6d53: Bump all packages to allow adjustments
