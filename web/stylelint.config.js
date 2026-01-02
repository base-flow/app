/** @type {import('stylelint').Config} */

export default {
  extends: ['stylelint-config-html', 'stylelint-config-standard-scss', 'stylelint-prettier/recommended', 'stylelint-config-recess-order'],
  plugins: ['stylelint-prettier', 'stylelint-order', 'stylelint-declaration-block-no-ignored-properties'],
  rules: {
    'selector-class-pattern': null,
    'plugin/declaration-block-no-ignored-properties': true,
    'no-descending-specificity': null,
    'selector-type-case': null,
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: [/^__\w+/],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
  ],
};
