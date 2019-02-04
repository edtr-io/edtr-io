module.exports = {
  linters: {
    '{packages/*/{{__stories__,__tests__,src}/**/*,*},*}.{js,jsx,ts,tsx,json,md,yaml,yml}': [
      'prettier --write',
      'git add'
    ],
    '{packages/*/{{__stories__,__tests__,src}/**/*,*},*}.{js,jsx,ts,tsx}': [
      'eslint --fix',
      'prettier --write',
      'jest --findRelatedTests',
      'git add'
    ]
  }
}
