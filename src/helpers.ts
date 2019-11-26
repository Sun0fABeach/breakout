function wait (millisecs: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, millisecs))
}

export { wait }
export default { wait }