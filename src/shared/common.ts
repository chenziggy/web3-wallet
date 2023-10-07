// polyfill
/* eslint-disable  unicorn/prefer-node-protocol */
import { Buffer } from 'buffer'

// style
import 'vant/es/toast/style'

window.Buffer = Buffer
