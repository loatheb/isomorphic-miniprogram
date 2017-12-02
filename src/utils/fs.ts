/* global bluebird */

import * as fs from 'fs'
export const readFile = Promise.promisify(fs.readFile)
