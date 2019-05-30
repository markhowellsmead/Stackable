export * from './font'
export * from './attributes'
export * from './typography'
export * from './background'
export * from './styles'
import { __ } from '@wordpress/i18n'

/**
 * Returns an array range of numbers.
 *
 * @param {number} start Starting number range.
 * @param {number} end Ending number range.
 *
 * @return {Array} The range of start to end.
 *
 * @see https://stackoverflow.com/questions/36947847/how-to-generate-range-of-numbers-from-0-to-n-in-es2015-only
 */
export const range = ( start, end ) => {
	return Array.from( { length: ( end - start ) }, ( v, k ) => k + start )
}

/**
 * From a URL, get the video ID and provider: YouTube or Vimeo.
 *
 * @param {string} url
 *
 * @return {Object} An object containing the video ID and provider name.
 */
export const getVideoProviderFromURL = url => {
	let id = ''

	// Check for YouTube.
	id = ( url.match( /youtube\.com\/watch\?v=([^\&\?\/]+)/i ) || [] )[ 1 ]

	if ( ! id ) {
		id = ( url.match( /youtube\.com\/embed\/([^\&\?\/]+)/i ) || [] )[ 1 ]
	}
	if ( ! id ) {
		id = ( url.match( /youtube\.com\/v\/([^\&\?\/]+)/i ) || [] )[ 1 ]
	}
	if ( ! id ) {
		id = ( url.match( /youtu\.be\/([^\&\?\/]+)/i ) || [] )[ 1 ]
	}

	if ( id ) {
		return {
			type: 'youtube',
			id,
		}
	}

	// Check for Vimeo.
	id = ( url.match( /vimeo\.com\/(\w*\/)*(\d+)/i ) || [] )[ 2 ]
	if ( ! id ) {
		id = ( url.match( /^\d+$/i ) || [] )[ 0 ]
	}

	if ( id ) {
		return {
			type: 'vimeo',
			id,
		}
	}

	return {
		type: 'youtube',
		id: url,
	}
}

/**
 * Generates a placeholder text for short to long descriptions.
 * Deprecations are dependent on this, this shouldn't change.
 *
 * @param {string} length The length of the placeholder. Values are: short, medium, long, normal. Defaults to normal.
 *
 * @return {string} Placeholder string.
 */
export const descriptionPlaceholder = length => {
	if ( length === 'short' ) {
		return __( 'Description for this block. You can use this space for describing your block.' )
	} else if ( length === 'medium' ) {
		return `${ descriptionPlaceholder() } ${ descriptionPlaceholder( 'short' ) }`
	} else if ( length === 'long' ) {
		return `${ descriptionPlaceholder( 'medium' ) } ${ descriptionPlaceholder() } ${ descriptionPlaceholder( 'short' ) }`
	}
	return __( 'Description for this block. Use this space for describing your block. Any text will do.' )
}

/**
 * Are we inside the Gutenberg Block Editor?
 *
 * @return {boolean} True if inside the Gutenberg Block Editor, false if not (e.g. in the frontend).
 */
export const isEditor = () => typeof window.wp !== 'undefined' && typeof window.wp.editor !== 'undefined'

/**
 * Simple CSS minification.
 *
 * @see https://stackoverflow.com/questions/15411263/how-do-i-write-a-better-regexp-for-css-minification-in-php
 *
 * @param {string} css CSS to minify.
 * @param {boolean} important Add !important to all rules.
 *
 * @return {string} Minified CSS
 */
export const minifyCSS = ( css, important = false ) => {
	const minified = css.replace( /\/\*.*?\*\//g, '' ) // Comments.
		.replace( /\n\s*\n/g, '' ) // Comments.
		.replace( /[\n\r \t]/g, ' ' ) // Spaces.
		.replace( / +/g, ' ' ) // Multi-spaces.
		.replace( / ?([,:;{}]) ?/g, '$1' ) // Extra spaces.
		.replace( /[^\}\{]+\{\}/g, '' ) // Blank selectors.
		.replace( /[^\}\{]+\{\}/g, '' ) // Blank selectors. Repeat to catch empty media queries.
		.replace( /;}/g, '}' ) // Trailing semi-colon.
		.trim()

	if ( ! important ) {
		return minified
	}

	return minified
		.replace( /\s?\!important/g, '' ) // Remove all !important
		.replace( /([;\}])/g, ' !important$1' ) // Add our own !important
		.trim()
}

/**
 * Ensures the cssSelector is only applied to the uniqueClassName element.
 * Wraps the cssSelector with a uniqueClassName, and takes into account the mainClassName.
 *
 * For example:
 * .title-block -> .my-title-be8d9a.title-block
 * .title-block span -> .my-title-be8d9a.title-block span
 * span -> .my-title-be8d9a span
 *
 * @param {string} cssSelector The CSS selector.
 * @param {string} mainClassName The main class of the block to target.
 * @param {string} uniqueClassName The unique parent classname to wrap the selector.
 * @param {string} wrapSelector All selectors will be wrapped in this if provided.
 *
 * @return {string} The modified CSS selector.
 */
export const prependCSSClass = ( cssSelector, mainClassName = '', uniqueClassName = '', wrapSelector = '' ) => {
	return cssSelector.trim().replace( /[\n\s\t]+/g, ' ' )
		.split( ',' )
		.map( s => {
			let newSelector = ''
			if ( ! uniqueClassName || ! mainClassName ) {
				newSelector = s
			} else if ( uniqueClassName && ! mainClassName ) {
				newSelector = `.${ uniqueClassName } ${ s.trim() }`
			} else {
				newSelector = `.${ uniqueClassName } ${ s.trim() }`
					.replace( new RegExp( `(.${ uniqueClassName }) (.${ mainClassName }(#|:|\\[|\\.|\\s|$))`, 'g' ), '$1$2' )
			}
			return wrapSelector ? `${ wrapSelector } ${ newSelector }` : newSelector
		} )
		.join( ', ' )
}

/**
 * Global responsive setting functions. This is used by the
 * WhenResponsiveScreen and ResponsiveToggle components to
 * specify the current responsive screen size.
 */
let _currentSelectedScreen = 'desktop'
export const getSelectedScreen = () => _currentSelectedScreen
export const setSelectedScreen = value => _currentSelectedScreen = value

let _currentScreenPickerIsOpen = false
export const isScreenPickerOpen = () => _currentScreenPickerIsOpen
export const setIsScreenPickerOpen = value => _currentScreenPickerIsOpen = value