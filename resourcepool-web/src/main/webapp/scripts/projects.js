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
(function(cloudStack) {
    var getProjectAdmin, selectedProjectObj;
    cloudStack.projects = {
        requireInvitation: function(args) {
            return g_capabilities.projectinviterequired;
        },

        invitationCheck: function(args) {
            $.ajax({
                url: createURL('listProjectInvitations'),
                data: {
                    state: 'Pending'
                },
                success: function(json) {
                    args.response.success({
                        data: json.listprojectinvitationsresponse.projectinvitation ? json.listprojectinvitationsresponse.projectinvitation : []
                    });
                }
            });
        },

        resourceManagement: {
            update: function(args, projectID) {
            	  $.ajax({
                      url: createURL('checkStatus'),
                      data: {
                      	workordertype:2,
                      	cmsz:'yes',
                      	projectid: projectID,
                      },
                      type:'get',
                      dataType: 'json',
                      async: true,
                      success: function(data) {
                      	if(data.status==1){
                      		cloudStack.dialog.window({message:"该项目已经提交工单，且处于待审批中，无法重复提交新工单"},function(){
                      			cloudStack.dialog.hide();
                      			//$(".resources form input[type='submit']").remove();
                      			return;
                         	});
                      	}else if(data.status==2){
                      		cloudStack.dialog.window({message:"该项目已经提交工单，且审批通过，等待处理中"},function(){
                      			cloudStack.dialog.hide();
                      			return;
                         	});
                      	}else if(data.status==4){
                      		cloudStack.dialog.window({message:"该项目已经提交工单，且正在处理中"},function(){
                      			cloudStack.dialog.hide();
                      			return;
                         	});
                      	}else{
                      		 var totalResources = 5;
                             var updatedResources = 0;

                             projectID = projectID ? projectID : cloudStack.context.projects[0].id;
                             /**
                              * deleted by steven 
                              * 不需要每次更新  一次性提交表单数据
                              * TODO
                              * 
                              */

                             /*$.each(args.data, function(key, value) {
                                 $.ajax({
                                     url: createURL('updateResourceLimit', {
                                         ignoreProject: true
                                     }),
                                     data: {
                                         projectid: projectID,
                                         resourcetype: key,
                                         max: args.data[key]
                                     },
                                     success: function(json) {
                                         updatedResources++;
                                         if (updatedResources == totalResources) {
                                             args.response.success();
                                         }
                                     }
                                 });
                             });*/
                             
                             $.ajax({
                                 url: createURL('saveOrder'),
                                 data: {
                                 	workOrderType:2,
                                 	cmsz:'yes',
                                 	status:1,
                                 	accountId: args.context.users[0].account,
                                     domainId: args.context.users[0].domainid,
                                 	projectid: projectID,
                                     instance:args.data['instance'],
                                     ip:args.data['ip'],
                                     volume:args.data['volume'],
                                     snapshot:args.data['snapshot'],
                                     template:args.data['template'],
                                     network:args.data['network'],
                                     vpc:args.data['vpc'],
                                     cpu:args.data['cpu'],
                                     memory:args.data['memory'],
                                     primaryStorage:args.data['primaryStorage'],
                                     secondaryStorage:args.data['secondaryStorage'],
                                     applyReason:args.data['applyReason']
                                 },
                                 type:'post',
                                 dataType: 'json',
                                 async: true,
                                 success: function(data) {
                                 	cloudStack.dialog.window({message:"提交成功"},function(){
                                 		$("#breadcrumbs ul li:eq(0)").click();
                                 	});
                                 },
                                 error: function(json) {
                                 	cloudStack.dialog.error(parseXMLHttpResponse(json));
                                 }
                             });
                      	}
                      },
                      error: function(json) {
                      	cloudStack.dialog.error(parseXMLHttpResponse(json));
                      }
                  });
               
            },

            dataProvider: function(args, projectID) {
                projectID = projectID ? projectID : cloudStack.context.projects[0].id;

                $.ajax({
                    url: createURL('listResourceLimits', {
                        ignoreProject: true
                    }),
                    data: {
                        projectid: projectID
                    },
                    success: function(json) {
                        var resourceLimits = $.grep(
                            json.listresourcelimitsresponse.resourcelimit,
                            function(resourceLimit) {
                                return resourceLimit.resourcetype != 5 ;
                            }
                        );
                        /**
                         * added by steven
                         * 项目资源页面  新增一个申请理由
                         */
                       var obj={account: resourceLimits[0].account,
                        		domain: resourceLimits[0].domain,
                        		domainid: resourceLimits[0].domainid,
                        		max: '',
                        		project: resourceLimits[0].project,
                        		projectid: resourceLimits[0].projectid,
                        		name:'applyReason',
                        		resourcetype: "12"};
                        		resourceLimits.push(obj);
                        	
                        	
                        args.response.success({
                            data: $.map(
                                resourceLimits,
                                function(resource) {
                                    var resourceMap = {
                                    		/**
                                    		 * updated by steven
                                    		 *在每个数据下面新增一个name字段{instance,ip,volume,.......applyReason}
                                    		 */
                                        0: {
                                            id: 'user_vm',
                                            label: 'label.max.vms',
                                            name:'instance'
                                        },
                                        1: {
                                            id: 'public_ip',
                                            label: 'label.max.public.ips',
                                            name:'ip'
                                        },
                                        2: {
                                            id: 'volume',
                                            label: 'label.max.volumes',
                                            name:'volume'
                                        },
                                        3: {
                                            id: 'snapshot',
                                            label: 'label.max.snapshots',
                                            name:'snapshot'
                                        },
                                        4: {
                                            id: 'template',
                                            label: 'label.max.templates',
                                            name:'template'
                                        },
                                        5: {
                                            id: 'project',
                                            label: 'label.max.projects',
                                            name:'project'
                                        },
                                        6: {
                                            id: 'network',
                                            label: 'label.max.networks',
                                            name:'network'
                                        },
                                        7: {
                                            id: 'vpc',
                                            label: 'label.max.vpcs',
                                            name:'vpc'
                                        },
                                        8: {
                                            id: 'cpu',
                                            label: 'label.max.cpus',
                                            name:'cpu'
                                        },
                                        9: {
                                            id: 'memory',
                                            label: 'label.max.memory',
                                            name:'memory'
                                        },
                                        10: {
                                            id: 'primary_storage',
                                            label: 'label.max.primary.storage',
                                            name:'primaryStorage'
                                        },
                                        11: {
                                            id: 'secondary_storage',
                                            label: 'label.max.secondary.storage',
                                            name:'secondaryStorage',
                                            validation: {
                                                required: true,
                                                min:1
                                            }
                                        },
                                        12: {
                                            id: 'applyReason',
                                            label: '申请理由',
                                            isTextarea:true,
                                            name:'applyReason',
                                            validation: {
                                                required: true
                                            }
                                        }
                                    };

                                    return {
                                        id: resourceMap[resource.resourcetype].id,
                                        label: _l(resourceMap[resource.resourcetype].label),
                                        type: resource.resourcetype,
                                        value: resource.max,
                                        name:resourceMap[resource.resourcetype].name
                                    };
                                }
                            )
                        });
                    }
                });
            }
        },

        dashboard: function(args) {
            var dataFns = {
                instances: function(data) {
                    $.ajax({
                        url: createURL('listVirtualMachines'),
                        success: function(json) {
                            var instances = json.listvirtualmachinesresponse.virtualmachine ?
                                json.listvirtualmachinesresponse.virtualmachine : [];

                            dataFns.storage($.extend(data, {
                                runningInstances: $.grep(instances, function(instance) {
                                    return instance.state == 'Running';
                                }).length,
                                stoppedInstances: $.grep(instances, function(instance) {
                                    return instance.state != 'Running';
                                }).length,
                                totalInstances: instances.length
                            }));
                        }
                    });
                },

                storage: function(data) {
                    $.ajax({
                        url: createURL('listVolumes'),
                        success: function(json) {
                            dataFns.bandwidth($.extend(data, {
                                totalVolumes: json.listvolumesresponse.volume ? json.listvolumesresponse.count : 0
                            }));
                        }
                    });
                },

                bandwidth: function(data) {
                    var totalBandwidth = 0;
                    $.ajax({
                        url: createURL('listNetworks'),
                        success: function(json) {
                            var networks = json.listnetworksresponse.network ?
                                json.listnetworksresponse.network : [];
                            $(networks).each(function() {
                                var network = this;
                                $.ajax({
                                    url: createURL('listNetworkOfferings'),
                                    async: false,
                                    data: {
                                        id: network.networkofferingid
                                    },
                                    success: function(json) {
                                        totalBandwidth +=
                                            json.listnetworkofferingsresponse.networkoffering[0].networkrate;
                                    }
                                });
                            });

                            dataFns.ipAddresses($.extend(data, {
                                totalBandwidth: totalBandwidth
                            }));
                        }
                    });
                },

                ipAddresses: function(data) {
                    $.ajax({
                        url: createURL('listPublicIpAddresses'),
                        success: function(json) {
                            dataFns.loadBalancingRules($.extend(data, {
                                totalIPAddresses: json.listpublicipaddressesresponse.count ? json.listpublicipaddressesresponse.count : 0
                            }));
                        }
                    });
                },

                loadBalancingRules: function(data) {
                    $.ajax({
                        url: createURL('listLoadBalancerRules'),
                        success: function(json) {
                            dataFns.portForwardingRules($.extend(data, {
                                totalLoadBalancers: json.listloadbalancerrulesresponse.count ? json.listloadbalancerrulesresponse.count : 0
                            }));
                        }
                    });
                },

                portForwardingRules: function(data) {
                    $.ajax({
                        url: createURL('listPortForwardingRules'),
                        success: function(json) {
                            dataFns.users($.extend(data, {
                                totalPortForwards: json.listportforwardingrulesresponse.count ? json.listportforwardingrulesresponse.count : 0
                            }));
                        }
                    });
                },

                users: function(data) {
                    $.ajax({
                        url: createURL('listProjectAccounts'),
                        success: function(json) {
                            var users = json.listprojectaccountsresponse.projectaccount;

                            dataFns.events($.extend(data, {
                                users: $.map(users, function(user) {
                                    return {
                                        account: user.account
                                    };
                                })
                            }));
                        }
                    });
                },

                events: function(data) {
                    $.ajax({
                        url: createURL('listEvents', {
                            ignoreProject: true
                        }),
                        data: {
                            page: 1,
                            pageSize: 8
                        },
                        success: function(json) {
                            var events = json.listeventsresponse.event;

                            complete($.extend(data, {
                                events: $.map(events, function(event) {
                                    return {
                                        date: event.created.substr(5, 2) + '/' + event.created.substr(8, 2) + '/' + event.created.substr(2, 2),
                                        desc: event.description
                                    };
                                })
                            }));
                        }
                    });
                }
            };

            var complete = function(data) {
                args.response.success({
                    data: data
                });
            };

            dataFns.instances();
        },

        add: function(args) {
            setTimeout(function() {
                $.ajax({
                	/**
                	 * updated by steven
                	 * createProject 改为saveOrder
                	 */
                    url: createURL('saveOrder', {
                        ignoreProject: true
                    }),
                    data: {
                    	workOrderType:1,
                    	cmsz:'yes',
                    	status:1,
                    	accountId: args.context.users[0].account,
                        domainId: args.context.users[0].domainid,
                        name: args.data['project-name'],
                        displaytext: args.data['project-display-text'],
                        instance:args.data['project-maxVm'],
                        ip:args.data['project-maxIp'],
                        volume:args.data['project-maxSpeed'],
                        snapshot:args.data['project-maxCopy'],
                        template:args.data['project-maxTemps'],
                        network:args.data['project-maxNets'],
                        vpc:args.data['project-maxVPC'],
                        cpu:args.data['project-maxCpu'],
                        memory:args.data['project-maxMem'],
                        primaryStorage:args.data['project-mainDisk'],
                        secondaryStorage:args.data['project-secondDisk'],
                        applyReason:args.data['projectReason']
                      //  resourcePoolId:args.data['resourcePool']
                    },
                    dataType: 'json',
                    async: true,
                    type:'post',
                    success: function(data) {
                    	/**
                    	 * deleted by steven
                    	 * 按照新需求不需要该段代码
                    	 */
                       /* args.response.success({
                            data: {
                                id: data.createprojectresponse.id,
                                name: args.data['project-name'],
                                displayText: args.data['project-display-text'],
                                maxVm:args.data['project-maxVm'],
                                maxIp:args.data['project-maxIp'],
                                maxSpeed:args.data['project-maxSpeed'],
                                maxCopy:args.data['project-maxCopy'],
                                maxTemps:args.data['project-maxTemps'],
                                maxNets:args.data['project-maxNets'],
                                maxVPC:args.data['project-maxVPC'],
                                maxCpu:args.data['project-maxCpu'],
                                maxMem:args.data['project-maxMem'],
                                mainDisk:args.data['project-mainDisk'],
                                secondDisk:args.data['project-secondDisk'],
                                resourcePool:args.data['resourcePool'],
                                projectReason:args.data['projectReason'],
                                users: []
                            }
                        });*/
                    	cloudStack.dialog.window({message:"提交成功"},function(){
                    		 $(':ui-dialog, .overlay').remove();
                    	});
                    },
                    error: function(json) {
                        args.response.error(parseXMLHttpResponse(json));
                    }
                });
            }, 100);
        },
        inviteForm: {
            noSelect: true,
            noHeaderActionsColumn: true,
            ignoreEmptyFields: true,
            fields: {
                'email': {
                    edit: true,
                    label: 'label.email'
                },
                'account': {
                    edit: true,
                    label: 'label.account'
                },
                'state': {
                    edit: 'ignore',
                    label: 'label.status'
                },
                'add-user': {
                    addButton: true,
                    label: ''
                }
            },
            add: {
                label: 'label.invite',
                action: function(args) {
                    $.ajax({
                        url: createURL('addAccountToProject', {
                            ignoreProject: true
                        }),
                        data: {
                            projectId: args.context.projects[0].id,
                            account: args.data.account,
                            email: args.data.email
                        },
                        dataType: 'json',
                        async: true,
                        success: function(data) {
                            data: args.data,
                            args.response.success({
                                _custom: {
                                    jobId: data.addaccounttoprojectresponse.jobid
                                },
                                notification: {
                                    label: 'label.project.invite',
                                    poll: pollAsyncJobResult
                                }
                            });
                        },
                        error: function(json) {
                            args.response.error(parseXMLHttpResponse(json));
                        }
                    });
                }
            },
            actionPreFilter: function(args) {
                if (args.context.projects &&
                    args.context.projects[0] && !args.context.projects[0].isNew) {
                    return args.context.actions;
                }

                return ['destroy'];
            },

            actions: {
                destroy: {
                    label: 'label.revoke.project.invite',
                    action: function(args) {
                        $.ajax({
                            url: createURL('deleteProjectInvitation'),
                            data: {
                                id: args.context.multiRule[0].id
                            },
                            success: function(data) {
                                args.response.success({
                                    _custom: {
                                        jobId: data.deleteprojectinvitationresponse.jobid
                                    },
                                    notification: {
                                        label: 'label.revoke.project.invite',
                                        poll: pollAsyncJobResult
                                    }
                                });
                            }
                        });
                    }
                }
            },

            // Project users data provider
            dataProvider: function(args) {
                $.ajax({
                    url: createURL('listProjectInvitations', {
                        ignoreProject: true
                    }),
                    data: {
                        state: 'Pending',
                        listAll: true,
                        projectId: args.context.projects[0].id
                    },
                    dataType: 'json',
                    async: true,
                    success: function(data) {
                        var invites = data.listprojectinvitationsresponse.projectinvitation ?
                            data.listprojectinvitationsresponse.projectinvitation : [];
                        args.response.success({
                            data: $.map(invites, function(elem) {
                                return {
                                    id: elem.id,
                                    account: elem.account,
                                    email: elem.email,
                                    state: elem.state
                                };
                            })
                        });
                    }
                });
            }
        },
        addUserForm: {
            noSelect: true,
            hideForm: function() {
                return g_capabilities.projectinviterequired;
            },
            fields: {
                'username': {
                    edit: true,
                    label: 'label.account'
                },
                'role': {
                    edit: 'ignore',
                    label: 'label.role'
                },
                'add-user': {
                    addButton: true,
                    label: ''
                }
            },
            add: {
                label: 'label.add.account',
                action: function(args) {
                    $.ajax({
                        url: createURL('addAccountToProject', {
                            ignoreProject: true
                        }),
                        data: {
                            projectId: args.context.projects[0].id,
                            account: args.data.username
                        },
                        dataType: 'json',
                        async: true,
                        success: function(data) {
                            args.response.success({
                                _custom: {
                                    jobId: data.addaccounttoprojectresponse.jobid
                                },
                                notification: {
                                    label: 'label.add.account.to.project',
                                    poll: pollAsyncJobResult
                                }
                            });

                            if (g_capabilities.projectinviterequired) {
                                cloudStack.dialog.notice({
                                    message: 'message.project.invite.sent'
                                });
                            }
                        }
                    });
                }
            },
            actionPreFilter: function(args) {
                if (!args.context.projects &&
                    args.context.multiRule[0].role != 'Admin') { // This is for the new project wizard
                    return ['destroy'];
                }

                if (args.context.multiRule[0].role != 'Admin' &&
                    (cloudStack.context.users[0].account == getProjectAdmin || isAdmin() || isDomainAdmin())) { // This is for the new project wizard: check if current logged in User is the Project Owner
                    return args.context.actions;
                }

                return [];
            },
            readOnlyCheck: function(args) { // check if current logged in User is the Project Owner
                if (isAdmin() || isDomainAdmin())
                    return true;

                var projectOwner, currentUser = cloudStack.context.users[0].account;
                $(args.data).each(function() {
                    var data = this;
                    if (data.role == 'Admin')
                        projectOwner = data.username;
                });
                if (projectOwner == currentUser)
                    return true;

                return false;
            },
            actions: {
                destroy: {
                    label: 'label.remove.project.account',
                    action: function(args) {
                        $.ajax({
                            url: createURL('deleteAccountFromProject', {
                                ignoreProject: true
                            }),
                            data: {
                                projectId: args.context.projects[0].id,
                                account: args.context.multiRule[0].username
                            },
                            dataType: 'json',
                            async: true,
                            success: function(data) {
                                args.response.success({
                                    _custom: {
                                        jobId: data.deleteaccountfromprojectresponse.jobid
                                    },
                                    notification: {
                                        label: 'label.remove.project.account',
                                        poll: pollAsyncJobResult
                                    }
                                });
                            },
                            error: function(data) {
                                args.response.error('Could not remove user');
                            }
                        });
                    }
                },

                makeOwner: {
                    label: 'label.make.project.owner',
                    action: function(args) {
                        $.ajax({
                            url: createURL('updateProject', {
                                ignoreProject: true
                            }),
                            data: {
                                id: args.context.projects[0].id,
                                account: args.context.multiRule[0].username
                            },
                            dataType: 'json',
                            async: true,
                            success: function(data) {
                                args.response.success({
                                    _custom: {
                                        jobId: data.updateprojectresponse.jobid,
                                        onComplete: function() {
                                            setTimeout(function() {
                                                $(window).trigger('cloudStack.fullRefresh');
                                                if (isUser()) {
                                                    $(window).trigger('cloudStack.detailsRefresh');
                                                }
                                            }, 500);
                                        }
                                    },
                                    notification: {
                                        label: 'label.make.project.owner',
                                        poll: pollAsyncJobResult
                                    }
                                });
                            }
                        });
                    }
                }
            },

            // Project users data provider
            dataProvider: function(args) {
                $.ajax({
                    url: createURL('listProjectAccounts', {
                        ignoreProject: true
                    }),
                    data: {
                        projectId: args.context.projects[0].id
                    },
                    dataType: 'json',
                    async: true,
                    success: function(data) {
                        args.response.success({
                            data: $.map(data.listprojectaccountsresponse.projectaccount, function(elem) {
                                if (elem.role == 'Owner' || elem.role == 'Admin')
                                    getProjectAdmin = elem.account;
                                return {
                                    id: elem.accountid,
                                    role: elem.role,
                                    username: elem.role == 'Owner' ? elem.account + ' (owner)' : elem.account
                                };
                            })
                        });
                    }
                });
            }
        },

        // Project listing data provider
        dataProvider: function(args) {
            var user = args.context.users[0];
            var data = {
                accountId: user.userid,
                listAll: true
            };

            if (args.projectName) {
                data.keyword = args.projectName;
            }

            $.ajax({
                url: createURL('listProjects', {
                    ignoreProject: true
                }),
                data: data,
                dataType: 'json',
                async: true,
                success: function(data) {
                    args.response.success({
                        data: $.map(
                            data.listprojectsresponse.project ?
                            data.listprojectsresponse.project : [],
                            function(elem) {
                                return $.extend(elem, {
                                    displayText: elem.displaytext
                                });
                            })
                    });
                }
            });
        }
    };

    cloudStack.sections.projects = {
        title: 'label.projects',
        id: 'projects',
        sectionSelect: {
            label: 'label.select-view'
        },
        sections: {
            projects: {
                type: 'select',
                id: 'projects',
                title: 'label.projects',
                listView: {
                    fields: {
                        name: {
                            label: 'label.name'
                        },
                        displaytext: {
                            label: 'label.display.name'
                        },
                        domain: {
                            label: 'label.domain'
                        },
                        account: {
                            label: 'label.owner.account'
                        },
                        state: {
                            label: 'label.status',
                            indicator: {
                                'Active': 'on',
                                'Destroyed': 'off',
                                'Disabled': 'off',
                                'Left Project': 'off'
                            }
                        }
                    },

                    advSearchFields: {
                        name: {
                            label: 'label.name'
                        },
                        displaytext: {
                            label: 'label.display.text'
                        },

                        domainid: {
                            label: 'Domain',
                            select: function(args) {
                                if (isAdmin() || isDomainAdmin()) {
                                    $.ajax({
                                        url: createURL('listDomains'),
                                        data: {
                                            listAll: true,
                                            details: 'min'
                                        },
                                        success: function(json) {
                                            var array1 = [{
                                                id: '',
                                                description: ''
                                            }];
                                            var domains = json.listdomainsresponse.domain;
                                            if (domains != null && domains.length > 0) {
                                                for (var i = 0; i < domains.length; i++) {
                                                    array1.push({
                                                        id: domains[i].id,
                                                        description: domains[i].path
                                                    });
                                                }
                                            }
                                            args.response.success({
                                                data: array1
                                            });
                                        }
                                    });
                                } else {
                                    args.response.success({
                                        data: null
                                    });
                                }
                            },
                            isHidden: function(args) {
                                if (isAdmin() || isDomainAdmin())
                                    return false;
                                else
                                    return true;
                            }
                        },

                        account: {
                            label: 'Account',
                            isHidden: function(args) {
                                if (isAdmin() || isDomainAdmin())
                                    return false;
                                else
                                    return true;
                            }
                        }
                    },

                    dataProvider: function(args) {
                        var data = {};
                        listViewDataProvider(args, data);

                        if (isDomainAdmin()) {
                            $.extend(data, {
                                domainid: args.context.users[0].domainid
                            });
                        }

                        $.ajax({
                            url: createURL('listProjects', {
                                ignoreProject: true
                            }),
                            data: data,
                            success: function(data) {
                                args.response.success({
                                    data: data.listprojectsresponse.project,
                                    actionFilter: projectsActionFilter
                                });
                            }
                        });
                    },

                    actions: {
                        add: {
                            label: 'label.new.project',
                            action: {
                                custom: function(args) {
                                    $(window).trigger('cloudStack.newProject');
                                }
                            }
                        }
                    },

                    detailView: {
                        updateContext: function(args) {
                            var project;
                            var projectID = args.context.projects[0].id;
                            var url = 'listProjects';
                            if (isDomainAdmin()) {
                                url += '&domainid=' + args.context.users[0].domainid;
                            }
                            $.ajax({
                                url: createURL(url),
                                data: {
                                    listAll: true,
                                    id: projectID
                                },
                                async: false,
                                success: function(json) {
                                    project = json.listprojectsresponse.project[0]; // override project after update owner
                                }
                            });
                            selectedProjectObj = project;

                            return {
                                projects: [project]
                            };
                        },
                        actions: {
                            edit: {
                                label: 'label.edit',
                                action: function(args) {
                                    $.ajax({
                                        url: createURL('updateProject'),
                                        data: $.extend(true, {}, args.context.projects[0], args.data),
                                        success: function(json) {
                                            args.response.success();
                                        },
                                        error: function(json) {
                                            args.response.error(parseXMLHttpResponse(json));
                                        }
                                    });
                                },
                                messages: {
                                    notification: function(args) {
                                        return 'label.edit.project.details';
                                    }
                                }
                            },
                            disable: {
                                label: 'label.suspend.project',
                                action: function(args) {
                                    $.ajax({
                                        url: createURL('suspendProject'),
                                        data: {
                                            id: args.context.projects[0].id
                                        },
                                        success: function(json) {
                                            args.response.success({
                                                _custom: {
                                                    jobId: json.suspendprojectresponse.jobid,
                                                    getUpdatedItem: function() {
                                                        return {
                                                            state: 'Suspended'
                                                        };
                                                    }
                                                }
                                            });
                                        },
                                        error: function(json) {
                                            args.response.error(parseXMLHttpResponse(json));
                                        }
                                    });
                                },
                                messages: {
                                    confirm: function() {
                                        return 'message.suspend.project';
                                    },
                                    notification: function() {
                                        return 'label.suspend.project';
                                    }
                                },
                                notification: {
                                    poll: pollAsyncJobResult
                                }
                            },

                            enable: {
                                label: 'label.activate.project',
                                action: function(args) {
                                    $.ajax({
                                        url: createURL('activateProject'),
                                        data: {
                                            id: args.context.projects[0].id
                                        },
                                        success: function(json) {
                                            args.response.success({
                                                _custom: {
                                                    jobId: json.activaterojectresponse.jobid, // NOTE: typo
                                                    getUpdatedItem: function() {
                                                        return {
                                                            state: 'Active'
                                                        };
                                                    }
                                                }
                                            });
                                        },
                                        error: function(json) {
                                            args.response.error(parseXMLHttpResponse(json));
                                        }
                                    });
                                },
                                messages: {
                                    confirm: function() {
                                        return 'message.activate.project';
                                    },
                                    notification: function() {
                                        return 'label.activate.project';
                                    }
                                },
                                notification: {
                                    poll: pollAsyncJobResult
                                }
                            },

                            remove: {
                                label: 'label.delete.project',
                                action: function(args) {
                                    $.ajax({
                                        url: createURL('deleteProject', {
                                            ignoreProject: true
                                        }),
                                        data: {
                                            id: args.data.id
                                        },
                                        dataType: 'json',
                                        async: true,
                                        success: function(data) {
                                            args.response.success({
                                                _custom: {
                                                    getUpdatedItem: function(data) {
                                                        return $.extend(data, {
                                                            state: 'Destroyed'
                                                        });
                                                    },
                                                    onComplete: function(data) {
                                                        $(window).trigger('cloudStack.deleteProject', args);
                                                    },
                                                    getActionFilter: function(args) {
                                                        return function() {
                                                            return [];
                                                        };
                                                    },
                                                    jobId: data.deleteprojectresponse.jobid
                                                }
                                            });
                                        }
                                    });
                                },

                                messages: {
                                    confirm: function(args) {
                                        return 'message.delete.project';
                                    },
                                    notification: function(args) {
                                        return 'label.delete.project';
                                    }
                                },

                                notification: {
                                    poll: pollAsyncJobResult
                                }
                            }
                        },

                        tabFilter: function(args) {
                            var project = selectedProjectObj;
                            var projectOwner = project.account;
                            var currentAccount = args.context.users[0].account;
                            var hiddenTabs = [];

                            if (!isAdmin() && !isDomainAdmin()) {
                            	/**
                            	 * deleted by steven 
                            	 * 根据新需求 租户可以对自己创建的项目进行项目扩容申请
                            	 */
                               // hiddenTabs.push('resources');

                                if (currentAccount != projectOwner) {
                                    hiddenTabs.push('accounts');
                                    hiddenTabs.push('invitations');
                                }
                            }

                            if (!cloudStack.projects.requireInvitation()) {
                                hiddenTabs.push('invitations');
                            }

                            return hiddenTabs;
                        },
                        tabs: {
                            details: {
                                title: 'label.details',
                                fields: [{
                                    name: {
                                        label: 'label.name'
                                    }
                                }, {
                                    displaytext: {
                                        label: 'label.display.name',
                                        isEditable: true
                                    },
                                    domain: {
                                        label: 'label.domain'
                                    },
                                    account: {
                                        label: 'label.account'
                                    },
                                    state: {
                                        label: 'label.state'
                                    }
                                }],

                                tags: cloudStack.api.tags({
                                    resourceType: 'Project',
                                    contextId: 'projects'
                                }),

                                dataProvider: function(args) {
                                    var projectID = args.context.projects[0].id;

                                    var url = 'listProjects';

                                    if (isDomainAdmin()) {
                                        url += '&domainid=' + args.context.users[0].domainid;
                                    }
                                    $.ajax({
                                        url: createURL(url),
                                        data: {
                                            listAll: true,
                                            id: projectID
                                        },
                                        success: function(json) {
                                            args.response.success({
                                                data: json.listprojectsresponse.project ? json.listprojectsresponse.project[0] : {},
                                                actionFilter: projectsActionFilter
                                            });
                                        }
                                    });
                                }
                            },

                            accounts: {
                                title: 'label.accounts',
                                custom: function(args) {
                                    var project = args.context.projects[0];
                                    var multiEditArgs = $.extend(
                                        true, {},
                                        cloudStack.projects.addUserForm, {
                                            context: {
                                                projects: [project]
                                            }
                                        }
                                    );
                                    var $users = $('<div>').multiEdit(multiEditArgs);

                                    return $users;
                                }
                            },

                            invitations: {
                                title: 'label.invitations',
                                custom: function(args) {
                                    var project = args.context.projects[0];
                                    var $invites = cloudStack.uiCustom.projectsTabs.userManagement({
                                        useInvites: true,
                                        context: {
                                            projects: [project]
                                        }
                                    });

                                    return $invites;
                                }
                            },

                            resources: {
                                title: '项目扩容申请',
                                custom: function(args) {
                                    var $resources = cloudStack.uiCustom
                                        .projectsTabs.dashboardTabs.resources({
                                            projectID: args.context.projects[0].id
                                        });

                                    return $('<div>').addClass('project-dashboard').append($resources);
                                }
                            }
                        }
                    }
                }
            },

            invitations: {
                type: 'select',
                id: 'invitations',
                title: 'label.invitations',
                listView: {
                    fields: {
                        project: {
                            label: 'label.project'
                        },
                        domain: {
                            label: 'label.domain'
                        },
                        state: {
                            label: 'label.status',
                            indicator: {
                                'Accepted': 'on',
                                'Completed': 'on',
                                'Pending': 'off',
                                'Declined': 'off'
                            }
                        }
                    },

                    dataProvider: function(args) {
                        $.ajax({
                            url: createURL('listProjectInvitations'),
                            data: {
                                state: 'Pending'
                            },
                            success: function(data) {
                                args.response.success({
                                    actionFilter: projectInvitationActionFilter,
                                    data: data.listprojectinvitationsresponse.projectinvitation ? data.listprojectinvitationsresponse.projectinvitation : []
                                });
                            }
                        });
                    },

                    actions: {
                        enterToken: {
                            label: 'label.enter.token',
                            isHeader: true,
                            addRow: false,
                            preFilter: function(args) {
                                var invitationsPresent = false;

                                $.ajax({
                                    url: createURL('listProjectInvitations'),
                                    data: {
                                        state: 'Pending'
                                    },
                                    async: false,
                                    success: function(json) {
                                        if (json.listprojectinvitationsresponse.count) {
                                            invitationsPresent = true;
                                        }
                                    }
                                });

                                return !invitationsPresent;
                            },
                            createForm: {
                                desc: 'message.enter.token',
                                fields: {
                                    projectid: {
                                        label: 'label.project.id',
                                        validation: {
                                            required: true
                                        },
                                        docID: 'helpEnterTokenProjectID'
                                    },
                                    token: {
                                        label: 'label.token',
                                        docID: 'helpEnterTokenToken',
                                        validation: {
                                            required: true
                                        }
                                    }
                                }
                            },
                            action: function(args) {
                                $.ajax({
                                    url: createURL('updateProjectInvitation'),
                                    data: args.data,
                                    success: function(json) {
                                        args.response.success({
                                            _custom: {
                                                jobId: json.updateprojectinvitationresponse.jobid
                                            }
                                        });
                                    },
                                    error: function(json) {
                                        args.response.error(parseXMLHttpResponse(json));
                                    }
                                });
                            },
                            messages: {
                                notification: function() {
                                    return 'label.accept.project.invitation';
                                },
                                complete: function() {
                                    return 'message.join.project';
                                }
                            },
                            notification: {
                                poll: pollAsyncJobResult
                            }
                        },

                        accept: {
                            label: 'label.accept.project.invitation',
                            action: function(args) {
                                $.ajax({
                                    url: createURL('updateProjectInvitation'),
                                    data: {
                                        projectid: args.context.invitations[0].projectid,
                                        account: args.context.users[0].account,
                                        domainid: args.context.users[0].domainid,
                                        accept: true
                                    },
                                    success: function(data) {
                                        args.response.success({
                                            _custom: {
                                                jobId: data.updateprojectinvitationresponse.jobid,
                                                getUpdatedItem: function() {
                                                    return {
                                                        state: 'Accepted'
                                                    };
                                                }
                                            }
                                        });
                                    }
                                });
                            },
                            messages: {
                                confirm: function() {
                                    return 'message.confirm.join.project';
                                },
                                notification: function() {
                                    return 'label.accept.project.invitation';
                                }
                            },
                            notification: {
                                poll: pollAsyncJobResult
                            }
                        },

                        decline: {
                            label: 'label.decline.invitation',
                            action: function(args) {
                                $.ajax({
                                    url: createURL('updateProjectInvitation'),
                                    data: {
                                        projectid: args.context.invitations[0].projectid,
                                        account: args.context.users[0].account,
                                        accept: false
                                    },

                                    success: function(data) {
                                        args.response.success({
                                            _custom: {
                                                jobId: data.updateprojectinvitationresponse.jobid,
                                                getUpdatedItem: function() {
                                                    return {
                                                        state: 'Declined'
                                                    };
                                                }
                                            }
                                        });
                                    }
                                });
                            },
                            notification: {
                                poll: pollAsyncJobResult
                            },
                            messages: {
                                confirm: function() {
                                    return 'message.decline.invitation';
                                },
                                notification: function() {
                                    return 'label.decline.invitation';
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    var projectsActionFilter = function(args) {
        var allowedActions = [];
        if(isAdmin()){
        	allowedActions.push('remove');
        	allowedActions.push('edit');
        }
        /**
         * updated by steven
         * 2014/4/11
         */
        
       /* if (args.context.item.account == cloudStack.context.users[0].account ||
            isAdmin() || isDomainAdmin()) {*/
        if(isAdmin()){
            if (args.context.item.state == 'Suspended') {
                allowedActions.push('enable');
            } else if (args.context.item.state == 'Active') {
                allowedActions.push('disable');
            }

            return allowedActions;
        }

        return [];
    };

    var projectInvitationActionFilter = function(args) {
        var state = args.context.item.state;

        if (state == 'Accepted' || state == 'Completed' || state == 'Declined') {
            return [];
        }

        return ['accept', 'decline'];
    };
}(cloudStack));
