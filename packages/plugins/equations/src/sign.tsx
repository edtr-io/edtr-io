export enum Sign {
  AlmostEqualTo = 'almost-equal-to',
  Equals = 'equals',
  Estimates = 'estimates',
  GreaterThan = 'greater-than',
  GreaterThanOrEqual = 'greater-than-or-equal',
  LessThan = 'less-than',
  LessThanOrEqual = 'less-than-or-equal',
  NotEqualTo = 'not-equal-to',
}

export function renderSignToString(sign: Sign): string {
  switch (sign) {
    case Sign.AlmostEqualTo:
      return '≈'
    case Sign.Equals:
      return '='
    case Sign.Estimates:
      return '≙'
    case Sign.GreaterThan:
      return '>'
    case Sign.GreaterThanOrEqual:
      return '≥'
    case Sign.LessThan:
      return '<'
    case Sign.LessThanOrEqual:
      return '≤'
    case Sign.NotEqualTo:
      return '≠'
  }
}
