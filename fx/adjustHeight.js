/*
Function: Fx.adjustHeight
		Adjusts the height of a child element to match it's parent. All elements marked with the 'fullHeight' class will be resized to the size of their parent element. This will effectively do what one would think style="height:100%" would do.

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
Fx.adjustHeight = function ( event )
{
		var elements = $$( '.fullHeight' );
		// first, reset the height of all columns
		elements.each( function( element ){ element.style.height =  ""; });
		elements.each( function( element ){
				// IE6 is doing something strange here, so we will catch any errors and check the sanity.
				try{
						parentHeight = $(element.getParent( )).getInnerHeight( )
						if ( parentHeight )
								element.setStyle( 'height',  parentHeight - element.getBorderHeight( ) );
				} catch(e){}
		});
};
window.addEvent( 'load', function( ){ Fx.adjustHeight.delay( 1000 ); });
window.addEvent( 'resize', Fx.adjustHeight );


