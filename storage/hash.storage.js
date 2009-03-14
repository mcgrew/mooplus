/*
Script: storage/hash.storage.js
		A class to store data using localStorage from the HTML5 API if available. Falls back to using Hash.Cookie if not.

License:
        MIT license.

        Copyright (c) 2009 Thomas McGrew

        Permission is hereby granted, free of charge, to any person
        obtaining a copy of this software and associated documentation
        files (the "Software"), to deal in the Software without
        restriction, including without limitation the rights to use,
        copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the
        Software is furnished to do so, subject to the following
        conditions:

        The above copyright notice and this permission notice shall be
        included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
        OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
        NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
        HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
        WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
        OTHER DEALINGS IN THE SOFTWARE.

Copyright: Thomas McGrew, (c)2009, http://ecolihub.org

*/

/*

Class: Hash.Storage

Extends: Hash.Cookie

Usage: Usage is identical to Hash.Cookie, except that DOM Storage is used in place of cookies when available.

*/


if ( !window.localStorage && window.globalStorage ) // Firefox
		localStorage = globalStorage[ location.hostname ]

Hash.Storage = new Class({
		Extends: Hash.Cookie,
		initialize: function( name, options )
		{
				if ( window.localStorage )
						this.storage = "domStorage";
				else
						this.storage = "cookie";
				this[ this.storage ] = true;
				this.parent( name, { domain: location.hostname, path: '/', duration: 365 } )
		},
		/*

		Function: maxSize
				returns an ESTIMATE of the available storage space for data in bytes. THIS MAY NOT BE EXACT!

		*/
		maxSize: function( )
		{
				if ( this.domStorage )
						if ( Browser.Engine.trident )
								return 10485760;
						return 5242880;
				if ( this.cookie )
						return 4096;
				if ( this.userData )
						return 65536;
		},
		/*

		Function: size
				returns the size of data storage used, in bytes.

		*/
		size: function( ) { return this.read( ).length; },

		/*

		Function: free
				returns an ESTIMATE of the amount of space free for storage in byes. THIS MAY NOT BE EXACT!
		*/
		free: function( ) { return this.maxSize( ) - this.size( ); }
});

if ( window.localStorage )
Hash.Storage.implement({
		write: function( value )
		{
				localStorage[ this.key ] = value;
				return this;
		},

		read: function( )
		{
				if ( !localStorage[ this.key ] ) return null;
				var value = ( localStorage[ this.key ].value ) ? localStorage[ this.key ].value : localStorage[ this.key ];
				return value;
		},

		dispose: function( )
		{
				if ( localStorage[ this.key ] )
						delete localStorage[ this.key ];
				this.load( );
				return this;
		}
});
/*
else if ( Browser.Engine.trident ) // For  IE 6/7 - userData behavior
Hash.Storage.implement({
		initialize: function( name, options )
		{
				this.storage = "userData";
				this.storage[ this.storage ] = true;
//			  if ( !( this.storage = $(name) ) )
//			  {
						this.storageEl = document.createElement( 'span' );
						this.storageEl.id = name;
						this.storageEl.addBehavior("#default#userData");
						this.storageEl.style.display = "none";
//			  }
				document.body.appendChild( this.storage );
				this.parent( name, { domain: location.hostname, path: '/', duration: 365 } )
		},
		write: function( value )
		{
				this.storageEl.setAttribute("sPersist",value);
				this.storageEl.save(this.key);
		},
		read: function( )
		{
				this.storageEl.load(this.key);
				return this.storage.getAttribute("sPersist");
		},
		dispose: function( )
		{
				this.storageEl.setAttribute("sPersist","");
				this.storageEl.save(this.key);
		}

});
*/ /*
else
{

		// Attempt to Initialize Gears
		if (!window.google || !google.gears)
		{

				var factory = null;

				// Firefox
				if (typeof GearsFactory != 'undefined') {
						factory = new GearsFactory();
				}
				else
				{
				// IE
						try {
								factory = new ActiveXObject('Gears.Factory');
								// privateSetGlobalObject is only required and supported on IE Mobile on
								// WinCE.
								if (factory.getBuildInfo().indexOf('ie_mobile') != -1)
										factory.privateSetGlobalObject(this);
						}
						catch (e)
						{
								// Safari
								if ((typeof navigator.mimeTypes != 'undefined')
										&& navigator.mimeTypes["application/x-googlegears"])
								{
										factory = document.createElement("object");
										factory.style.display = "none";
										factory.width = 0;
										factory.height = 0;
										factory.type = "application/x-googlegears";
										document.documentElement.appendChild(factory);
								}
						}
				}

				// *Do not* define any objects if Gears is not installed. This mimics the
				// behavior of Gears defining the objects in the future.
				if (factory) {

						// Now set up the objects, being careful not to overwrite anything.

						// Note: In Internet Explorer for Windows Mobile, you can't add properties to
						// the window object. However, global objects are automatically added as
						// properties of the window object in all browsers.
						if (!window.google) {
								google = {};
						}

						if (!google.gears) {
								google.gears = {factory: factory};
						}
				}
		}
}
*/

