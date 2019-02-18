<p><br></p>
<p align="center">
	<img src="README_files/edtrio_full.svg" alt="edtr.io logo" width="277" height="68">
</p>
<br><br></p>

<h2 align="center">Content Editing for the Modern Web</h2>

<p align="center">
Edtr.io is a WYSIWYG in-line web editor written in React.<br>
Content created with edtr.io looks just like the final page -<br>
select any editable element on the page, edit it in-place or drag ’n’ drop it around.<br>
Its plugin architecture makes it adapt to any use case.<br>
Edtr.io is of course open-source.<br>
</p>
<p><br><br></p>

## Committed to Simplicity and Openness

Edtr.io is backed by Open Education heavyweights: serlo.org and the HPI Schul-Cloud, and supported by Splish.

It has been born from the needs of the learning platform [serlo.org](https://serlo.org/) and builds on the original work of Serlo’s co-founder und CTO [Aeneas Rekkas](https://github.com/aeneasr). Serlo.org is inspired by Wikipedia and already provides thousands of articles, videos and exercises for one million German students every month. Serlo.org is growing steadily. In 2018, the platform went international.

In 2019, Serlo partnered with the German [Schul-Cloud](https://hpi.de/en/open-campus/hpi-initiatives/schul-cloud.html), started by the Hasso Plattner Institute (HPI) in cooperation with MINT-EC, and funded by the Federal Ministry for Education and Research. The HPI Schul-Cloud aims to provide low-threshold access to digital educational content to schools nationwide. 

[Splish](http://splish.me) was founded in 2016 by the very people working on the editor, to be able to provide commercial support.

Great content editing is essential for the user experience of a community-driven site - edtr.io’s main purpose is to make editing on the web easy for students and teachers. 

We love education. We need this editor. We're in for the long haul.

<p align="center">
	<br>
	<a href="https://serlo.org/">
		<img src="README_files/serlo.svg" alt="serlo.org logo" width="242" height="86">
	</a>
	<a href="https://hpi.de/">
		<img src="README_files/hpi.svg" alt="HPI logo" width="242" height="86">
	</a>	
	<a href="http://splish.me">
		<img src="README_files/splish.png" alt="Splish logo" width="242" height="86">
	</a>
	<br><br>
</p>

## The Editor

### Core Characteristics

Edtr.io's plugin architecture makes it adapt to virtually any use case. Platform providers have full control over the available editing options. The edtr.io project provides a lean core of basic functionalities. For Rich Text editing, we build on Slate.js.

Edtr.io is based on reusable React components. Implementing and integrating a plugin only requires a few lines of code. You decide how data gets persisted; the state is a normalized JSON object, no HTML is involved. Plugins support undo/redo out of the box.

Edtr.io has UX at heart. Our core implements a consistent user experience. Building plugins from reusable elements ensures a uniform look and feel. Integrating edtr.io into an existing applications is simple: all functionalities are fully customizable, theming can be applied from ground up.

In-line editors provide an easy way to work on web content. Content creators work directly on elements, adding and changing them in-place. Everything just looks like the final page. Users do not need knowledge of markup languages or any special training.

### License

Edtr.io is under MIT license.

### Commercial Support

Commercial integration and custom plugin development is available from Splish.me, from the same knowledgeable people writing the code for edtr.io's core functionalities. For inquiries, please contact [edtr-io@splish.me](mailto:edtr-io@splish.me).

### Basic Features

- Rich text editing
- Drag ’n’ drop content sorting
- Global undo/redo
- Mobile preview
- Basic Plugins
- Image upload
- Blockquote
- Spoiler
- Markdown table
- Youtube video integration (in development)
- Vimeo video integration (in development)
- Wiki Commons video integration (in development)

### Plugins for Education

- Input text exercise
- Matching exercise
- Multiple and single choice exercise
- Basic equations
- Wiris equation editor
- GeoGebraTube integration
- H5P.com integration
- Serlo.org content integration

### Further Plugins

- Code highlighting

Feel free to write your own plugin to extend edtr.io for your use case!

### Status

[![Build status](https://img.shields.io/circleci/project/github/edtr-io/edtr-io/master.svg)](https://circleci.com/gh/edtr-io/edtr-io/tree/master) [![Kanban board](https://img.shields.io/badge/Kanban-board-brightgreen.svg)](https://github.com/orgs/edtr-io/projects/1)

Edtr.io is currently in a phase of intense development. Features are added by the day. Its UX is being defined. Our working prototype is in use, being tested by serlo.org’s community. The prototype is not ready for the public at large yet, but expect news soon: a first demo should come in the next few weeks.

## Contacts

Case you want to use the editor for the education sector,\
 contact [serlo.org](mailto:de@serlo.org)

Commercial support is available through out partner Splish. For all questions on the editor, for commercial integration, or in case you need a partner for plugin development,\
 please contact [Splish](mailto:edtr-io@splish.me)

Want to contribute?
Our development team is active at\
 Rocket.chat. (still waiting for the link...)\
Drop us a line, we'll answer!

## Learn More

About [serlo.org and its vision](https://en.serlo.org/serlo)\
About our integration partner, [Splish](http://splish.me)\
About the [HPI Schul-Cloud](https://hpi.de/en/open-campus/hpi-initiatives/schul-cloud.html)\
About the [Hasso Plattner Institut](https://hpi.de/en/the-hpi/overview.html)
