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
(function($, cloudStack) {
    $.extend(cloudStack, {
        ui: {
            widgets: {} // Defines API methods for UI widgets
        },
        uiCustom: {}
    });

    /**
     * Generate navigation <li>s
     *
     * @param args cloudStack data args
     */
    var makeNavigation = function(args) {
        var $navList = $('<ul>');
        var preFilter = cloudStack.sectionPreFilter ?
            cloudStack.sectionPreFilter({
                context: $.extend(true, {}, args.context, {
                    sections: $.map(cloudStack.sections, function(value, key) {
                        return key;
                    })
                })
            }) : null;

        $.each(args.sections, function(sectionID, args) {
            if (preFilter && $.inArray(sectionID, preFilter) == -1) {
                if (!(args.preFilter && args.preFilter())) {
                    return true;
                }
            }


            var $li = $('<li>')
                .addClass('navigation-item')
                .addClass(sectionID)
                .append($('<span>').addClass('icon').html('&nbsp;'))
                .append($('<span>').html(_l(args.title)))
                .data('cloudStack-section-id', sectionID);

            if (args.customIcon) {
                $li.addClass('custom-icon').find('span.icon').html('').append(
                    $('<img>').attr({
                        src: args.customIcon
                    })
                );
            }

            if (args.isPlugin) {
                $li.hide();
            }

            $li.appendTo($navList);

            return true;
        });

        // Special classes for first and last items
        $navList.find('li:first').addClass('first');
        $navList.find('li:last').addClass('last');
        /**
         * added by  dujh
         * 鐢变簬瓒呯骇绠＄悊鍛樻潈闄愯彍鍗曡繃澶氾紝濡傛灉鏄互瓒呯骇绠＄悊鍛樿繘鍏ワ紝榛樿灏嗕簩绾ц彍鍗曢殣钘忎互閬垮厤宸︿晶鎷夊緱杩囬暱
         *
         */
        var liClass = "pl_45";
        //$navList.find("li.instances").addClass(liClass).hide();
    	//$navList.find("li.physicsInstances").addClass(liClass).hide();
        if(1==1){ //add by @ma     	    	
        	$navList.find("li.storage").addClass(liClass).hide();
        	$navList.find("li.network").addClass(liClass).hide();
        	$navList.find("li.templates").addClass(liClass).hide();
        	$navList.find("li.system").addClass(liClass).hide();
        	$navList.find("li.configuration").addClass(liClass).hide();
        	
        	$navList.find("li.accounts").addClass(liClass).hide();
        	$navList.find("li.domains").addClass(liClass).hide();
        	$navList.find("li.regions").addClass(liClass).hide();
        	$navList.find("li.projects").addClass(liClass).hide();
        	$navList.find("li.affinityGroups").addClass(liClass).hide();
        	$navList.find("li.global-settings").addClass(liClass).hide();
        	
        	$navList.find("li.resourceStatistics").addClass(liClass).hide();
        	$navList.find("li.workOrderReport").addClass(liClass).hide();
        	$navList.find("li.events").addClass(liClass).hide();
        	
        	// 在页面上添加一个菜单需要设置的地方有：addPage
        	$navList.find("li.logs").addClass(liClass).hide();	// addPage
        }
        return $navList;
    };

    /**
     * Create section contents
     *
     * @param sectionID Section's ID to show
     * @param args CloudStack3 configuration
     */
    var showSection = function(sectionID, args, $browser) {
        var $navItem = $('#navigation').find('li').filter(function() {
            return $(this).hasClass(sectionID);
        });
        var data = args.sections[sectionID];
        var isPlugin = data.isPlugin;

        data.$browser = $browser;

        // Reset browser panels
        if (!isPlugin) {
            $navItem.siblings().removeClass('active');
            $navItem.addClass('active');
            /**
             * added by dujh
             * 浜岀骇鑿滃崟灞曞紑涓庢敹缂�             */
            if(sectionID=="service"){
            	if($("li.service").hasClass("toggle")){
            		$("li.service .icon").css("background-position-x","-120px");
    	        	$("li.service .icon").css("background-position-y","-440px");
            		$("li.service").removeClass("toggle");
            	}else{
            		$("li.service .icon").css("background-position","-208px -440px");
    	        	$("li.service").addClass("toggle");
            	}
            	$("li.network").slideToggle("fast");
            	$("li.templates").slideToggle("fast");
            	$("li.events").slideToggle("fast");
            	$("li.projects").slideToggle("fast");
            	return;
            }
            if(menuSlideToggle(sectionID)) {
            	return;
            }
            $browser.cloudBrowser('removeAllPanels');
        }
        
        $browser.cloudBrowser('addPanel', {
            title: '<span class="section">' + _l(data.title) + '</span>' + '<span class="subsection"></span>',
            data: '',
            complete: function($panel, $breadcrumb) {
                if(!isPlugin) {
                    $breadcrumb.attr('title', _l(data.title));
                }
                
                data.$breadcrumb = $breadcrumb;

                // Hide breadcrumb if this is the home section
                if (args.home === sectionID) {
                    $('#breadcrumbs').find('li:first, div.end:last').hide();
                }

                // Append specified widget to view
                if (data.show)
                    $panel.append(data.show(data));
                else if (data.treeView)
                    $panel.treeView(data, {
                        context: args.context
                    });
                else
                    $panel.listView(data, {
                        context: args.context
                    });
            }
        });

        return $navItem;
    };
    
    /**
     * add by dujh
     */
    var menuSlideToggle = function(sectionID) {
    	// "instances", "physicsInstances"
        if(sectionID=="instanceMenu"){
        	if($("li.instanceMenu").hasClass("toggle")){
        		$("li.instanceMenu").removeClass("toggle");
        		cloudStack.openMenu = null;
        	}else{
        		menuSlideToggle(cloudStack.openMenu);
        		cloudStack.openMenu = "instanceMenu";
	        	$("li.instanceMenu").addClass("toggle");
        	}
        	$("li.instances").slideToggle("fast");
        	$("li.physicsInstances").slideToggle("fast");
        	return true;
        }
        //add @ma storage network templates system configuration
        if(sectionID=="resourceMenu"){
        	if($("li.resourceMenu").hasClass("toggle")){
        		$("li.resourceMenu").removeClass("toggle");
        		cloudStack.openMenu = null;
        	}else{
        		menuSlideToggle(cloudStack.openMenu);
        		cloudStack.openMenu = "resourceMenu";
            	$("li.resourceMenu").addClass("toggle");
        	}    	
        	$("li.storage").slideToggle("fast");
        	$("li.network").slideToggle("fast");
        	$("li.templates").slideToggle("fast");
        	$("li.system").slideToggle("fast");
        	$("li.configuration").slideToggle("fast");
        	//$("li.property").slideToggle("fast");
        	//$("li.equipmentEnroll").slideToggle("fast");
        	
        	
        	return true;
        }
        //add @ma accounts  domains regions projects affinityGroups global-settings
        if(sectionID=="systemMenu"){
        	if($("li.systemMenu").hasClass("toggle")){
        		$("li.systemMenu").removeClass("toggle");
        		cloudStack.openMenu = null;

        	}else{
        		menuSlideToggle(cloudStack.openMenu);
        		cloudStack.openMenu = "systemMenu";
	        	$("li.systemMenu").addClass("toggle");
        	}
        	$("li.accounts").slideToggle("fast");
        	$("li.domains").slideToggle("fast");        	
        	$("li.regions").slideToggle("fast"); 
        	$("li.projects").slideToggle("fast");
        	$("li.affinityGroups").slideToggle("fast");
        	$("li.global-settings").slideToggle("fast");
        	//$("li.resourcePoolPermission").slideToggle("fast");
        	return true;
        }
        if(sectionID=="logMenu"){
        	if($("li.logMenu").hasClass("toggle")){
        		$("li.logMenu").removeClass("toggle");
        		cloudStack.openMenu = null;
        	}else{
        		menuSlideToggle(cloudStack.openMenu);
        		cloudStack.openMenu = "logMenu";
	        	$("li.logMenu").addClass("toggle");
        	}
        	$("li.events").slideToggle("fast");
        	$("li.logs").slideToggle("fast");	// addPage
        	return true;
        }
        
        if(sectionID=="statisticMenu"){
        	if($("li.statisticMenu").hasClass("toggle")){
        		$("li.statisticMenu").removeClass("toggle");
        		cloudStack.openMenu = null;
        	}else{
        		menuSlideToggle(cloudStack.openMenu);
        		cloudStack.openMenu = "statisticMenu";
	        	$("li.statisticMenu").addClass("toggle");
        	}
        	$("li.resourceStatistics").slideToggle("fast");
        	$("li.workOrderReport").slideToggle("fast");
        	//$("li.topData").slideToggle("fast");
        	return true;
        }
        return false;
    };    

    // Define page element generation fns
    var pageElems = {
        header: function(args) {
            // Make notification area
            var $notificationArea = $('<div>').addClass('button notifications')
                .append(
                    $('<div>').addClass('total')
                    // Total notifications
                    .append($('<span>').html(0))
            )
                .append($('<span>').html(_l('label.notifications')))
                .notifications();

            // Project switcher
            var $viewSwitcher = $('<div>').addClass('button view-switcher')
                .append(
                    // Default View
                    $('<div>').addClass('select default-view active')
                    .html(_l('label.default.view'))
                    .prepend(
                        $('<span>').addClass('icon').html('&nbsp;')


                    )
            )
                .append(
                    // Project View
                    $('<div>').addClass('select project-view')
                    .html(_l('label.project.view'))
                    .prepend(
                        $('<span>').addClass('icon').html('&nbsp;')
                    )
            )
                .click(function(event) {
                    var $target = $(event.target);
                    var $projectSwitcher = $(this);
                    var $container = $('html body');
                    var $navDisabled = $(
                        $.map([
                            'projects',
                            'accounts',
                            'domains',
                            'system',
                            'global-settings',
                            'configuration'
                        ], function(id) {
                            return '#navigation li.' + id;
                        }).join(',')
                    );

                    if ($target.closest('.select.project-view').size()) {
                        $('#cloudStack3-container').addClass('project-view');
                        $projectSwitcher.addClass('alt');
                        $projectSwitcher.find('.select.project-view').addClass('active')
                            .siblings().removeClass('active');

                        // Activate project view
                        $navDisabled.hide();
                        cloudStack.uiCustom.projects({
                            $projectSelect: $projectSelect.hide().find('select')
                        });
                    } else {
                        $navDisabled.show();
                        $('#cloudStack3-container').removeClass('project-view');
                        $projectSwitcher.removeClass('alt');
                        $projectSelect.hide();
                        $projectSwitcher.find('.select.default-view').addClass('active')
                            .siblings().removeClass('active');

                        // Put project name in header
                        $('.select.project-view').html(
                            '<span class="icon">&nbsp;</span>' + _l('label.project.view')
                        ).attr('title', '');

                        // Clear out project
                        cloudStack.context.projects = null;
                    }

                    $('#navigation li.dashboard').click();

                    return false;
                });
            var $projectSelect = $('<div>').addClass('view-switcher').hide()
                .append($('<select>'));

            // User status area
            var userLabel = args.context.users[0].name ?
                args.context.users[0].name : args.context.users[0].login;
            var $userInfo = $('<div>').attr({
                id: 'user'
            }).addClass('button')
                .append(
                    $('<div>').addClass('name').html(
                        args.context && args.context.users ?
                        cloudStack.concat(userLabel, 14) : 'Invalid User'
                    )
            )
                .append(
                    $('<div>').addClass('icon options')
                    .append(
                        $('<div>').addClass('icon arrow')
                    )
            );
            $userInfo.attr('title', userLabel);

            return [
                $('<div>').addClass('logo'),
                $('<div>').addClass('controls')
                .append($notificationArea)
                .append($viewSwitcher)
                .append($projectSelect)
                .append($userInfo)
            ];
        },

        'main-area': function(args) {
            var $navigation = $('<div>').attr({
                id: 'navigation'
            });
            var $browser = $('<div>').attr({
                id: 'browser'
            })
                .append(
                    // Home breadcrumb
                    $('<div>').attr({
                        id: 'breadcrumbs'
                    })
                    .append($('<div>').addClass('home').html(_l('label.home')))
                    .append($('<div>').addClass('end'))
            )

            .append(
                // Panel container
                $('<div>').addClass('container')
            );

            makeNavigation(args).appendTo($navigation);

            return [
                $navigation, $browser
            ];
        }
    };

    $.fn.cloudStack = function(args) {
        var $container = $('<div>')
            .attr({
                id: 'container',
                'cloudStack-container': true
            })
            .data('cloudStack-args', args)
            .appendTo(this);
        var context = args.context;

        // Create pageElems
        $.each(pageElems, function(id, fn) {
            var $elem = $('<div>').attr({
                id: id
            });

            $(fn(args)).each(function() {
                $elem.append($(this));
            });

            $elem.appendTo($container);
        });

        // User options
        var $options = $('<div>').attr({
            id: 'user-options'
        })
            .appendTo($('#user'));

        $(['label.logout', 'label.help', 'label.about']).each(function() {
            var $link = $('<a>')
                .attr({
                    href: '#'
                })
                .html(_l(this.toString()))
                .appendTo($options);

            if (this == 'label.help') {
                $link.addClass('help').click(function() {
                    var helpURL = 'http://cloudstack.apache.org/';

                    window.open(helpURL, '_blank');

                    return false;
                });
            }
            if (this == 'label.about') {
                $link.addClass('about').click(function() {
                    var $logo = $('<div>').addClass('logo').html(_l('label.app.name')),
                        $version = $('<div>').addClass('version').html(g_cloudstackversion),
                        $about = $('<div>').addClass('about').append($logo).append($version);
                    $about.dialog({
                        modal: true,
                        width: 300,
                        title: _l('label.about.app'),
                        closeOnEscape: false,
                        dialogClass: 'dialog-about',
                        buttons: {
                            'Close': function() {
                                $(this).dialog("close");
                                $(':ui-dialog, .overlay').remove();
                            }
                        }
                    }).closest('.ui-dialog').overlay();

                    return false;
                });
            }
        });

        // Initialize browser
        $container.find('#browser div.container').cloudBrowser();
        $container.find('#navigation li')
            .filter(function() {
                return $(this).hasClass(args.home);
            })
            .click();

        // Validation
        $.extend($.validator.messages, {
            required: _l('label.required')
        });

        $.validator.addMethod(
            "disallowSpecialCharacters",
            function(value, element) {
                return (value.indexOf("<") == -1 && value.indexOf(">") == -1);
            },
            jQuery.format('message.disallowed.characters')
        );

        // Check for pending project invitations
        if (args.projects) {
            args.projects.invitationCheck({
                context: cloudStack.context,
                response: {
                    success: function(args) {
                        if (!args.data.length) return;

                        var projectList = $.map(args.data, function(invitation) {
                            return '<li>' + invitation.project + '</li>';
                        }).join('');

                        cloudStack.dialog.notice({
                            message: _l('message.pending.projects.1') + '<ul>' + projectList + '</ul>' + '<p>' + _l('message.pending.projects.2') + '</p>'
                        });
                    }
                }
            });
        }

        // Hide logo conditionally
        if (!args.hasLogo) $('#header, #header .controls').addClass('nologo');

        $(window).trigger('cloudStack.ready');

        return this;
    };

    // Events
    $(function() {
        // Check if target should be hovered
        function checkHoveredLabel($target) {
            var $multiWizard = $('div.ui-dialog div.multi-wizard');
            if (($target.is('label[for]') && !$target.parents('body.login')) ||
                ($multiWizard.size() &&
                    ($target.is('.multi-wizard label') && $target.prev('input[type="radio"],input[type="checkbox"]').size()) ||
                    ($target.is('.multi-wizard .select-desc div.name') && $target.parent('div.select-desc').prev('input[type="radio"],input[type="checkbox"]').size())
                ))
                return true;

            return false;
        }

        // Rollover behavior for user options
        $(document).bind('mouseover', function(event) {
            var $target = $(event.target);
            if (checkHoveredLabel($target)) {
                $target.addClass('label-hovered');
            }
            if ($target.closest('#user, #user-options').size()) {
                return false;
            } else $('#user-options').hide();

            return false;
        });

        $(document).bind('mouseout', function(event) {
            var $target = $(event.target);
            if (checkHoveredLabel($target)) {
                $target.removeClass('label-hovered');
            }
        });

        $(document).bind('click', function(event) {
            var $target = $(event.target);
            var $container = $target.closest('[cloudStack-container]');
            var args = $container.data('cloudStack-args');
            var $browser = $container.find('#browser .container');
            var $multiWizard = $('div.ui-dialog div.multi-wizard');

            // Wizard: trigger click event for input when click it label
            if ($multiWizard.size()) {
                if ($target.is('.multi-wizard label') && $target.prev('input[type="radio"],input[type="checkbox"]').size()) {
                    $target.prev('input').trigger('click');
                }
                if ($target.is('.multi-wizard .select-desc div.name') && $target.parent('div.select-desc').prev('input[type="radio"],input[type="checkbox"]').size()) {
                    $target.parent('div.select-desc').prev('input').trigger('click');
                }
            }

            if (!$container.size()) return true;

            // Navigation items
            if ($target.closest('li.navigation-item').size() && $target.closest('#navigation').size()) {
                var $navItem = $target.closest('li.navigation-item');

                if ($navItem.is('.disabled')) return false;
                showSection($navItem.data('cloudStack-section-id'), args, $browser);

                return false;
            }

            // Browser expand
            if ($target.hasClass('control expand') && $target.closest('div.panel div.toolbar').size()) {
                $browser.cloudBrowser('toggleMaximizePanel', {
                    panel: $target.closest('div.panel')
                });

                return false;
            }

            // Home breadcrumb
            if ($target.is('#breadcrumbs div.home')) {
                showSection(args.home, args, $browser);
                return false;
            }

            // User options
            if ($target.closest('#user div.icon.options').size()) {
                $('#user-options').toggle();

                return false;
            }

            return true;
        });
    });
})(window.jQuery,
    window.cloudStack ? window.cloudStack : window.cloudStack = {});
