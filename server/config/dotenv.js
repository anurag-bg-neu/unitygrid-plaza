import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Always load server/.env, no matter which directory the process was started from.
const here = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(here, '../.env') })
