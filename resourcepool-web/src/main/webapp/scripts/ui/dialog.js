// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
(function($, cloudStack, _l) {
    cloudStack.dialog = {
        /**
         * Error message form
         *
         * Returns callback, that can be plugged into a standard data provider response
         */
        error: function(callback) {
            return function(args) {
                var message = args.message ? args.message : args;
                if (message) cloudStack.dialog.notice({
                    message: message
                });

                if (callback) callback();
            };
        },

        /**
         * Dialog with form
         */
        createForm: function(args) {
            var $formContainer = $('<div>').addClass('form-container');
            var $form = $('<form>').appendTo($formContainer)
                    .submit(function() {
                        $(this).closest('.ui-dialog').find('button.ok').click();

                        return false;
                    });
            var createLabel = _l(args.form.createLabel);

            // Description text
            var formDesc;
            if (typeof(args.form.desc) == 'function') {            	
            	formDesc = args.form.desc(args);
            } else { //typeof(args.form.desc) == 'string' or 'undefined'
            	formDesc = args.form.desc;
            }              
            $('<span>').addClass('message').prependTo($formContainer).html(
                _l(formDesc)
            );

            // Submit button
            $('<input>')
                .attr({
                    type: 'submit'
                })
                .hide()
                .appendTo($form);

            // Render fields and events
            var fields = $.map(args.form.fields, function(value, key) {
                return key;
            });

            var ret = function() {
                $('.overlay').remove();

                return $formContainer.dialog({
                    dialogClass: args.form.bigSize ? 'create-form big' : 'create-form',
                    closeOnEscape: false,
                    draggable: false,
                    width: args.form.bigSize ? 800 : 400,
                    title: _l(args.form.title),
                    open: function() {
                        if (args.form.preFilter) {
                            args.form.preFilter({
                                $form: $form,
                                context: args.context
                            });
                        }
                    },
                    buttons: [{
                        text: createLabel ? createLabel : _l('label.ok'),
                        'class': 'ok',
                        click: function() {
                            if (!complete($formContainer)) {
                                return false;
                            }
                            if(args.form.flag==0){
                            	return false;
                            }
                            $('div.overlay').remove();
                            $('.tooltip-box').remove();
                            $formContainer.remove();
                            $(this).dialog('destroy');

                            $('.hovered-elem').hide();

                            return true;
                        }
                    }, {
                        text: _l('label.cancel'),
                        'class': 'cancel',
                        click: function() {
                            $('div.overlay').remove();
                            $('.tooltip-box').remove();
                            $formContainer.remove();
                            $(this).dialog('destroy');

                            $('.hovered-elem').hide();
                        }
                    }]
                }).closest('.ui-dialog').overlay();
            };

            var isLastAsync = function(idx) {
                for (var i = idx + 1; i < $(fields).length; i++) {
                    var f = args.form.fields[$(fields).get(i)];
                    if (f.select || f.dynamic) {
                        return false;
                    }
                }
                return true;
            };

            var isAsync = false;
            var isNoDialog = args.noDialog ? args.noDialog : false;

            $(fields).each(function(idx, element) {
                var key = this;
                var field = args.form.fields[key];

                var $formItem = $('<div>')
                        .addClass('form-item')
                        .attr({
                            rel: key
                        });

                if (field.isHidden != null) {
                    if (typeof(field.isHidden) == 'boolean' && field.isHidden == true)
                        $formItem.hide();
                    else if (typeof(field.isHidden) == 'function' && field.isHidden() == true)
                        $formItem.hide();
                }

                $formItem.appendTo($form);

                //Handling Escape KeyPress events
                /*   $('.ui-dialog').keypress(function(event) {
                 if ( event.which == 27 ) {
                 event.stopPropagation();
                 }
                 });

                 $(document).ready(function(){
                 $('.ui-dialog').keydown(function(event) {
                 if(event.keyCode == 27)
                 {
                 alert("you pressed the Escape key");
                 event.preventdefault();
                 }
                 })
                 });

                 $(':ui-dialog').dialog({
                 closeOnEscape: false
                 }); */
                // Label field

                var $name = $('<div>').addClass('name')
                        .appendTo($formItem)
                        .append(
                            $('<label>').html(_l(field.label) + ':')
                        );

                // red asterisk
                var $astersikSpan = $('<span>').addClass('field-required').html('*');
                $name.find('label').prepend($astersikSpan);

                if (field.validation == null || field.validation.required == false) {
                    $astersikSpan.hide();
                }

                // Tooltip description
                if (field.desc) {
                    $formItem.attr({
                        title: _l(field.desc)
                    });
                }

                // Input area
                var $value = $('<div>').addClass('value')
                        .appendTo($formItem);
                var $input, $dependsOn, selectFn, selectArgs;
                var dependsOn = field.dependsOn;

                // Depends on fields
                if (field.dependsOn) {
                    $formItem.attr('depends-on', dependsOn);
                    $dependsOn = $form.find('input, select').filter(function() {
                        return $.isArray(dependsOn) ?
                            $.inArray($(this).attr('name'), dependsOn) > -1 :
                            $(this).attr('name') === dependsOn;
                    });

                    if ($dependsOn.is('[type=checkbox]')) {
                        var isReverse = args.form.fields[dependsOn].isReverse;

                        // Checkbox
                        $dependsOn.bind('click', function(event) {
                            var $target = $(this);
                            var $dependent = $target.closest('form').find('[depends-on=\'' + dependsOn + '\']');

                            if (($target.is(':checked') && !isReverse) ||
                                ($target.is(':unchecked') && isReverse)) {
                                $dependent.css('display', 'inline-block');
                                $dependent.each(function() {
                                    if ($(this).data('dialog-select-fn')) {
                                        $(this).data('dialog-select-fn')();
                                    }
                                });
                            } else if (($target.is(':unchecked') && !isReverse) ||
                                       ($target.is(':checked') && isReverse)) {
                                $dependent.hide();
                            }

                            $dependent.find('input[type=checkbox]').click();

                            if (!isReverse) {
                                $dependent.find('input[type=checkbox]').attr('checked', false);
                            } else {
                                $dependent.find('input[type=checkbox]').attr('checked', true);
                            }

                            return true;
                        });

                        // Show fields by default if it is reverse checkbox
                        if (isReverse) {
                            $dependsOn.click();
                        }
                    }
                }

                // Determine field type of input
                if (field.select) {
                    isAsync = true;
                    selectArgs = {
                        context: args.context,
                        response: {
                            success: function(args) {
                            	if (args.data == undefined || args.data.length == 0) { //add if on 4.4.1
                            		var $option = $('<option>')
                                    .appendTo($input)                                    
                                    .html("");
                            	} else {
                                $(args.data).each(function() {
                                    var id = this.id !== undefined ? this.id : this.name;
                                    var description = this.description;

                                    if (args.descriptionField)
                                        description = this[args.descriptionField];
                                    else
                                        description = this.description;

                                    var $option = $('<option>')
                                            .appendTo($input)
                                            .val(_s(id))
                                             .data('json-obj', this) //edit on 4.4.1
                                            .html(_s(description));
                                });
                            	}
                                if (field.defaultValue) {
                                    $input.val(_s(field.defaultValue));
                                }

                                $input.trigger('change');

                                if ((!isNoDialog) && isLastAsync(idx)) {
                                    ret();
                                }
                            }
                        }
                    };

                    selectFn = field.select;
                    $input = $('<select>')
                        .attr({
                            name: key
                        })
                        .data('dialog-select-fn', function(args) {
                            selectFn(args ? $.extend(true, {}, selectArgs, args) : selectArgs);
                        })
                        .appendTo($value);

                    // Pass form item to provider for additional manipulation
                    $.extend(selectArgs, {
                        $select: $input,
                        $form: $form,
                        type: 'createForm'
                    });

                    if (dependsOn) {
                        $dependsOn = $input.closest('form').find('input, select').filter(function() {
                            return $.isArray(dependsOn) ?
                                $.inArray($(this).attr('name'), dependsOn) > -1 :
                                $(this).attr('name') === dependsOn;
                        });

                        // Reload selects linked to in dependsOn
                        $dependsOn.each(function() {
                            var $targetDependsOn = $(this);

                            $targetDependsOn.bind('change', function(event) {
                                var formData = cloudStack.serializeForm($form);
                                var dependsOnLoaded;

                                // Make sure all data is loaded to pass to select fn
                                dependsOnLoaded = $.inArray(
                                    true, $dependsOn.map(function(index, item) { return $(item).find('option').size() ? true : false; })
                                ) > -1;

                                if (!dependsOnLoaded) {
                                    return false;
                                }

                                var $target = $(this);

                                if (!$target.is('select')) {
                                    return true;
                                }

                                $input.find('option').remove();

                                // Re-execute select
                                selectFn($.extend(selectArgs, formData, {
                                    data: formData
                                }));
                                return true;
                            });
                        });

                        if (!$dependsOn.is('select')) {
                            selectFn(selectArgs);
                        }
                    } else {
                        selectFn(selectArgs);
                    }
                } else if (field.isBoolean) {
                    if (field.multiArray) {
                        $input = $('<div>')
                            .addClass('multi-array').addClass(key).appendTo($value);

                        $.each(field.multiArray, function(itemKey, itemValue) {
                            $input.append(
                                $('<div>').addClass('item')
                                    .append(
                                        $.merge(
                                            $('<div>').addClass('name').html(_l(itemValue.label)),
                                            $('<div>').addClass('value').append(
                                                $('<input>').attr({
                                                    name: itemKey,
                                                    type: 'checkbox'
                                                }).appendTo($value)
                                            )
                                        )
                                    )
                            );
                        });

                    } else {
                        $input = $('<input>').attr({
                            name: key,
                            type: 'checkbox'
                        }).appendTo($value);
                        if (field.isChecked) {
                            $input.attr('checked', 'checked');
                        } else {
                            // This is mainly for IE compatibility
                            setTimeout(function() {
                                $input.attr('checked', false);
                            }, 100);
                        }
                    }

                    // Setup on click event
                    if (field.onChange) {
                        $input.click(function() {
                            field.onChange({
                                $checkbox: $input
                            });
                        });
                    }
                } else if (field.dynamic) {
                    isAsync = true;
                    // Generate a 'sub-create-form' -- append resulting fields
                    $input = $('<div>').addClass('dynamic-input').appendTo($value);
                    $form.hide();

                    field.dynamic({
                        response: {
                            success: function(args) {
                                var form = cloudStack.dialog.createForm({
                                    noDialog: true,
                                    form: {
                                        title: '',
                                        fields: args.fields
                                    }
                                });

                                var $fields = form.$formContainer.find('.form-item').appendTo($input);
                                $form.show();

                                // Form should be slightly wider
                                $form.closest(':ui-dialog').dialog('option', {
                                    position: 'center',
                                    closeOnEscape: false
                                });
                                if ((!isNoDialog) && isLastAsync(idx)) {
                                    ret();
                                }
                            }
                        }
                    });
                } else if (field.isTextarea) {
                    $input = $('<textarea>').attr({
                        name: key
                    }).appendTo($value);

                    if (field.defaultValue) {
                        $input.val(field.defaultValue);
                    }
                    $input.addClass("disallowSpecialCharacters");
                } else if (field.isDatepicker) { //jQuery datepicker
                    $input = $('<input>').attr({
                        name: key,
                        type: 'text',
                        /**
                         * addde by steven,2014/3/24,时间类型不让自己输入
                         */
                        readonly:true
                    }).appendTo($value);//.val(cloudStack.converters.toToday(new Date()));

                    if (field.defaultValue) {
                        $input.val(field.defaultValue);
                    }
                    if (field.id) {
                        $input.attr('id', field.id);
                    }
                    $input.addClass("disallowSpecialCharacters");
                    $input.datepicker({
                        dateFormat: 'yy-mm-dd'
                    });

                } else if (field.range) { //2 text fields on the same line (e.g. port range: startPort - endPort)
                    $input = $.merge(
                        // Range start
                        $('<input>').attr({
                            type: 'text',
                            name: field.range[0]
                        }),

                        // Range end
                        $('<input>').attr({
                            type: 'text',
                            name: field.range[1]
                        })
                    ).appendTo(
                        $('<div>').addClass('range-edit').appendTo($value)
                    );
                    $input.wrap($('<div>').addClass('range-item'));
                    $input.addClass("disallowSpecialCharacters");

                } else { //text field
                    $input = $('<input>').attr({
                        name: key,
                        type: field.password || field.isPassword ? 'password' : 'text'
                    }).appendTo($value);

                    if (field.defaultValue) {
                        $input.val(field.defaultValue);
                    }
                    if (field.id) {
                        $input.attr('id', field.id);
                    }
                    $input.addClass("disallowSpecialCharacters");
                }

                if (field.validation != null)
                    $input.data('validation-rules', field.validation);
                else
                    $input.data('validation-rules', {});

                var fieldLabel = field.label;

                var inputId = $input.attr('id') ? $input.attr('id') : fieldLabel.replace(/\./g, '_');

                $input.attr('id', inputId);
                $name.find('label').attr('for', inputId);

                if (field.isDisabled)
                    $input.attr("disabled", "disabled");

                // Tooltip
                if (field.docID) {
                    $input.toolTip({
                        docID: field.docID,
                        tooltip: '.tooltip-box',
                        mode: 'focus',
                        attachTo: '.form-item'
                    });
                }


                /*     $input.blur(function() {
                 console.log('tooltip remove->' + $input.attr('name'));
                 });*/
            });


            var getFormValues = function() {
                var formValues = {};
                $.each(args.form.fields, function(key) {});
            };

            // Setup form validation
            $formContainer.find('form').validate();
            $formContainer.find('input, select, textarea').each(function() {
                if ($(this).data('validation-rules')) {
                    $(this).rules('add', $(this).data('validation-rules'));
                } else {
                    $(this).rules('add', {});
                }
            });
            $form.find('select').trigger('change');


            var complete = function($formContainer) {
                var $form = $formContainer.find('form');
                var data = cloudStack.serializeForm($form);

                if (!$formContainer.find('form').valid()) {
                    // Ignore hidden field validation
                    if ($formContainer.find('input.error:visible, select.error:visible, textarea.error:visible').size()) {
                        return false;
                    }
                }
                //added by Li Manxin  search是搜索from标识 
                //data["searchFlag"]==undefined
                
                if(data&&data.start_date&&data["searchFlag"]==undefined){
                	/*if(Date.parse(data.start_date)<Date.parse(new Date())){
                		cloudStack.dialog.notice({message:'上架时间必须大于今天日期'});
                  	 	return false;
                	}*/
                	console.info(data.end_date);
                	console.info(Date.parse(data.start_date));
                	console.info(Date.parse(data.end_date));
                	 if(data.end_date&&(Date.parse(data.start_date)>Date.parse(data.end_date))){
                		 cloudStack.dialog.notice({message:'下架时间必须在上架时间之后'});
                   	 	return false;
                     }
                }
              /*  if(data&&data.expire_date&&data["searchFlag"]==undefined){
                	if(Date.parse(data.expire_date)<Date.parse(new Date())){
	               		 cloudStack.dialog.notice({message:'到保时间必须大于今天日期'});
	                  	 	return false;
                    }
                }*/
                args.after({
                    data: data,
                    ref: args.ref, // For backwards compatibility; use context
                    context: args.context,
                    $form: $form
                });

                return true;
            };

            if (args.noDialog) {
                return {
                    $formContainer: $formContainer,
                    completeAction: complete
                };
            } else if (!isAsync) {
                return ret();
            }
        },

        // Dialog with list view selector
        listView: function(args) {
            var listView = args.listView;
            var after = args.after;
            var context = args.context;
            var $listView = $('<div>');

            listView.actions = {
                select: {
                    label: _l('label.select.instance'),
                    type: listView.type,
                    action: {
                        uiCustom: function(args) {
                            var $item = args.$item;
                            var $input = $item.find('td.actions input:visible');

                            if ($input.attr('type') == 'checkbox') {
                                if ($input.is(':checked'))
                                    $item.addClass('multi-edit-selected');
                                else
                                    $item.removeClass('multi-edit-selected');
                            } else {
                                $item.siblings().removeClass('multi-edit-selected');
                                $item.addClass('multi-edit-selected');
                            }
                        }
                    }
                }
            };

            // Init list view
            $listView = $('<div>').listView({
                context: context,
                uiCustom: true,
                listView: listView
            });

            // Change action label
            $listView.find('th.actions').html(_l('label.select'));

            $listView.dialog({
                dialogClass: 'multi-edit-add-list panel',
                width: 825,
                //title: _l('Select VM'),
                title : (listView.label==""|| !listView.label) ? _l('Select VM') : listView.label,
                buttons: [{
                    text: _l('label.apply'),
                    'class': 'ok',
                    click: function() {
                        if (!$listView.find(
                            'input[type=radio]:checked, input[type=checkbox]:checked'
                        ).size()) {
                            cloudStack.dialog.notice({
                                //message: _l('message.select.instance')
                            	message : '请选择一条记录'
                            });

                            return false;
                        }

                        after({
                            context: $.extend(true, {}, context, {
                                instances: $listView.find('tr.multi-edit-selected').map(function(index, row) {
                                    var $row = $(row);

                                    return $row.data('json-obj');
                                })
                            })
                        });

                        $listView.remove();

                        $('div.overlay').remove();
                    }
                }, {
                    text: _l('label.cancel'),
                    'class': 'cancel',
                    click: function() {
                        $listView.fadeOut(function() {
                            $listView.remove();
                        });
                        $('div.overlay').fadeOut(function() {
                            $('div.overlay').remove();
                        });
                    }
                }]
            }).parent('.ui-dialog').overlay();
        },

        /**
         * to change a property(e.g. validation) of a createForm field after a createForm is rendered
         */
        createFormField: {
            validation: {
                required: {
                    add: function($formField) {
                        var $input = $formField.find('input, select');
                        var validationRules = $input.data('validation-rules');

                        if (validationRules == null || validationRules.required == null || validationRules.required == false) {
                            $formField.find('.name').find('label').find('span.field-required').css('display', 'inline'); //show red asterisk

                            if (validationRules == null)
                                validationRules = {};
                            validationRules.required = true;
                            $input.data('validation-rules', validationRules);
                            $input.rules('add', {
                                required: true
                            });
                        }
                    },
                    remove: function($formField) {
                        var $input = $formField.find('input, select');
                        var validationRules = $input.data('validation-rules');

                        if (validationRules != null && validationRules.required != null && validationRules.required == true) {
                            $formField.find('.name').find('label').find('span.field-required').hide(); //hide red asterisk
                            delete validationRules.required;
                            $input.data('validation-rules', validationRules);

                            $input.rules('remove', 'required');
                            $formField.find('.value').find('label.error').hide();
                        }
                    }
                }
            }
        },

        /**
         * Confirmation dialog
         */
        confirm: function(args) {
            return $(
                $('<span>').addClass('message').html(
                    _l(args.message)
                )
            ).dialog({
                title: _l('label.confirmation'),
                dialogClass: 'confirm',
                closeOnEscape: false,
                zIndex: 5000,
                buttons: [{
                    text: _l('label.no'),
                    'class': 'cancel',
                    click: function() {
                        $(this).dialog('destroy');
                        $('div.overlay').remove();
                        if (args.cancelAction) {
                            args.cancelAction();
                        }
                        $('.hovered-elem').hide();
                    }
                }, {
                    text: _l('label.yes'),
                    'class': 'ok',
                    click: function() {
                        args.action();
                        $(this).dialog('destroy');
                        $('div.overlay').remove();
                        $('.hovered-elem').hide();
                    }
                }]
            }).closest('.ui-dialog').overlay();
        },

        /**
         * Notice dialog
         */
        notice: function(args) {
            if (args.message) {
                return $(
                    $('<span>').addClass('message').html(
                        _l(args.message)
                    )
                ).dialog({
                    title: _l('label.status'),
                    dialogClass: 'notice',
                    closeOnEscape: false,
                    zIndex: 5000,
                    buttons: [{
                        text: _l('label.close'),
                        'class': 'close',
                        click: function() {
                            $(this).dialog('destroy');
                            if (args.clickAction) args.clickAction();
                            $('.hovered-elem').hide();
                        }
                    }]
                });
            }

            return false;
        }
        ,
        hide:function(){
        	$('div.overlay').remove();
        	$(".create-form").remove();
        	$(".loading-overlay").remove();
        },
        /**
         * Notice dialog
         */
        window: function(args,callback) {
            if (args.message) {
                return $(
                    $('<span>').addClass('message').html(
                        _l(args.message)
                    )
                ).dialog({
                    title: _l('label.status'),
                    dialogClass: 'notice',
                    closeOnEscape: false,
                    zIndex: 5000,
                    buttons: [{
                        text: _l('Close'),
                        'class': 'close',
                        click: function() {
                            $(this).dialog('destroy');
                            if (args.clickAction) args.clickAction();
                            $('.hovered-elem').hide();
                            callback()&&callback();
                        }
                    }]
                });
            }

            return false;
        }
    };
})(window.jQuery, window.cloudStack, _l);
