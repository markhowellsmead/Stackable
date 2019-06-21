/**
 * All frontend scripts required by our blocks should be included here.
 *
 * This is the file that Webpack is compiling into blocks.frontend.build.js
 */

const contextBlocks = require.context(
	'./block', // Search within the src/blocks directory.
	true, // Search recursively.
	/frontend\.js$/ // Match any frontend.js.
)
const contextComponents = require.context(
	'./components', // Search within the src/blocks directory.
	true, // Search recursively.
	/frontend\.js$/ // Match any frontend.js.
)

// Import.
contextBlocks.keys().forEach( key => contextBlocks( key ) )
contextComponents.keys().forEach( key => contextComponents( key ) )
