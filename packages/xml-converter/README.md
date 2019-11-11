# Specification: Conversion of editor plugins to XML

## Assumption: Structure of editor plugins

For the following conversion we make the following assumptions about the structure of an editor plugin:
An editor plugins describes the syntax tree of a document or part of a document.
It is described by the following types:

```
type Plugin = {
  plugin: string,     // name of the plugin
  state?: PluginState // internal state of the plugin (In case it is `undefined`
                      // we have a stateless plugin)
}

type PluginState = boolean | number | PluginState[] |
                   { [property: string]: PluginState } | Plugin
```

## Functions

The function `pluginToXml()` converts an editor plugin into a XML string.
