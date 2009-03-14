/*

Script: core/core.js

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

var mooplus = {
	version: '0.2-pre'
}

/*

Function: $get
Returns the query string parameter requested. Also known as a GET variable,
these parameters are passed from one page to another after the '?' in the
url.

Arguments:
		varName - the name of the variable to request
		defaultValue - The value to be returned if the passed in variable is not present in the query string. This paramater is optional, and the function will return null in it's stead.

Returns:
		A string containing the value of the GET variable.

*/
var $get = function( varName, defaultValue )
{
	if ( arguments.length < 1 )
		return;
	var queryString = window.location.toString( ).split( '?' )[ 1 ];
	var value = new RegExp( "(^|&)" + varName + "=([^&]*)(&|$)" ).exec( queryString )
	if ( value )
		return value[ 2 ]
	if ( arguments.length >= 2 )
		return defaultValue;
	return null;
}

var $benchmark = function( func, args, label ){
	if ( !label ) label = 'runtime';
	if ( !args ) args = [ ];
	var t = - ( new Date( ).getTime( ) )
	var returnvalue = func.run( args );
	if ( window.console && console.log )
		console.log( label + ': ' + (t + new Date( ).getTime( )) + 'ms' )
	return returnvalue;
				    
}
