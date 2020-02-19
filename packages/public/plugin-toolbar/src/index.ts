/**
 * Defines the Interface for the Edtr.io plugin toolbar
 *
 * @remarks
 * The `@edtr-io/plugin-toolbar` defines the {@link PluginToolbar | PluginToolbar} interface that needs to be implemented
 * to provide a custom plugin toolbar. See {@link @edtr-io/default-plugin-toolbar# | `@edtr-io/default-plugin-toolbar`}
 * for the default plugin toolbar used by Edtr.io
 *
 * @packageDocumentation
 */
import * as InternalPluginToolbar from '@edtr-io/internal__plugin-toolbar/beta'

/**
 * Type alias for {@link @edtr-io/internal__plugin-toolbar#PluginToolbarButtonProps | PluginToolbarButtonProps}
 *
 * @beta
 */
export type PluginToolbarButtonProps = InternalPluginToolbar.PluginToolbarButtonProps

/**
 * Type alias for {@link @edtr-io/internal__plugin-toolbar#PluginToolbarOverlayButtonProps | PluginToolbarOverlayButtonProps}
 *
 * @beta
 */
export type PluginToolbarOverlayButtonProps = InternalPluginToolbar.PluginToolbarOverlayButtonProps

/**
 * Type alias for {@link @edtr-io/internal__plugin-toolbar#OverlayButtonProps | OverlayButtonProps}
 *
 * @beta
 */
export type OverlayButtonProps = InternalPluginToolbar.OverlayButtonProps

/**
 * Type alias for {@link @edtr-io/internal__plugin-toolbar#OverlayCheckboxProps | OverlayCheckboxProps}
 *
 * @beta
 */
export type OverlayCheckboxProps = InternalPluginToolbar.OverlayCheckboxProps

/**
 * Type alias for {@link @edtr-io/internal__plugin-toolbar#OverlayInputProps | OverlayInputProps}
 *
 * @beta
 */
export type OverlayInputProps = InternalPluginToolbar.OverlayInputProps

/**
 * Type alias for {@link @edtr-io/internal__plugin-toolbar#OverlaySelectProps | OverlaySelectProps}
 *
 * @beta
 */
export type OverlaySelectProps = InternalPluginToolbar.OverlaySelectProps

/**
 * Type alias for {@link @edtr-io/internal__plugin-toolbar#OverlayTextareaProps | OverlayTextareaProps}
 *
 * @beta
 */
export type OverlayTextareaProps = InternalPluginToolbar.OverlayTextareaProps

/**
 * Type alias for {@link @edtr-io/internal__plugin-toolbar#PluginToolbar | PluginToolbar}
 *
 * @beta
 */
export type PluginToolbar = InternalPluginToolbar.PluginToolbar
