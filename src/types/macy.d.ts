declare module 'macy' {
  interface MacyOptions {
    container: HTMLElement | string
    columns?: number
    margin?: number | { x?: number; y?: number }
    trueOrder?: boolean
    waitForImages?: boolean
    mobileFirst?: boolean
    breakAt?: Record<number, number | { columns?: number; margin?: number | { x?: number; y?: number } }>
  }

  export interface MacyInstance {
    /* Parameter names match the actual library implementation
       (verified against node_modules/macy/dist/macy.js) — NOT the docs. */
    recalculate(refresh?: boolean, markComplete?: boolean): void
    runOnImageLoad(callback: () => void, everyLoad?: boolean): void
    remove(): void
  }

  export default function Macy(options: MacyOptions): MacyInstance
}
