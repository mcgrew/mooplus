/*
Function: Fx.adjustHeight
		Adjusts the height of a child element to match it's parent. All elements marked with the 'fullHeight' class will be resized to the size of their parent element. This will effectively do what one would think style="height:100%" would do.

License: MIT license.

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


