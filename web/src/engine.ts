import createConnect4Module from './wasm/connect4.js'
import wasmUrl from './wasm/connect4.wasm?url'

type Connect4Module = Awaited<ReturnType<typeof createConnect4Module>>

let modulePromise: Promise<Connect4Module> | null = null

/** Load the Emscripten WASM module once. */
export function loadEngine(): Promise<Connect4Module> {
  if (!modulePromise) {
    modulePromise = createConnect4Module({
      locateFile: (path: string) => (path.endsWith('.wasm') ? wasmUrl : path),
    })
  }
  return modulePromise
}
