import 'objectFitPolyfill'
import domReady from '@wordpress/dom-ready'

domReady( () => {
	// Fix for Edge & IE11 not having background videos cover 100% #126
	window.objectFitPolyfill( document.querySelectorAll( '.ugb-video-background' ) )
} )
