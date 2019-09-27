export const calculateLayoutOptions = (elements: number) => {
  const options = [] as [number, number][]
  for (let div = 1; div <= elements; div++) {
    if (elements % div == 0) {
      options.push([div, elements / div])
    }
  }
  return options
}
