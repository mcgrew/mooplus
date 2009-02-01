/*

Script: xml/xmlWrapper.js

License: MIT license.

Copyright: Thomas McGrew, (c)2009, http://ecolihub.org

*/

/*

Class: XMLWrapper
        Creates a new Document Wrapper object. If no options are specified, the document will contain only a processing instruction.  If a root tag is specified, the document will contain that single root tag. If the root tag has a namespace prefix, the namespace argument must specify the URL that identifies the namespace.

*/
var XMLWrapper = new Class({
        $family: { name: 'xmlwrapper' },
        Implements: Options,
        options: {
                rootTag: null,
                rootElement: null,
                document: null,
                namespace: null,
                processingInstruction:true,
                xmlVersion:'1.0',
                charset:'UTF-8'
        },

        initialize: function( options  )
        {
                this.setOptions( options );
                if ( this.options.document )
                {
                        this.doc = this.options.document;
                        return this;
                }
                if (document.implementation && document.implementation.createDocument) {
                        // This is the W3C standard way to do it
                        this.doc =  document.implementation.createDocument(this.options.namespace, this.options.rootTag, null);
                }
                else { // This is the IE way to do it
                        // Create an empty document as an ActiveX object
                        // If there is no root element, this is all we have to do
                        this.doc = new ActiveXObject("MSXML2.DOMDocument");
                        // If there is a root tag, initialize the document
                        if (this.options.rootTag) {
                                // Look for a namespace prefix
                                var prefix = "";
                                var tagname = this.options.rootTag;
                                var p = this.options.rootTag.indexOf(':');
                                if (p != -1) {
                                        prefix = this.options.rootTag.substring(0, p);
                                                tagname = this.options.rootTag.substring(p+1);
                                }
                                // If we have a namespace, we must have a namespace prefix
                                // If we do not have a namespace, we discard any prefix
//                              if (this.options.namespace) {
//                                      if (!prefix) prefix = "a0"; // What Firefox uses
//                              }
                                else prefix = "";
                                // Create the root element (with optional namespace) as a
                                // string of text
                                var text = "<" + (prefix?(prefix+":"):"") +  tagname +
                                        (this.options.namespace
                                        ?(" xmlns:" + prefix + '="' + this.options.namespace +'"')
                                        :"") +
                                        "/>";
                                // And parse that text into the empty document
                                this.doc.loadXML(text);
                        }
                }
                if ( !this.options.rootTag && this.options.rootElement )
                {
                        this.doc.appendChild( this.options.rootElement.cloneNode( true ) );
                }
                if ( this.options.processingInstruction )
                        this.doc.insertBefore( this.doc.createProcessingInstruction( 'xml', 'version="'+this.options.xmlVersion+'" encoding="'+this.options.charset+'"' ), this.doc.firstChild );
                this.documentElement = this.lastChild = this.doc.lastChild;
        },

        toString: function( selector, context ){
                if ( !selector ) return new XMLSerializer( ).serializeToString( this.doc );
                else return this.toStrings( selector, context ).join('');
        },

        toStrings: function( selector, context ){
                var returnValue = [ ];
                this.getElements( selector, context ).each( function( node ){
                        returnValue.push(  new XMLSerializer( ).serializeToString( node ));
                });
                return returnValue;
        },

        insert: function( selector, newTag, nextSibling, context )
        {
                if ( $type( nextSibling ) == 'string' )
                        nextSibling = ( nextSibling[0] == '/' ) ?
                                this.getElement( [ selector, nextSibling ].join( '' ), context):
                                this.getElement( [ selector, nextSibling ].join( '/' ), context );
                if ( $type( newTag ) == 'string' )
                {
                        if ( this.doc.createElementNS )
                                newTag = this.doc.createElementNS( this.options.namespace, newTag );
                        else
                                newTag = this.doc.createElement( newTag );
                }
                else
                {
                        //clone the node
                        var clonedTag = newTag.cloneNode( true );
                        if ( newTag.parentNode )
                                newTag.parentNode.removeChild( newTag );
                        newTag = clonedTag;
                }

                if ( $type( selector ) == 'string' )
                        selector = this.getElement( selector );
                return selector.insertBefore( newTag, nextSibling );
        },

        getElement: function( selector, context )
        {
                if ( $type( selector ) != 'string' ) return selector;
                        var elements = this.getElements( selector, context );
                if ( elements.length )
                        return elements.item( 0 );
                return null;
        },

        getElements: function( selector, context )
        {
                if ( $type( selector ) != 'string' ) return selector;
                // Todo: implement xpath context
                //if ( $type( context ) == 'string' ) context = this.getElement( context );
                //context = ( context ) ? context : this.doc;
                return new XPathResult({ rootNode: this.doc, query: selector })
        },

        getValue: function( selector, context )
        {
                var node = this.getElement( selector, context );
                return ( node && node.firstChild ) ? node.firstChild.nodeValue : null;
        },
        setValue: function( selector, text, context )
        {
                selector = this.getElement( selector, context );
                while( selector.firstChild ) selector.removeChild( selector.firstChild )
                if ( text )
                        selector.appendChild( this.doc.createTextNode( text ));
                return selector;
        },

        getValues: function( selector, context )
        {
                var returnValue = [ ];
                this.getElements( selector, context ).each( function( node ){
                                returnValue.push( ( node.firstChild ) ? node.firstChild.nodeValue : null )
                });
                return returnValue;
        },
        setValues: function( selector, textArray, context )
        {
                selector = this.getElements( selector, context );
                for( var i=0; i < textArray.length; i++ )
                {
                        while( selector[i].firstChild ) selector.removeChild( selector[i].firstChild )
                        selector[i].appendChild( this.doc.createTextNode( textArray[ i ] ));
                }
                return selector;
        },
        getTagName: function( selector, context )
        {
                return getElement( selector, context ).tagName;
        },
        getTagNames: function( selector, context )
        {
                var tags = this.getElements( selector, context );
                for( var i=0; i < tags.length; i++ )
                        tags[ i ] = tags[ i ].tagName;
                return tags;
        },

        removeElement: function( selector, context )
        {
                selector = this.getElement( selector, context )
                selector.parentNode.removeChild( selector );
                return selector;
        },
        removeElements: function( selector, context )
        {
                selector = this.getElements( selector, context );
                for( var i=0; i < selector.length; i++ )
                        selector[i].parentNode.removeChild( selector[i] )
                return selector;
        },

        // temporary compatibility functions - these should not be documented (or used)
        getElementsByTagName: function( tag )
        {
                return this.doc.getElementsByTagName( tag );
        },
        createElement: function( tag )
        {
                return this.doc.createElement( this.options.namespace, tag );
        },
        createTextNode: function( text )
        {
                return this.doc.createTextNode( text );
        }
});

var XPathResult = new Class({
        $family: { name: 'xpath' },
        options: {
                rootNode: document,
                query: false
        },
        setOptions: function( options )
        {
                // IE is choking on the mootools implementation of this
                for( var i in  options ) this.options[i] = options[i]
        },
        initialize: function( options )
        {
                this.setOptions( options );
//              for( var i in  options ) this.options[i] = options[i]
                this.length = 0;
                this.refresh( );
        },
        item: function( index )
        {
                return this.items[ index ];
        },
        each: function( func )
        {
                this.items.each( func );
        },
        refresh: function( )
        {
                this.items = [ ];
                multiselect = this.options.query.split( '|' );
                for ( h=0; h < multiselect.length; h++ )
                {
                        var selectors = multiselect[ h ].trim( ).replace( /\/\//g , '/;' ).split( '/' );
                        var selected, index, tmp, tmpArray=[ ];
                        var items = [ this.options.rootNode ];
                        if ( selectors[0] == "" )
                        {
                                selectors = selectors.slice( 1 );
                        }
                        else if ( selectors.length == 0 )
                        {
                                items.empty( );
                                tmp = this.options.rootNode.getElementsByTagName( selectors[ 0 ] )
                                for( var i=0; i < tmp.length; i++ )
                                {
                                        items.extend( tmp[ i ].childNodes );
                                }

                                selectors = selectors.slice( 1 );

                        }
                        var last = function( ){ return tmpArray.length };
                        for( var i=0; i < selectors.length; i++ )
                        {
                                selected = $A(items);
                                items.empty( ); tmpArray.empty( )
                                index = false;
                                if ( tmp = selectors[ i ].match( /\[([a-zA-Z0-9\(\)\-\+\*\s]+)\]$/ ) )
                                {
                                        index = tmp[ 1 ].replace( ' div ', ' / ' );
                                        selectors[ i ] = selectors[ i ].replace( tmp[ 0 ], '' );
                                }
                                if ( selectors[ i ].charAt( 0 ) == ';' )
                                {
                                        var s = selectors[ i ].substring( 1 );
                                        for( var j=0; j < selected.length; j++ )
                                        {
                                                tmp =  selected[ j ].getElementsByTagName( s )
                                                for( var k=0; k < tmp.length; k++ ) tmpArray.push( tmp[ k ] );
                                        }
                                }
                                else
                                {
                                        for( var j=0; j < selected.length; j++ )
                                        {
                                                tmp = selected[ j ].childNodes
                                                for ( var k=0; k < tmp.length; k++ )
                                                        if ( tmp[ k ].tagName == selectors[ i ] || selectors[ i ] == '*' ) tmpArray.push( tmp[ k ] );
                                        }
                                }
                                if ( index ) tmpArray = [ tmpArray[ eval( index ) -1 ] ];
                                items.extend( tmpArray );
                        }
                        this.items.extend( items );
                }
                for( var i=0; this[i] || this.items[i]; i++ )
                        this[i] = this.items[i];
                this.length = this.items.length
        }
});

