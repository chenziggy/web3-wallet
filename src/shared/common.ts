// polyfill
import { Buffer } from 'node:buffer'

// style
import 'vant/es/toast/style'

/* eslint-disable node/prefer-global/buffer */
window.Buffer = Buffer
