import { name, states } from '@edtr-io/plugin-text/__fixtures__'
import { RendererProps } from '@edtr-io/renderer'

import { addPluginStories, addStory } from '../src'

addPluginStories({
  name: 'Text',
  plugin: name,
  states: states,
})

addStory('Plugins/Text/Short Prefilled', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"text","state":[{"type":"p","children":[{"text":"some "},{"type":"a","href":"https://www.example.com","children":[{"text":"link"}]},{"text":", "},{"text":"bold","strong":true},{"text":" and "},{"text":"italic","em":true},{"text":" text and also some inline code.  Try using hotkeys for bold (Ctrl / Cmd + B), italic (Ctrl /Cmd + I), link (Ctrl/Cmd + K) and code (Ctrl/Cmd +Q). "}]}]}]}'
  ) as RendererProps['state'],
})

addStory('Plugins/Text/Long Prefilled', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"text","state":[{"type":"p","children":[{"text":"Cupcake ipsum dolor sit amet croissant I love sweet roll. I love liquorice gingerbread I love macaroon tart tootsie roll powder danish. Bear claw chocolate cake I love I love I love jujubes "},{"text":"marzipan","em":true},{"text":". I love chocolate cake tart. Gummi bears croissant cupcake pastry jelly beans icing. Gummi bears cake tootsie roll muffin macaroon caramels apple pie. Ice cream halvah "},{"type":"a","href":"https://placekitten.com/","children":[{"text":"cheesecake"}]},{"text":" sweet roll. Pastry muffin halvah danish cookie. Tootsie roll marzipan chocolate cake halvah gummies wafer cupcake."}]}]},{"plugin":"text","state":[{"type":"p","children":[{"text":"I love sweet roll bear claw jelly-o candy ice cream I love ice cream I love. Cake topping pie danish pudding brownie powder. Cake macaroon sugar plum cheesecake apple pie cupcake sweet biscuit. "},{"text":"Gummies carrot cake","strong":true},{"text":" gummies cheesecake apple pie. Donut bear claw topping. Wafer soufflé biscuit powder."}]}]},{"plugin":"text","state":[{"type":"p","children":[{"text":"Candy canes carrot cake apple pie sesame snaps tootsie roll lemon drops. Cupcake topping I love lollipop bonbon lollipop powder chocolate bar. "}]}]},{"plugin":"text","state":[{"type":"p","children":[{"text":"Pie macaroon cheesecake dragée cotton candy. Cupcake I love I love dragée marzipan icing. Bonbon toffee I love carrot cake pudding macaroon jelly tootsie roll. I love sweet roll gingerbread cookie I love croissant caramels lemon drops halvah. Tootsie roll marzipan "},{"type":"a","href":"https://placekitten.com/","children":[{"text":"fruitcake marshmallow I love cookie I love I love biscuit. Ice cream halvah"}]},{"text":" toffee chupa chups pie cotton candy I love dessert. Carrot cake chocolate cake. Brownie pudding biscuit pastry icing caramels I love cookie."}]}]},{"plugin":"text","state":[{"type":"p","children":[{"text":"Cake danish chocolate. Gummies oat cake sweet I love candy canes sugar plum dragée. Topping biscuit chupa chups ice cream dessert gummies. Powder fruitcake candy jujubes cake I love "},{"text":"chupa chups chocolate powder. Jelly I love cookie marshmallow. Sweet gummies chocolate cake I love I l","strong":true},{"text":"ove I love caramels sweet bonbon. Chocolate bar topping icing liquorice I love bear claw biscuit dessert biscuit. Pastry dragée cotton candy donut I love chocolate gummi bears I love chocolate bar."}]}]},{"plugin":"text","state":[{"type":"p","children":[{"text":"Brownie candy sweet roll bonbon dessert ice cream tiramisu jelly-o sesame snaps. Pudding caramels cupcake I love jujubes chupa chups chocolate topping. Apple pie danish I love gummi bears pudding. I love chupa chups biscuit ice cream cookie. Topping donut topping sweet roll topping caramels tiramisu tart. Donut donut pudding. Macaroon oat cake oat cake jelly-o sweet roll sweet candy canes icing lemon drops.","em":true}]}]},{"plugin":"text","state":[{"type":"p","children":[{"text":"","em":true}]}]}]}'
  ) as RendererProps['state'],
})

addStory('Plugins/Text/Prefilled with Math', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"text","state":[{"type":"p","children":[{"text":"some "},{"type":"a","href":"https://www.example.com","children":[{"text":"link"}]},{"text":", "},{"text":"bold","strong":true},{"text":" and "},{"text":"italic","em":true},{"text":" text.  Try using hotkeys for bold (Ctrl / Cmd + B) and italic (Ctrl /Cmd + I) and opening the overlay by selecting a link and pressing Enter key."}]}]},{"plugin":"text","state":[{"type":"p","children":[{"text":"Also look at this beautiful formula: "},{"type":"math","src":"f(x) = \\\\int_{-\\\\infty}^\\\\infty\\n    g(\\\\xi)\\\\ e^{2 \\\\pi i \\\\xi x} \\n    \\\\ d\\\\xi","inline":true,"children":[{"text":""}]},{"text":""}]}]}]}'
  ) as RendererProps['state'],
})
