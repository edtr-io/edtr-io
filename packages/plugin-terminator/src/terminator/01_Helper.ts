export function fail(msg: string) {
  console.trace()
  throw new Error(msg)
}

export function randomChoice<T>(arr: T[]): T {
  const res = arr[Math.floor(Math.random() * arr.length)]
  if (!res) fail('Auswahl aus einem leeren Array!')
  return res
}

export function shuffle2<T>(arr: [T, T]): [T, T] {
  if (Math.random() < 0.5) return arr
  else return [arr[1], arr[0]]
}

export function last<T>(arr: T[]): T {
  if (arr.length == 0) throw 'Kein letztes Element in einem leeren Array!'
  return arr[arr.length - 1]
}

export function zufallszahl(von: number, bis: number): number {
  return Math.floor(Math.random() * (bis - von + 1)) + von
}

export function toDigits(n: number): number[] {
  const digits: number[] = []
  do {
    digits.unshift(n % 10)
    n = Math.floor(n / 10)
  } while (n > 0)
  return digits
}

export function fromDigits(n: number[]): number {
  let res = 0
  n.forEach(d => {
    res *= 10
    res += d
  })
  return res
}

export function sampleSearch<T>(
  create: () => T,
  check: (val: T) => boolean,
  def: T,
  limit = 100
): T {
  let res: T = create()
  while (!check(res)) {
    res = create()
    if (--limit < 0) return def
  }
  return res
}

export function gcd(a: number, b: number): number {
  if (b == 0) return a
  return gcd(b, a % b)
}
