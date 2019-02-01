import * as React from 'react'
import {createDocumentIdentifier, StatefulPlugin} from "@edtr-io/core";
import {RowsPlugin, RowsState} from "./editor";

export const rowsPlugin : StatefulPlugin<RowsState> = {
  Component: RowsPlugin,
  createInitialState: () => {
    return {
      rows: [
        createDocumentIdentifier()
      ]
    }
  }
}