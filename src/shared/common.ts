// polyfill
/* eslint-disable  unicorn/prefer-node-protocol */
import { Buffer } from 'buffer'

// style
import 'vant/es/toast/style'

/* eslint-disable node/prefer-global/buffer */
window.Buffer = Buffer
