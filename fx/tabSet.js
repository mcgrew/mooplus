/*

Script: fx/tabSet.js

License: MIT license.

Copyright: Thomas McGrew, (c)2009, http://ecolihub.org

*/


/*

Class: Fx.TabSet
		A class for creating a tabbed interface on a web page. This will create a new container element which can be added to the page by calling something like:
		(code start)
		var tabs = new TabSet( )
		document.body.appendChild( tabs.container );
		(end)

Options:
		container - The html <div> element you wish to use for the tab container. This argument is optional and a new <div> element will be created if omitted. Remember to insert the new element into the page somewhere if so.
		tabHeight - the desired height of the tabs in pixels.
		contentHeight - What to set the tab container height to. Valid values are:
				'auto' - automatically resize content containers so that they are of equal height. (default)
				'default' - let the browser determine the size of each container.
				number - the desired height in pixels.

*/

Fx.TabSet = new Class({
		Implements: Options,
		options: {
				container: null,
				tabHeight: false,
				contentHeight:'auto'
		},
		initialize: function( options )
		{
				this.setOptions( options );
				if ( !Fx.TabSet.instances ) Fx.TabSet.instances = new Hash( );
				if ( !Fx.TabSet.CSS ) Fx.TabSet.addCSS( );
				if ( !this.options.container || $(this.options.container).tagName.toLowerCase( ) != 'div' )
						this.container = new Element( 'div', { 'class':'tabContainer' } );
				else
				{
						this.container = $(this.options.container);
						// make sure this is not already a tab set.
						var instances = Fx.TabSet.instances.getValues( );
						for ( var i=0; i < instances.length; i++ )
								if ( instances[ i ].container == this.container )
										return instances[ i ];
						this.container.addClass( 'tabContainer' );
				}

				this.tabHolder = this.container.insertBefore(
						new Element( 'ul', { 'class':'tabHolder' } ),
						this.container.firstChild
				);
				this.tabHolderBottom = this.container.appendChild( new Element( 'ul', { 'class':'tabHolder' } ))

				this.container.getChildren( 'div' ).each( function( div ){
						opts = {
								tabPosition: div.getOption( 'tabPosition' ),
								contentElement: div
						}
						if ( div.title ) opts.title = div.title;
						this.append( new Fx.Tab( opts ));
				}.bind( this ));
				if ( !this.container.id || !this.container.id.length ) this.container.id = 'tabSet' + Fx.TabSet.instances.getLength( );
				Fx.TabSet.instances.set( this.container.id, this );
				window.addEvent( 'resize', this.resize.bind( this ) );
		},
		/*
		Function: append

		Arguments:
				Tab - a Tab created with <i>new Fx.TabSet.Tab( )</i>
		*/
		append: function( Tab )
		{
				Tab.parent = this;
				if ( Tab.options.tabPosition == 'bottom' )
				{
						Tab.tab.addClass( 'bottomTab' );
						this.tabHolderBottom.appendChild( Tab.tab );
				}
				else
						this.tabHolder.appendChild( Tab.tab );
				if ( this.options.tabHeight )
						Tab.tab.style.height = this.options.tabHeight + 'px';

				this.container.insertBefore( Tab.content, this.tabHolderBottom );
				if ( !this.tabs )
				{
						this.tabs = [ ];
						Tab.tab.addClass( 'active' );
						Tab.content.style.display = '';
				}
				else
						Tab.content.style.display = 'none';
				this.tabs.push( Tab );
				this.resize( )
				return Tab;
		},
		/*
		Function: resize
				Resizes the tab holders and makes all tab content containers the same height.

		Arguments:
				None
		*/
		resizeLastCalled: 0, // limit how quickly this can be called again (IE fix).
		resize: function( )
		{
				if ( !( this.resizeLastCalled - new Date( ).getSeconds( ) ) )
						return;
				this.resizeLastCalled = new Date( ).getSeconds( );

				this.resizeTabHolder.delay( 100, this, this.tabHolder );
				this.resizeTabHolder.delay( 100, this, this.tabHolderBottom );

				if ( $type( this.options.contentHeight )  == 'number' )
				{
						this.container.getChildren( 'div' ).each( function( panel ){
								panel.style.height = this.options.contentHeight + "px";
						});
				}
				else if ( this.options.contentHeight == 'auto' )
				{
						var maxHeight = 0;
						this.container.getChildren( 'div' ).each( function( panel ){
								// reset the tab height
								panel.style.height = "";
								// reset the display
								var oldDisplay = panel.style.display;
								panel.style.display = "";
								if ( panel.getInnerHeight( ) > maxHeight )
										maxHeight = panel.getInnerHeight( );
								panel.style.display = oldDisplay;
						});
						this.container.getChildren( 'div' ).each( function( panel ){
								panel.style.height = maxHeight + "px";
						});
				}
				return this;
		},
		resizeTabHolder: function( tabHolder )
		{
				var tabs = tabHolder.getChildren( 'li' );
				tabs.each( function( tab ){
						if ( tabHolder.getInnerHeight( ) <= tab.getHeight( ) )
								tabHolder.style.height = tab.getHeight( ) + "px";
				});
				if ( tabs.length && !tabHolder.getInnerHeight( ) && !Browser.Engine.trident4 )
				{
						this.resizeTabHolder.delay( 200, this, tabHolder );
				}
		},
		destroy: function( )
		{
				Fx.TabSet.instances.erase( this.container.id );
				[ this.tabHolder, this.tabHolderBottom, this.container ].each( function( el ){
						if ( el.getParent( ) )
								el.getParent( ).removeChild( el );
				});
		},
		getActiveTab: function( )
		{
				for( var i=0; i < this.tabs.length; i++ )
						if ( this.tabs[ i ].isActive( ) ) return this.tabs[ i ];
				return null;
		},
		toElement: function( ) { return this.container }
});

/*
Class: Fx.Tab
*/
Fx.Tab = new Class({
		Implements: Options,
		options: {
				title:'No Title',
				tabPosition:'top',
				tabElement:null,
				contentElement:null,
				contentHTML:null
		},

		initialize: function( options )
		{
				this.setOptions( options );
				if ( !window.tabIDCounter ) window.tabIDCounter = 0;
				if ( this.tabElement && $(this.tabElement).tagName == 'li' )
				{

				}
				else
				{
						this.tab = new Element( 'li', {
								'id':'tab'+tabIDCounter,
								'html':this.options.title
						});
				}
				this.tab.addEvent( 'click', this.activate.bind( this ) );
				if ( this.options.contentElement )
				{
						this.content = $(this.options.contentElement);
						this.content.id = 'tabContent'+tabIDCounter++;
						$(this.content).addClass('tabContent');
						if ( this.options.contentHTML )
								this.content.set( 'html', this.options.contentHTML );
				}
				else
				{
						this.content = new Element( 'div', {
								'id':'tabContent'+tabIDCounter++,
								'class':'tabContent',
								'html':this.options.contentHTML
						});
				}
		},

		activate: function( )
		{
				if ( this.parent )
						this.parent.tabs.each( function( tab ){
								tab.deactivate( );
						});
				this.tab.addClass( 'active' );
				this.content.setStyle( 'display', '' );
		},
		deactivate: function( )
		{
				this.tab.removeClass( 'active' );
				this.content.setStyle( 'display', 'none' );
		},
		isActive: function( )
		{
				return this.tab.hasClass( 'active' );
		},
		getId: function( )
		{
				return this.tab.id;
		}
});

		/*
		Function: Fx.TabSet.addCSS( )
				Adds the CSS necessary to make the tabs display properly. This can be overridden by including a custom CSS file or style tag.

		Arguments:
				None
		*/
Fx.TabSet.addCSS = function( )
{
		// add CSS
		if ( Fx.TabSet.CSS ) return Fx.TabSet.CSS;
		Fx.TabSet.CSS = new Asset.Style({
				priority: 0
		})
		Fx.TabSet.CSS.addRules({
				/* The container for the tabs */
				'ul.tabHolder': {
						padding: 0,
						margin: 0,
						display: 'block'
				},

				/* The tabs themselves */
				'ul.tabHolder li': {
						'float': 'left',
						'display': 'block',
						'border-color': '#ccc',
						'border-style': 'solid',
						'border-width': '1px 1px 0 1px',
						'list-style-type': 'none',
						'cursor': 'pointer',
						'padding': '2px 10px 1px 10px',
						'margin': '0 5px 0 0',
						'font-weight': 'bold',
						'color': '#aaa'
				},

				/* Tabs underneath the content containers */
				'ul.tabHolder li.bottomTab': {
						'border-width': '0 1px 1px 1px'
				},

				/* Highlighted tab (when you have the mouse over it */
				'ul.tabHolder li:hover': {
						'color': '#666'
				},

				/* The activated tab */
				'ul.tabHolder li.active': {
						'background-color': '#fff',
						'color': '#000'
				},

				/* The tab content holders */
				'div.tabContainer div.tabContent': {
						'border': '1px solid #ccc'
				}
		});
		return Fx.TabSet.CSS;
};

/*
Function: Fx.Tabs.init( )
		Initializes tabs from HTML. The tabs should be in the following format:

		(start code)
		<div class="tabContainer">
				<div title="Tab 1 Label">
						Tab 1 content
				</div>
				<div title="Tab 2 Label">
						Tab 2 content
				</div>
				...
		</div>
		(end)

		The function will automatically convert these into tabs.  Also bear in mind that tab content elements DO NOT retain their id attribute. This is replaced in the init function with an id which allows the tab to work. Unlike class names, elements cannot have more than one id attribute. If a unique attribute is necessary for css styling purposes, I recommend you use a unique class instead.

		Tabs options:
		Options are placed in the class name of the elements in the format class="option:value". Valid options are as follows:

		tabLocation
				bottom - places the tab for this content at the bottom of the tabContainer instead of the top.

		Unrecognized options are ignored.
*/
Fx.TabSet.init = function( )
{
		$$('.tabContainer').each( function( div ){
				new Fx.TabSet({
						container:div
				});
		});
};

window.addEvent( 'domready', Fx.TabSet.init );


