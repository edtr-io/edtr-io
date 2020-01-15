declare module 'json-stringify-deterministic' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function stringify(value: any): string
  // eslint-disable-next-line import/no-default-export
  export default stringify
}
