/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('webpack-merge')
const bsSettings = require('@open-wc/testing-karma-bs/bs-settings.js')
const createBaseConfig = require('./karma.conf.js')

module.exports = config => {
  config.set(
    merge(bsSettings(config), createBaseConfig(config), {
      browserStack: {
        project: 'hydrofoil-shell',
      },
    }),
  )

  return config
}
