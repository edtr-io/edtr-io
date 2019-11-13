import { PluginState, pluginStateToXml } from '../src/'
import stripIndent from 'strip-indent'

type ConversionExamples = [PluginState, string][]

// TODO: This type need to be deleted after implementing all TestCases
type ConversionExamplesTodo = [any, string][]

describe('Conversion of editor plugins to XML and back', () => {
  /*
   * ## Basics
   *
   * The function `pluginToXML()` converts an edtor plugin into a XML string
   * which represents this plugin. With `xmlToPlugin()` this XML string can be
   * converted back into an editor plugin representation.
   *
   * For the serialization the function `pluginStateToXml` is used to
   * convert an editor plugin state recursively into an XML tree.
   *
   * ## Conversion of plugin states and plugins
   *
   * The serialization and deserialization of a plugin or plugin state is
   * recursively defined by the rules which are defined in this test suite.
   *
   * ## Conversion for values of primitive data types
   *
   * A value `value` whose type `type` is one of the primitive data types
   * `number`, `boolean` or `string` is represented by the markup
   * `<type>value</type>`. For example the number 42 is represented by
   * `<number>42</number>.
   */
  describe.each([
    [42, '<number>42</number>'],
    [-2.5, '<number>-2.5</number>'],
    [1000, '<number>1000</number>'],
    [true, '<boolean>true</boolean>'],
    [false, '<boolean>false</boolean>'],
    ['hello world', '<string>hello world</string>'],
    ['a&b', '<string>a&amp;b</string>'],
    ['', '<string></string>']
  ] as ConversionExamples)(
    'Primitive data %p is represented by %p',
    (value, markup) => {
      test(`Serialization of '${value}' is '${markup}'`, () => {
        expect(pluginStateToXml(value)).toBe(markup)
      })
      test.todo(`Deserialization of ${markup} is ${value}`)
    }
  )

  /*
   * ## Conversion of strings with whitespaces
   *
   * Trailing an preceeding whitespaces of an XML text node is ignored.
   * For example the following element is the same as `<number>42</number>`:
   *
   * ```
   * <number>
   *   42
   * </number>
   * ```
   *
   * An exception is the `<string>...</sting>` element which uses all characters
   * of the string.
   */
  describe.each([
    [' ', '<string> </string>'],
    ['\t \t', '<string>\t \t</string>'],
    ['\nhello world\n\t', '<string>\nhello world\n\t</string>']
  ] as ConversionExamples)(
    '%# Conversion string with whitespaces',
    (value, markup) => {
      test('Serialization', () => {
        expect(pluginStateToXml(value)).toBe(markup)
      })
      test.todo(`Deserialization`)
    }
  )

  /*
   * ## Conversion of lists
   *
   * A list is converted to an element `<list>...</list>`. The elements of the
   * list are the children of the xml element. For example `[1,true,'hello']`
   * is converted to
   *
   * ```
   * <list>
   *   <number>1</number>
   *   <boolean>true</boolean>
   *   <string>hello</string>
   * </list>
   * ```
   */
  describe.each([
    [
      [1, true, 'hello'],
      `
        <list>
          <number>1</number>
          <boolean>true</boolean>
          <string>hello</string>
        </list>
      `
    ],
    [
      [-2.3],
      `
        <list>
          <number>-2.3</number>
        </list>
      `
    ],
    [[], '<list></list>'],
    [
      [[true, ''], []],
      `
        <list>
          <list>
            <boolean>true</boolean>
            <string></string>
          </list>
          <list></list>
        </list>
      `
    ]
  ] as ConversionExamples)('%# list conversion', (value, markup) => {
    test('Serialization', () => {
      expect(pluginStateToXml(value)).toBe(stripIndent(markup).trim())
    })
    test.todo('deserialization')
  })

  /*
   * ## Conversion of dictionaries / objects
   *
   * A object is converted to an XML element `<object>...</object>`. The
   * properties of the object become children of this element. The name of these
   * children are of the form `propertyName.type`. For example the dictionary
   * `{ foo: 42, bar: 'hello' }` is represented by
   *
   * ```
   * <object>
   *   <foo.int>42</foo.int>
   *   <bar.string>hello</bar.string>
   * </object>
   * ```
   */
  describe.each([
    [
      { foo: 42, bar: 'hello' },
      `
        <object>
          <foo.number>42</foo.number>
          <bar.string>hello</bar.string>
        </object>
      `
    ],
    [{}, '<object></object>'],
    [
      { a: { b: 'hello' }, c: [' ', {}], d: true },
      `
        <object>
          <a.object>
            <b.string>hello</b.string>
          </a.object>
          <c.list>
            <string> </string>
            <object></object>
          </c.list>
          <d.boolean>true</d.boolean>
        </object>
      `
    ]
  ] as ConversionExamplesTodo)('%# object conversion', (value, markup) => {
    test('Serialization', () => {
      expect(pluginStateToXml(value)).toBe(stripIndent(markup).trim())
    })
    test.todo('deserialization')
  })

  /*
   * ## Conversion of list properties
   *
   * By listing a property more than once in an `<object>`-element the property
   * is converted into a list. For example `{ foo: ['hello', -23] }` becomes
   *
   * ```
   * <object>
   *   <foo.string>hello</foo.string>
   *   <foo.number>-23</foo.number>
   * </object>
   * ```
   *
   * Note that this rule can only be applied to lists at least two elements.
   */
  describe.each([
    [
      { foo: ['hello', -23] },
      `<object>
         <foo.string>hello</foo.string>
         <foo.number>-23</foo.number>
       </object>`
    ],
    [
      { foo: false, bar: [{ a: 42 }, 42, 'hello'], baz: [23] },
      `<object>
         <foo.boolean>false</foo.boolean>
         <bar.object>
          <a.number>42</a.number>
         </bar.object>
         <bar.number>42</bar.number>
         <bar.string>hello</bar.string>
         <baz.list>
          <number>23</number>
        </baz.list>
      </object>`
    ]
  ] as ConversionExamplesTodo)(
    '%# object conversion with list properties',
    (value, markup) => {
      test.todo('serialization')
      test.todo('deserialization')
    }
  )

  /*
   * ## Conversion of properties with attributes
   *
   * Properties of types `boolean`, `number` or `string` can be converted to
   * XML attributes. A property with name `propertyName` with the value
   * `propertyValue` of type `propertyType` is converted to
   * `<propertyName>.<propertyType>="<propertyValue>"`.
   *
   * A property without a value is interpreted as `true`.
   */
  describe.each([
    [{ a: 42, b: false }, '<object a.int="42" b.boolean="false"></object>'],
    [{ s: 'Hello World' }, '<object s.string="Hello World"></object>'],
    [{ fullscreen: true }, '<object fullscreen></object>'],
    [
      {
        message: 'Hello World',
        foo: 42,
        bar: [{ baz: true }, { baz: false }],
        a: { result: 100 }
      },
      `<object message.string="Hello World" foo="42">
         <bar.object baz></bar.object>
         <bar.object baz="false"></bar.object>
         <a.object result.int="100"></a.object>
       </object>`
    ]
  ] as ConversionExamplesTodo)(
    '%# object conversion with list properties',
    (value, markup) => {
      test.todo('serialization')
      test.todo('deserialization')
    }
  )

  /*
   * ## Conversion of stateless plugin
   *
   * A stateless plugin `{ plugin: '<name>' }` is represented by
   * `<plugin:name.undefined></plugin:name.undefined>` or by
   * `<plugin:name></plugin:name>`. In case the name of the plugin is
   * not another type (`number`, `boolean`, `string`, `list` or `object`) the
   * prefix `plugin:` can be omited. Thus `<foo></foo>` represents
   * `{ plugin: 'foo' }`.
   */
  describe('conversion of stateless plugins', () => {
    test.todo('conversion of <plugin:foo.undefined></plugin:foo.undefined>')
    test.todo('conversion of <plugin:foo></plugin:foo>')
    test.todo('conversion of <plugin:string></plugin:string>')
    test.todo('conversion of <foo></foo>')
  })

  /*
   * ## Conversion of stateful plugins
   *
   * A stateful plugin `{ plugin: '<name>', state: <stateValue> }` whose state
   * property is of type `stateType` is represented by the XML element
   * `<plugin:name.stateType>...</plugin:name.stateType>` whereby this element
   * represents `stateValue` as in the above rules. Thus it is the same
   * XML element as the conversion of `stateValue` whereby the tag name
   * has the prefix `plugin:name.`. The prefix `plugin:` can be omited when
   * `name` is not the name of another plugin.
   */
  describe.each([
    [{ plugin: 'foo', state: 42 }, '<plugin:foo.int>42</plugin:foo.int>'],
    [
      { plugin: 'bar', state: 'I am a string' },
      '<bar.string>I am a string</bar.string>'
    ],
    [
      { plugin: 'hello', state: { message: 'Hello World!' } },
      `<hello.object>
         <message>Hello World!</message>
       </hello.object>`
    ]
  ] as ConversionExamplesTodo)(
    '%# conversion of stateful plugins',
    (value, markup) => {
      test.todo('serialization')
      test.todo('deserialization')
    }
  )

  /*
   * ## Omitting type name
   *
   * The type name can be omitted. In this case the type is guessed based on the
   * following rules:
   *
   * 1. If the node content is text and if it is `false` or `true`, the type is
   * `boolean`.
   * 2. If the node content is text and if it can be converted into a number,
   * the type is `number`
   * 3. If the node content is text and (1) and (2) cannot be applied, the type
   * is `string`.
   * 4. In all other cases the type shall be `object`.
   */
  describe.each([
    [{ plugin: 'foo', state: 42 }, '<foo>42</foo>'],
    [{ plugin: 'foo', state: false }, '<foo>false</foo>'],
    [{ plugin: 'foo', state: 'Hello World' }, '<foo>Hello World</foo>'],
    [
      {
        foo: true,
        message: 'Hello World',
        baz: { plugin: 'baz', state: { a: 42 } }
      },
      `<object>
         <foo>true</true>
         <message>Hello World</message>
         <bar.baz>
          <a>42</a>
         </bar.baz>
      <object>`
    ]
  ] as ConversionExamplesTodo)(
    '%# omitting types in the xml description.',
    (value, markup) => {
      test.todo('serialization')
      test.todo('deserialization')
    }
  )

  /*
   * ## Complex examples
   */
  describe.each([
    [
      {
        plugin: 'foo',
        state: {
          bar: [42, { singleton: [42] }],
          baz: { plugin: 'baz', state: { a: 'Hello World' } }
        }
      },
      `<foo>
         <bar>42</bar>
         <bar>
           <singleton.list>12</singleton.list>
         </bar>
         <baz.boo>
           <a>Hello World</a>
         </baz.boo>
       </foo>`
    ],
    [
      {
        plugin: 'multiplechoice',
        state: {
          question: 'What is 1+1?',
          answer: [{ answer: '1', right: false }, { answer: '2', right: true }]
        }
      },
      `<multiplechoice>
         <question>What is 1+1?</question>
         <answer text.string="1" right="false"></answer>
         <answer text.string="2" right="true"></answer>
       </multiplechoice>`
    ]
  ] as ConversionExamplesTodo)(
    '%# omitting types in the xml description.',
    (value, markup) => {
      test.todo('serialization')
      test.todo('deserialization')
    }
  )
})
