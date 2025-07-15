import 'whatwg-fetch'
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.BroadcastChannel = class {
  constructor() {}
  postMessage() {}
  close() {}
}
