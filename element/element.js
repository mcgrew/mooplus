/*

Script: element/element.js
	Adds functions to the Element class for determining the border size and inner size of an element.

License: MIT license.

Copyright: Thomas McGrew, (c)2009, http://ecolihub.org

*/

Element.implement({
        /*
        Function: getBorderHeight
                This will give the difference between the css height and the true height of the element.

         Arguments:
                None

         Returns:
                An integer containing the height of the element in pixels in the case of success, -1 in case of failure.
         */
        getBorderHeight: function ( )
        {
                var oldHeight = this.style.height;
                var borderHeight = -1;
                this.style.height = '0px';
                try { // makes sure the height gets reset at the end no matter what happens.
                        borderHeight = this.getHeight( );
                } catch( e ) { }
                this.style.height = oldHeight;
                return borderHeight;
        },

        /*
        Function: getBorderWidth
                This will give the difference between the css width and the true width of the element.

         Arguments:
                None

         Returns:
                An integer containing the width of the element in pixels in the case of success, -1 in case of failure.
         */
        getBorderWidth: function ( )
        {
                var oldWidth = this.style.width;
                var borderWidth = -1;
                this.style.width = '0px';
                try { // makes sure the width gets reset at the end no matter what happens.
                        borderWidth = this.getWidth( );
                } catch( e ) { }
                this.style.width = oldWidth;
                return borderWidth;
        },
        /*
        Function: getInnerHeight
                This function will give you the element's height not including any borders which may be present. This is good for calculating what to set the element's CSS height to.

         Arguments:
                None

         Returns:
                An integer containing the inner height of the element in pixels in the case of success, -1 in case of failure.
         */
        getInnerHeight: function ( )
        {
                        return this.getHeight( ) - this.getBorderHeight( );
        },
        /*
        Function: getInnerWidth
                This function will give you the element's width not including any borders which may be present. This is good for calculating what to set the element's CSS width to.

         Arguments:
                None

         Returns:
                An integer containing the inner width of the element in pixels in the case of success, -1 in case of failure.
         */
        getInnerWidth: function ( element )
        {
                        return this.getWidth( ) - this.getBorderWidth( );
        },

        /*
        Function: Element.getOption
                Gets the value of the option for a special element. This value should be set in the element's class name in the form class="option:value".

         Arguments:
                option - The option to retrieve the setting for.
                defaultValue - The value to return if the option is not set. This parameter is optional and will return null if not given.

         Returns:
                The option value as a string if present, defaultValue if not.
         */
        getOption: function( option,  defaultValue )
        {
                var optValue = new RegExp( option + ":([a-zA-Z0-9]*)" ).exec( this.className )
                if ( optValue )
                        return optValue[ 1 ]
                if ( arguments.length >= 2 )
                                return defaultValue;
                return null;
        }


});

