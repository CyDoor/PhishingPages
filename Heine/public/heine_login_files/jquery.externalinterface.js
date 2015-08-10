/*
 * externalInterface - Plugin to invoke external interface in flash from javascript
 * Copyright (c) 2010 Konstantin Yarkoev
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Description: wait until flash method will be initialized and then invoke it
 * For details, visit http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/external/ExternalInterface.html
 *
 * usage:
 *         $('#flashObj').externalInterface({
 *             method: 'myMethod',
 *             args: [param1, param2, param3],
 *             success: function (data) {
 *                 if (data == null )
 *                     return;
 *                 doSomething(data);
 *             },
 *             error: function (error) {
 *                  //alert('there was an error: ' + error);
 *             }
 *         });
 *
 */
 
(function ($) {
    $.fn.externalInterface = function (args) {
        var debugMode = false;
        this.each(function () {            
            if (typeof (args.method) != 'undefined') {
                // determ swf object name 
                var flashName = "";
                if (debugMode == true) {
                    var id = $(this).attr('id')
                    var name = $(this).attr('name')
                    if (typeof (id) != 'undefined')
                        flashName = id + ".";
                    else if (typeof (name) != 'undefined')
                        flashName = name + ".";
                }
 
                //this object will store usefull data while sleeping (setTimeout)
                var flashMethod = {
                    //callback if success
                    onSuccess: args.success,
                    //callback if error
                    onError: args.error,
                    //external interface name 
                    method: args.method,
                    //method arguments
                    arguments: args.args,
                    //store concrete swfObject
                    swfObject: this,
                    flashName: flashName,
                    loopFunction: function () {
                        if (this.swfObject[this.method] == null)
                            return false;
 
                        try {
                            var result = null;
                            if (typeof (this.arguments) != 'undefined') {
                                result = this.swfObject[this.method].apply(this.swfObject, this.arguments);                                
                            }
                            else {
                                result = this.swfObject[this.method]();
                            }
 
                            if (debugMode) {
                                var message = this.flashName + this.method + "(" + this.arguments.toString() + ") successed!";
                                alert(message);
                            }
 
                            if (typeof (this.onSuccess) != 'undefined') {
                                this.onSuccess(result);
                            }
                        }
                        catch (error) {
                            if (debugMode) {
                                var message = this.flashName + this.method + "(" + this.arguments.toString() + ") error. Description: ";
                                alert(message + error);
                            }
 
                            if (typeof (this.onError) != 'undefined') {
                                this.onError(error);
                            }
                        }
                        return true;
                    },
                    invoke: function () {
                        var result = this.loopFunction();
                        if (result == false)
                            setTimeout(function () { flashMethod.invoke() }, 100);
                    }
                }
 
                flashMethod.invoke();
            }
        });
 
        return this;
    };
})(jQuery);