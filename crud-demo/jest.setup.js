import { TextDecoder, TextEncoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

global.Request = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (prop === 'prototype') {
        return {}
      }
      return jest.fn()
    },
    construct: () => {
      return {}
    },
  }
)
