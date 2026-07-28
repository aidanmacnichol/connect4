/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*connect4.js' {
  type Connect4Module = {
    CELL_EMPTY: number
    CELL_RED: number
    CELL_YELLOW: number
    Game: {
      new (): {
        play(col: number): boolean
        at(row: number, col: number): number
        currentPlayer(): number
        winner(): number
        isDraw(): boolean
        isOver(): boolean
      }
      rows(): number
      cols(): number
    }
  }

  export default function createConnect4Module(options?: {
    locateFile?: (path: string) => string
  }): Promise<Connect4Module>
}

declare module '*.wasm?url' {
  const url: string
  export default url
}
