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
		bubble - If true, this function will bubble up through the parent frames looking for get values if they are not set on the current frame. Defaults to true.

Returns:
		A string containing the value of the GET variable.

*/
var $get = function( varName, defaultValue, bubble )
{
	if ( arguments.length < 1 )
		return;
	if (!$defined( bubble )) bubble = true;
	var getValue = function( win )
	{
		var queryString = win.location.toString( ).split( '?' )[ 1 ];
		var value = new RegExp( "(^|&)" + varName + "=([^&]*)(&|$)" ).exec( queryString );
		if ( !value && bubble && win != win.parent ) return getValue( win.parent );
		return value;
	}
	var value = getValue( window );
	if ( value )
		return value[ 2 ]
	if ( arguments.length >= 2 )
		return defaultValue;
	return null;
}

/*

Function: $benchmark
	Logs the time taken to execute a function and returns its return value.

Arguments:
	func - The function to be executed.
	args - An array containing the arguments to be passed to the function. Alternatively a single value may be passed.
	label - A label to be prepended to the log entry. Defaults to 'runtime'.

Returns:
	The return value of the passed in function.

 */
var $benchmark = function( func, args, label )
{
	if ( !label ) label = 'runtime';
	if ( !args ) args = [ ];
	var t = - ( new Date( ).getTime( ) )
	var returnvalue = func.run( args );
	$log( label + ': ' + (t + new Date( ).getTime( )) + 'ms' )
	return returnvalue;
				    
}

/*

Function: $log
	Prints a message to console.log if it is available.

Arguments:
	String[s] to be printed to the logger

Returns:
	True if console.log is available, false otherwise

 */
var $log = function( )
{
	if ( window.console && console.log )
	{
		for ( var i = 0; i < arguments.length; i++ )
		{
			console.log( arguments[ i ] );
		}
		return true;
	}
	return false;
}

