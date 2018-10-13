export const asType = (type, name) => [type, name].join('_').toUpperCase()
export const tagAsType = (type, names) => (
  names.reduce((tags, name) => {
    tags[name] = asType(type, name)
    return tags
  }, {})
)

export const metadata = tagAsType('metadata', [
  'loading', 'loaded', 'loaded_many', 'error', 'set_hash'
])

export const search = tagAsType('search', [
  'loading', 'loaded', 'error', 'panic'
])
