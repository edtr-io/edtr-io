import { serializer } from '../src/state-migration-serializer'

describe('deserialize', () => {
  test('empty state', () => {
    expect(serializer.deserialize([])).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [],
      },
    })
  })

  test('paragraph', () => {
    expect(
      serializer.deserialize([
        {
          type: 'p',
          children: [{ text: 'Hello world' }],
        },
      ])
    ).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [{ object: 'text', text: 'Hello world', marks: [] }],
          },
        ],
      },
    })
  })

  test('strong mark', () => {
    expect(
      serializer.deserialize([
        {
          type: 'p',
          children: [{ text: 'Hello world', strong: true }],
        },
      ])
    ).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                text: 'Hello world',
                marks: [{ object: 'mark', type: '@splish-me/strong' }],
              },
            ],
          },
        ],
      },
    })
  })

  test('em mark', () => {
    expect(
      serializer.deserialize([
        {
          type: 'p',
          children: [{ text: 'Hello world', em: true }],
        },
      ])
    ).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                text: 'Hello world',
                marks: [{ object: 'mark', type: '@splish-me/em' }],
              },
            ],
          },
        ],
      },
    })
  })

  test('color mark', () => {
    expect(
      serializer.deserialize([
        {
          type: 'p',
          children: [{ text: 'Hello world', color: 0 }],
        },
      ])
    ).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                text: 'Hello world',
                marks: [
                  {
                    object: 'mark',
                    type: '@splish-me/color',
                    data: { colorIndex: 0 },
                  },
                ],
              },
            ],
          },
        ],
      },
    })
  })

  test('code mark', () => {
    expect(
      serializer.deserialize([
        {
          type: 'p',
          children: [{ text: 'Hello world', code: true }],
        },
      ])
    ).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                text: 'Hello world',
                marks: [{ object: 'mark', type: 'code' }],
              },
            ],
          },
        ],
      },
    })
  })

  test('heading', () => {
    expect(
      serializer.deserialize([
        {
          type: 'h',
          level: 1,
          children: [{ text: 'Hello world' }],
        },
      ])
    ).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [
          {
            object: 'block',
            type: '@splish-me/h1',
            nodes: [{ object: 'text', text: 'Hello world', marks: [] }],
          },
        ],
      },
    })
  })

  test('link', () => {
    expect(
      serializer.deserialize([
        {
          type: 'a',
          href: 'https://edtr.io',
          children: [{ text: 'Hello world' }],
        },
      ])
    ).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [
          {
            object: 'inline',
            type: '@splish-me/a',
            data: {
              href: 'https://edtr.io',
            },
            nodes: [{ object: 'text', text: 'Hello world', marks: [] }],
          },
        ],
      },
    })
  })

  test('inline math', () => {
    expect(
      serializer.deserialize([
        {
          type: 'math',
          src: '\\sum_{i=1}^n x^i',
          inline: true,
          children: [{ text: '' }],
        },
      ])
    ).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [
          {
            object: 'inline',
            type: '@splish-me/katex-inline',
            data: {
              formula: '\\sum_{i=1}^n x^i',
              inline: true,
            },
            isVoid: true,
            nodes: [{ object: 'text', text: '', marks: [] }],
          },
        ],
      },
    })
  })

  test('block math', () => {
    expect(
      serializer.deserialize([
        {
          type: 'math',
          src: '\\sum_{i=1}^n x^i',
          inline: false,
          children: [{ text: '' }],
        },
      ])
    ).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [
          {
            object: 'block',
            type: '@splish-me/katex-block',
            data: {
              formula: '\\sum_{i=1}^n x^i',
              inline: false,
            },
            isVoid: true,
            nodes: [{ object: 'text', text: '', marks: [] }],
          },
        ],
      },
    })
  })

  test('unordered-list', () => {
    expect(
      serializer.deserialize([
        {
          type: 'unordered-list',
          children: [
            {
              type: 'list-item',
              children: [
                {
                  type: 'list-item-child',
                  children: [
                    {
                      text: 'Hello world',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ])
    ).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [
          {
            object: 'block',
            type: 'unordered-list',
            nodes: [
              {
                object: 'block',
                type: 'list-item',
                nodes: [
                  {
                    object: 'block',
                    type: 'list-item-child',
                    nodes: [
                      {
                        object: 'text',
                        text: 'Hello world',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    })
  })

  test('ordered-list', () => {
    expect(
      serializer.deserialize([
        {
          type: 'ordered-list',
          children: [
            {
              type: 'list-item',
              children: [
                {
                  type: 'list-item-child',
                  children: [
                    {
                      text: 'Hello world',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ])
    ).toEqual({
      object: 'value',
      document: {
        object: 'document',
        nodes: [
          {
            object: 'block',
            type: 'ordered-list',
            nodes: [
              {
                object: 'block',
                type: 'list-item',
                nodes: [
                  {
                    object: 'block',
                    type: 'list-item-child',
                    nodes: [
                      {
                        object: 'text',
                        text: 'Hello world',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    })
  })
})
