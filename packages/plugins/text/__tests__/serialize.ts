import { htmlToSlateValue, slateValueToHtml } from '../src/model'

describe('HTML -> Slate -> HTML', () => {
  test('case 1', () => {
    const html =
      '<p>Hallo <em>Du</em></p><p>Was machst du?</p><p><strong>BUH!</strong></p>'
    const result = slateValueToHtml(htmlToSlateValue(html))
    expect(result).toEqual(html)
  })
})
