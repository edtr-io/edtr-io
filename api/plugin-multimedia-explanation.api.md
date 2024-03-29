## API Report File for "@edtr-io/plugin-multimedia-explanation"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { BooleanStateType } from '@edtr-io/plugin';
import { ChildStateType } from '@edtr-io/plugin';
import { ChildStateTypeConfig } from '@edtr-io/plugin';
import { DeepPartial } from '@edtr-io/ui';
import { EditorPlugin } from '@edtr-io/plugin';
import { EditorPluginProps } from '@edtr-io/plugin';
import { NumberStateType } from '@edtr-io/plugin';
import { ObjectStateType } from '@edtr-io/plugin';

// @public (undocumented)
export function createMultimediaExplanationPlugin(config: MultimediaExplanationConfig): EditorPlugin<MultimediaExplanationPluginState, MultimediaExplanationConfig>;

// @public (undocumented)
export interface MultimediaExplanationConfig extends Omit<MultimediaExplanationPluginConfig, 'features' | 'i18n'> {
    // (undocumented)
    explanation: ChildStateTypeConfig;
    // (undocumented)
    features?: {
        importance?: boolean;
    };
    // (undocumented)
    i18n?: DeepPartial<MultimediaExplanationPluginConfig['i18n']>;
}

// @public (undocumented)
export interface MultimediaExplanationPluginConfig {
    // (undocumented)
    features: {
        importance: boolean;
    };
    // (undocumented)
    i18n: {
        changeMultimediaType: string;
        reset: string;
        illustrating: {
            label: string;
            values: {
                illustrating: string;
                explaining: string;
            };
        };
    };
    // (undocumented)
    plugins: {
        name: string;
        title: string;
    }[];
}

// @public (undocumented)
export type MultimediaExplanationPluginState = ObjectStateType<{
    explanation: ChildStateType;
    multimedia: ChildStateType;
    illustrating: BooleanStateType;
    width: NumberStateType;
}>;

// @public (undocumented)
export type MultimediaExplanationProps = EditorPluginProps<MultimediaExplanationPluginState, MultimediaExplanationConfig>;

// (No @packageDocumentation comment for this package)

```
