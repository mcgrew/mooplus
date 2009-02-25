/*

Script: asset/style.js

License: MIT license.

Copyright: Thomas McGrew, (c)2009, http://ecolihub.org

*/

/*

Class: Asset.Style

Syntax:
	(start code)
	new Asset.Style( options );
	(end)

Options:
	priority - Setting this property to 0 or a number less than the total loaded stylesheets will allow loaded stylesheets or other rulesets to override the rules in this set. By default it is set to 'highest'.

Example:
	(start code)
	var rules = new Asset.Style( );
	rules.addRule( "body", "background-color: yellow" );
	rules.addRules({
		body: {
			padding:"5px",
			"font-size":"12px"
		}
		".large": "font-size:3em"
		"#small": {
			"font-size":"0.8em",
			color:"#999"
			}
	});
	(end)
Attributes and selectors which contain non-alphanumeric characters must be enclosed in quotes.
Quotes are optional on all other attributes.
*/
Asset.Style = new Class({
	Implements: Options,
	options: {
		priority: 'highest'
	},
	initialize: function( options ) {
		this.setOptions( options )

		// create the style node for all browsers
		this.styleNode = new Element("style",{
			'type':'text/css',
			'media':'screen'
		}

		var styles = $$('head link,head style');
		if ( this.options.priority == 'highest' )
			this.options.priority =  styles.length;
		var nextSibling = ( styles[ this.options.priority ] ) ? styles[ this.options.priority ] : null;
		document.head.insertBefore( this.styleNode, nextSibling );
/*
		if ( Browser.Engine.trident ) // IE
		{
			if ( document.styleSheets && document.styleSheets.length > 0 )
			{
					this.styleNode = document.styleSheets[ this.options.priority ];
			}
			else
			{
				this.styleNode = null;
				alert( "Unable to add style rules!" );
			}
		}
*/
		},

	addRule: function( selector, declaration )
	{
		// append a rule for good browsers
		if (!Browser.Engine.trident)
			this.styleNode.appendChild(document.createTextNode(selector + " {" + declaration + "}"));
		// use alternative methods for IE
		else
			try { this.styleNode.addRule( selector, declaration ); }
			catch( e ) { /* alert( "Unable to apply rule " + selector + " {" + declaration + "}" );*/ }
	},
	addRules: function( rules )
	{
		for ( var i in rules )
		{
			if ( typeof( rules[ i ] ) == "string" )
				this.addRule( i, rules[ i ] ); // for example addRules({ '.floater':'float:right' })
			else
				for( var j in rules[ i ] )
				this.addRule( i, j+':'+rules[ i ][ j ] ); // for example addRules({ '.floater':{ 'float':'right', 'width':'25%' })
		}
	}
});

/*
function: Hash.fromArrays
		accepts 2 arrays and converts them into a hash using the first array as the keys, second array as the values. If the keyArray contains duplicate keys, only the last value will be used.
*/
Hash.fromArrays = function( keyArray, valueArray )
{
		var h = new Hash({ });
		for( var i=0; i < keyArray.length && i < valueArray.length; i++ )
				h.set( keyArray[ i ], valueArray[ i ] );
		return h;
}

