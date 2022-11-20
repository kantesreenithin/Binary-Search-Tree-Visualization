
(function ($) {

    $.alerts = {
        // These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time

        verticalOffset: -75, // vertical offset of the dialog from center screen, in pixels
        horizontalOffset: 0, // horizontal offset of the dialog from center screen, in pixels/
        repositionOnResize: true, // re-centers the dialog on window resize
        overlayOpacity: .01, // transparency level of overlay
        overlayColor: '#FFF', // base color of overlay
        draggable: true, // make the dialogs draggable (requires UI Draggables plugin)
        okButton: '&nbsp;OK&nbsp;', // text for the OK button
        cancelButton: '&nbsp;Cancel&nbsp;', // text for the Cancel button
        dialogClass: null, // if specified, this class will be applied to all dialogs

        // Public methods

        alert: function (message, title, callback) {
            focusedElBeforeOpen = document.activeElement;

            if (title == null)
                title = 'Alert';
            $.alerts._show(title, message, null, 'alert', function (result) {

                if (callback)
                    callback(result);
            });
           
        },
        confirm: function (message, title, callback) {
                        focusedElBeforeOpen = document.activeElement;

            if (title == null)
                title = 'Confirm';
            $.alerts._show(title, message, null, 'confirm', function (result) {
                if (callback)
                    callback(result);
            });
            
        },
        prompt: function (message, value, title, callback) {
                        focusedElBeforeOpen = document.activeElement;

            if (title == null)
                title = 'Prompt';
            $.alerts._show(title, message, value, 'prompt', function (result) {
                if (callback)
                    callback(result);
            });
            
        },
        // Private methods

        _show: function (title, msg, value, type, callback) {

            $.alerts._hide();
            $.alerts._overlay('show');

switch (type) {
                case 'alert':
                case 'confirm':
                               $("BODY").append(
                    '<div id="popup_container" role="dialog" aria-modal=true aria-labelledby="dialog-title" aria-describedby="dialog-description" tabindex="-1">' +
                    '<h1 id="popup_title"></h1>' +
                    '<div id="popup_content">' +
                    '<div id="popup_message"></div>' +
                    '</div>' +
                    '</div>');

                    break;
                case 'prompt':
                    
                  $("BODY").append(
                    '<div id="popup_container" role="dialog" aria-modal=true aria-labelledby="dialog-title" aria-describedby="dialog-description" tabindex="-1">' +
                    '<h1 id="popup_title"></h1>' +
                    '<div id="popup_content">' +
                    '<label for="popup_prompt" id="popup_label"></label>' +
                    '</div>' +
                    '</div>');

                    
                    }
                    
            
            $("BODY").append(
                    '<div id="dialog-overlay" tabindex="-1"></div>');

            if ($.alerts.dialogClass)
                $("#popup_container").addClass($.alerts.dialogClass);

            // IE6 Fix
            var pos = ($.browser.msie && parseInt($.browser.version) <= 6) ? 'absolute' : 'fixed';

            $("#popup_container").css({
                position: pos,
                zIndex: 99999,
                padding: 0,
                margin: 0
            });

            $("#popup_title").text(title);
            $("#popup_content").addClass(type);
            $("#popup_message").text(msg);
            $("#popup_message").html($("#popup_message").text().replace(/\n/g, '<br />'));
            $("#popup_label").text(msg);
            $("#popup_label").html($("#popup_label").text().replace(/\n/g, '<br />'));

            $("#popup_container").css({
                minWidth: $("#popup_container").outerWidth(),
                maxWidth: $("#popup_container").outerWidth()
            });

            $.alerts._reposition();
            $.alerts._maintainPosition(true);


            switch (type) {
                case 'alert':
                    $("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /></div>');
                    $("#popup_ok").click(function () {
                        $.alerts._hide();
                        callback(true);
                    });
                    $("#popup_ok").focus().keypress(function (e) {

                        if (e.keyCode == 13 || e.keyCode == 27)
                            $("#popup_ok").trigger('click');
                    });
                    handleKey();
                    $("#popup_ok").focus();
                    break;
                case 'confirm':
                    $("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
                    $("#popup_ok").click(function () {
                        $.alerts._hide();
                        if (callback)
                            callback(true);
                    });
                    $("#popup_cancel").click(function () {
                        $.alerts._hide();
                        if (callback)
                            callback(false);
                    });
                    $("#popup_ok").focus();
                    $("#popup_ok, #popup_cancel").keypress(function (e) {
                        if (e.keyCode == 13)
                            $("#popup_ok").trigger('click');
                        if (e.keyCode == 27)
                            $("#popup_cancel").trigger('click');
                    });
                    handleKey();
                    $("#popup_ok").focus();
                    break;
                case 'prompt':
                    $("#popup_label").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
                    $("#popup_prompt").width($("#popup_label").width());
                    $("#popup_ok").click(function () {
                        var val = $("#popup_prompt").val();
                        $.alerts._hide();
                        if (callback)
                            callback(val);
                    });
                    $("#popup_cancel").click(function () {
                        $.alerts._hide();
                        if (callback)
                            callback(null);
                    });
                    $("#popup_prompt, #popup_ok, #popup_cancel").keypress(function (e) {
                        if (e.keyCode == 13)
                            $("#popup_ok").trigger('click');
                        if (e.keyCode == 27)
                            $("#popup_cancel").trigger('click');
                    });
                    if (value)
                        $("#popup_prompt").val(value);
                    $("#popup_prompt").focus().select();

handleKey();


                    $('#popup_prompt').focus();

                    break;
            }

            // Make draggable
            if ($.alerts.draggable) {
                try {
                    $("#popup_container").draggable({handle: $("#popup_title")});
                    $("#popup_title").css({cursor: 'move'});
                } catch (e) { /* requires jQuery UI draggables */
                }
            }
        },
        _hide: function () {
            $("#popup_container").remove();
            $.alerts._overlay('hide');
            $.alerts._maintainPosition(false);
            focusedElBeforeOpen.focus();
        },
        _overlay: function (status) {
            switch (status) {
                case 'show':
                    $.alerts._overlay('hide');
                    $("BODY").append('<div id="popup_overlay"></div>');
                    $("#popup_overlay").css({
                        position: 'absolute',
                        zIndex: 99998,
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        height: $(document).height(),
                        background: $.alerts.overlayColor,
                        opacity: $.alerts.overlayOpacity
                    });
                    break;
                case 'hide':
                    $("#popup_overlay").remove();
                    break;
            }
        },
        _reposition: function () {
            var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
            var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
            if (top < 0)
                top = 0;
            if (left < 0)
                left = 0;

            // IE6 fix
            if ($.browser.msie && parseInt($.browser.version) <= 6)
                top = top + $(window).scrollTop();

            $("#popup_container").css({
                top: top + 'px',
                left: left + 'px'
            });
            $("#popup_overlay").height($(document).height());
        },
        _maintainPosition: function (status) {
            if ($.alerts.repositionOnResize) {
                switch (status) {
                    case true:
                        $(window).bind('resize', $.alerts._reposition);
                        break;
                    case false:
                        $(window).unbind('resize', $.alerts._reposition);
                        break;
                }
            }
        }

    }

    // Shortuct functions
    jAlert = function (message, title, callback) {
        $.alerts.alert(message, title, callback);
        
    }

    jConfirm = function (message, title, callback) {
        $.alerts.confirm(message, title, callback);
    };

    jPrompt = function (message, value, title, callback) {
        $.alerts.prompt(message, value, title, callback);
    };

	jAlertSpeak = function(message, title, callback) {
            if (title == 'Check Your Understanding') {
                speak(message);
            }		
            $.alerts.alert(message, title, callback);
	}

       jPromptSpeak = function(message, value, title, callback) {
            if (title == 'Check Your Understanding') {
                speak('Check Your Understanding: ' + message);
            }
		$.alerts.prompt(message, value, title, callback);
	};     
})(jQuery);


$('#popup_container').bind('keydown', function (event) {
    alert("popup_container");
});

Dialog.prototype.handleKeyDown = function (e) {
    alert("keydown");
    var Dialog = this;
    var KEY_TAB = 9;

    function handleBackwardTab() {
        if (document.activeElement === Dialog.firstFocusableEl) {
            e.preventDefault();
            Dialog.lastFocusableEl.focus();
        }
    }
    function handleForwardTab() {
        if (document.activeElement === Dialog.lastFocusableEl) {
            e.preventDefault();
            Dialog.firstFocusableEl.focus();
        }
    }

    switch (e.keyCode) {
        case KEY_TAB:
            if (Dialog.focusableEls.length === 1) {
                e.preventDefault();
                break;
            }

            if (e.shiftKey) {
                handleBackwardTab();
            } else {
                handleForwardTab();
            }

            break;
        default:
            break;
    } // end switch


};


function handleKey() {
                    var dialogEl = document.querySelector('#popup_container');
                    var dialogOverlay = document.querySelector('#dialog-overlay');
                    var focusableEls = dialogEl.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
//                    focusableEls = [document.querySelector('#popup_prompt'), document.querySelector('#popup_ok'), document.querySelector('#popup_cancel'), ];
                    focusableEls = Array.prototype.slice.call(focusableEls);
                    firstFocusableEl = focusableEls[0];
                    lastFocusableEl = focusableEls[focusableEls.length - 1 ];

                   $('#popup_container').focus().keydown(function (e) {
//                    $(this).focus().keydown(function (e) {
                        var KEY_TAB = 9;
                        var KEY_ESC = 27;
                        switch (e.keyCode) {
                            case KEY_TAB:
                                //e.preventDefault();

                                if (e.shiftKey) {
                                    if (document.activeElement === firstFocusableEl) {
                                        e.preventDefault();
                                        lastFocusableEl.focus();
                                    }
                                } else {

                                    if (document.activeElement === lastFocusableEl) {
                                        e.preventDefault();
                                        firstFocusableEl.focus();
                                    }
                                }
                                break;
                            case KEY_ESC:
                                focusedElBeforeOpen.focus();
                                $.alerts._hide();
                                callback(true);
                                focusedElBeforeOpen.focus();
                                break;
                            default:
                                break;
                        } // end switch
                    });
                    }