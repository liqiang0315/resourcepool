Ext.define('MyApp.view.NormalAmpSetWindow', {
    extend: 'Ext.window.Window',

    height: 450,
    id: 'normalAmpSetWindow',
    width: 750,
    layout: {
        type: 'border'
    },
    title: avmon.config.ampConfiguration,
    modal: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    region: 'north',
                    height: 120,
                    layout: {
                        type: 'absolute'
                    },
                    frame:true,
                    items: [
                        {
                            xtype: 'displayfield',
                            x: 10,
                            y: 20,
                            id: 'normalAmpInstId',
                            value: 'Display Field',
                            width: 250,
                            labelWidth: 80,
                            fieldLabel: avmon.config.ampInstance
                        },
                        {
                            xtype: 'displayfield',
                            x: 10,
                            y: 55,
                            id: 'normalAmpName',
                            value: 'Display Field',
                            width: 250,
                            labelWidth: 80,
                            fieldLabel: avmon.config.ampName
                        },
                        {
                            xtype: 'displayfield',
                            x: 10,
                            y: 70,
                            id: 'normalAmpStatus',
                            hidden:true,
                            value: 'Display Field',
                            width: 250,
                            labelWidth: 80,
                            fieldLabel: avmon.config.status
                        },
//                        {
//                            xtype: 'button',
//                            x: 220,
//                            y: 70,
//                            id: 'startNormalAmpButId',
//                            icon: 'image/start.gif',
//                            text: '启动',
//                            listeners: {
//                                click: {
//                                    fn: me.onButtonClick,
//                                    scope: me
//                                }
//                            }
//                        },
//                        {
//                            xtype: 'button',
//                            x: 280,
//                            y: 70,
//                            id: 'pauseNormalAmpButId',
//                            icon: 'image/pause.gif',
//                            text: '停止',
//                            listeners: {
//                                click: {
//                                    fn: me.onButtonClick1,
//                                    scope: me
//                                }
//                            }
//                        },
//                        {
//                            xtype: 'button',
////                            x: 340,
//                            x:280,
//                            y: 70,
//                            id: 'normalPushAgentAmpButId',
//                            itemId:'normalPushAgentAmpButId',
//                            text: avmon.config.issuedByScript+'xiajiaoben',
//                            listeners: {
//                                click: {
//                                    fn: me.onButtonClick2,
//                                    scope: me
//                                }
//                            }
//                        },
//                        {
//                            xtype: 'button',
////                            x: 410,
//                            x:360,
//                            y: 70,
//                            id: 'normalPushAmpConfigId',
//                            itemId:'normalPushAmpConfigId',
//                            text: avmon.config.issueByConfiguration,
//                            listeners: {
//                                click: {
//                                    fn: me.onButtonClick3,
//                                    scope: me
//                                }
//                            }
//                        },
                        {
                            xtype: 'hiddenfield',
                            id: 'hiddenAmpId',
                            fieldLabel: 'Label'
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
                    region: 'west',
                    width: 740,
                    activeTab: 0,
                    items: [
    						{
    						    xtype: 'mypanel8'
    						},
	    					{
			                xtype: 'panel',
			                layout: {
			                        type: 'fit'
		                    },
		                    manageHeight: false,
		                    title: avmon.config.schedulingPolicy,
		                    tabConfig: {
		                        xtype: 'tab',
		                        id: 'scheduleTabConfig'
		                    },
		                    items: [
		                        {
		                            xtype: 'panel',
		                            layout: {
		                                type: 'fit'
		                            },
		                            bodyBorder: false,
		                            items: [
		                                {
		                                    xtype: 'gridpanel',
		                                    id: 'normalScheduleGrid',
		                                    forceFit: false,
		                                    store: 'AmpNormalScheduleStore',
		                                    columns: [
		                                        {
		                                            xtype: 'gridcolumn',
		                                            dataIndex: 'kpiCode',
		                                            text: avmon.config.kpiCode
		                                        },
		                                        {
		                                            xtype: 'gridcolumn',
		                                            dataIndex: 'caption',
		                                            text: avmon.config.kpiName
		                                        },
		                                        {
		                                            xtype: 'gridcolumn',
		                                            id: 'scheduleEditorColum',
		                                            dataIndex: 'schedule',
		                                            text: avmon.config.schedulingConfigString,
		                                            editor: {
		                                                xtype: 'textfield',
		                                                id: 'scheduleEditor',
		                                                allowBlank: false
		                                            }
		                                        },
		                                        {
		                                            xtype: 'gridcolumn',
		                                            dataIndex: 'kpiGroup',
		                                            text: avmon.config.group
		                                        },
		                                        {
		                                            xtype: 'gridcolumn',
		                                            renderer: function(value){
		                                              if (value == '1' || value == 1 ) {
		                                                  return avmon.config.yes;
		                                              }
		                                                  return avmon.config.no;
		                                            },
		                                            dataIndex: 'status',
		                                            text: avmon.config.enableFlag//是否启用
		                                        }
		                                    ],
		                                    listeners: {
		                                      viewready: {
		                                          fn: me.initCheckBox,
		                                          scope: me
		                                      }
		                                    },
		                                    viewConfig: {
		                                        id: '',
		                                        focusOnToFront: false,
		                                        autoScroll: true
		                                    },
		                                    dockedItems: [
		                                        {
		                                            xtype: 'toolbar',
		                                            dock: 'top',
		                                            items: [
		                                                {
		                                                    xtype: 'button',
		                                                    id: 'editScheduleButId',
		                                                    text: avmon.config.editSchedulingPolicy,
		                                                    iconCls:'icon-edit',
		                                                    listeners: {
		                                                        click: {
		                                                            fn: me.editScheduleClick,
		                                                            scope: me
		                                                        }
		                                                    }
		                                                },'-',
		                                                {
		                                                    xtype: 'button',
		                                                    id: 'pushSelectedScheduleButId',
		                                                    text: avmon.config.issueByChosenPolicy,
		                                                    iconCls:'icon-ok',
		                                                    listeners: {
		                                                        click: {
		                                                            fn: me.onPushSelectedScheduleButIdClick,
		                                                            scope: me
		                                                        }
		                                                    }
		                                                },'-',
		                                                {
		                                                    xtype: 'button',
		                                                    id: 'pushALlScheduleButId',
		                                                    text: avmon.config.issueByAllPolicy,
		                                                    iconCls:'icon-ok',
		                                                    listeners: {
		                                                        click: {
		                                                            fn: me.onPushALlScheduleButIdClick,
		                                                            scope: me
		                                                        }
		                                                    }
		                                                }
		                                            ]
		                                        }
		                                    ],
		                                    selModel: Ext.create('Ext.selection.CheckboxModel', {
		                                        checkOnly: false
		                                    }),
		                                    plugins: [
		                                        Ext.create('Ext.grid.plugin.CellEditing', {
		                                            ptype: 'cellediting',
		                                            pluginId: 'scheduleEditorPluginId',
		                                            clicksToEdit: 1,
		                                            triggerEvent: 'celldblclick',
		                                            listeners: {
		                                                edit: {
		                                                    fn: me.onGridcelleditingpluginEdit,
		                                                    scope: me
		                                                }
		                                            }
		                                        })
		                                    ]
		                                }
		                            ]
		                        }
		                    ]
		                }
                    ]
                }
            ],
            listeners: {
                show: {
                    fn: me.onWindowShow,
                    scope: me
                }
            }
        });
        me.callParent(arguments);
    },
    initCheckBox:function(me, eOpts){
      var grid = Ext.getCmp("normalScheduleGrid");
      var items = grid.store.data.items;
      var selModes = grid.selModel;
      Ext.each(items,function(item,index){
        if(item.data.status=='1'){
          selModes.doSelect(items[index],true);
        }
      });
    },
    onButtonClick: function(button, e, options) {
        var agentId = Ext.getCmp("agentIdLable1").getValue();
        var ampId = Ext.getCmp("hiddenAmpId").getValue();
        var ampInstId = Ext.getCmp("normalAmpInstId").getValue();
        //组装json数据源
        var agentAmpInfo = "[{'agentId':'"+agentId+"','ampId':'"+ampId+"','ampInstId':'"+ampInstId+"'}]";
        var processBar = Ext.MessageBox.show({
            msg: avmon.config.startingAMPInstance,
            progressText: avmon.config.starting,
            width:300,
            wait:true
        });
        //下发脚本
        Ext.Ajax.request({
            url: 'startNormalAmp',
            method :"POST",
            params: {
                agentAmpInfo:agentAmpInfo
            },
            success: function(response){
                processBar.close();
                var returnJson = Ext.JSON.decode(response.responseText);
                if(returnJson.success){
                    Ext.getCmp("normalAmpStatus").setValue(avmon.config.running)
                    Ext.getCmp("startNormalAmpButId").setDisabled(true);
                    Ext.getCmp("pauseNormalAmpButId").setDisabled(false);

                    //重新加载数据
                    Ext.getCmp('normalAmpSetWindow').loadAmpListInfo(agentId);
                }
                top.Ext.MessageBox.alert(avmon.common.reminder, returnJson.errorMsg);
            },
            failure: function(response, opts) {
                Ext.Msg.alert(avmon.common.failure,avmon.config.operationFail);
            }
        });
    },
    onButtonClick1: function(button, e, options) {
        var agentId = Ext.getCmp("agentIdLable1").getValue();
        var ampId = Ext.getCmp("hiddenAmpId").getValue();
        var ampInstId = Ext.getCmp("normalAmpInstId").getValue();
        //组装json数据源
        var agentAmpInfo = "[{'agentId':'"+agentId+"','ampId':'"+ampId+"','ampInstId':'"+ampInstId+"'}]";
        var processBar = Ext.MessageBox.show({
            msg: avmon.config.stoppingAMPInstance,
            progressText: avmon.config.starting,
            width:300,
            wait:true
        });
        //下发脚本
        Ext.Ajax.request({
            url: 'pauseNormalAmp',
            method :"POST",
            params: {
                agentAmpInfo:agentAmpInfo
            },
            success: function(response){
                processBar.close();
                var returnJson = Ext.JSON.decode(response.responseText);
                top.Ext.MessageBox.alert(avmon.common.reminder, returnJson.errorMsg);
                if(returnJson.success){
                    Ext.getCmp("normalAmpStatus").setValue(avmon.config.stopRun)
                    Ext.getCmp("startNormalAmpButId").setDisabled(false);
                    Ext.getCmp("pauseNormalAmpButId").setDisabled(true);
                    Ext.getCmp('normalAmpSetWindow').loadAmpListInfo(agentId);
                }
            },
            failure: function(response, opts) {
                Ext.Msg.alert(avmon.common.failure,avmon.config.operationFail);
            }
        });
    },
    onButtonClick2: function(button, e, options) {
        var agentId = Ext.getCmp("agentIdLable1").getValue();
        var ampId = Ext.getCmp("hiddenAmpId").getValue();
        var ampInstId = Ext.getCmp("normalAmpInstId").getValue();
        //组装json数据源
        var agentAmpInfo = "[{'agentId':'"+agentId+"','ampId':'"+ampId+"','ampInstId':'"+ampInstId+"'}]";
        var processBar = Ext.MessageBox.show({
            msg: avmon.config.beIssuedByScriptPleaseWait,
            progressText: avmon.config.issuing,
            width:300,
            wait:true
        });
        //下发脚本
        Ext.Ajax.request({
            url: 'pushAgentAmpScript',
            method :"POST",
            params: {
                agentAmpInfo:agentAmpInfo
            },
            success: function(response){
                processBar.close();
                var returnJson = Ext.JSON.decode(response.responseText);
                top.Ext.MessageBox.alert(avmon.common.reminder, returnJson.msg);
                if(returnJson.success){
                    Ext.getCmp('normalAmpSetWindow').loadAmpListInfo(agentId);
                    Ext.getCmp("normalAmpStatus").setValue(avmon.config.stopRun)
                    Ext.getCmp("startNormalAmpButId").setDisabled(false);
                    Ext.getCmp("pauseNormalAmpButId").setDisabled(true);
                }
            },
            failure: function(response, opts) {
                Ext.Msg.alert(avmon.common.failure,avmon.config.operationFail);
            }

        });
    },
//    onButtonClick3: function(button, e, options) {
//        var agentId = Ext.getCmp("agentIdLable1").getValue();
//        var ampId = Ext.getCmp("hiddenAmpId").getValue();
//        var ampInstId = Ext.getCmp("normalAmpInstId").getValue();
//
//        var processBar = Ext.MessageBox.show({
//            msg: avmon.config.issuingConfigurationPleaseWait,
//            progressText: avmon.config.issuing,
//            width:300,
//            wait:true
//        });
//
//        //下发脚本
//        Ext.Ajax.request({
//            url: 'pushAgentAmpConfig',
//            method :"POST",
//            params: {
//                agentId:agentId,
//                //ampInstId:ampInstId,
//                //ampId:ampId
//                agentAmpInfo:"[{'ampInstId':'" + ampInstId + "'}]"
//            },
//            success: function(response){
//
//                processBar.close();
//
//                var returnJson = Ext.JSON.decode(response.responseText);
//                top.Ext.MessageBox.alert(avmon.common.reminder, returnJson.msg);
//            }
//
//        });
//    },
    onButtonClick4: function(button, e, options) {
        var source = Ext.getCmp("normalAMpAttr").getSource();
        //获取null属性判断数据
        var sourceTemp = normalAMPNullSource;
        //必须填写的判断
        for(var key in source){
            var value=source[key];
            if(sourceTemp[key] == 0 && (value == null || value == "")){

                Ext.MessageBox.show({
                    title: avmon.config.wrong,
                    msg: key+avmon.config.mustFillOut,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR,
                    toFrontOnShow:true
                });
                return; 
            }
        }
        var processBar = Ext.MessageBox.show({
            msg: avmon.config.savingDataPleaseWait,
            progressText: avmon.config.saving,
            width:300,
            wait:true
        });
        Ext.Ajax.request({
            url: 'saveNormalAmpAttr',
            method :"POST",
            params: {
                ampAttr:Ext.JSON.encode(source),
                agentId:Ext.getCmp("agentIdLable1").getValue(),
                ampInstId:Ext.getCmp("normalAmpInstId").getValue()
            },
            success: function(response){
                processBar.close();
                var jsonSource = Ext.JSON.decode(response.responseText);
                if(jsonSource.success){
                    Ext.MessageBox.show({
                        title: avmon.common.message,
                        msg: avmon.config.dataSavingSuccessfully,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                        toFrontOnShow:true,
                        animateTarget:'saveNormalAmpButId'
                    });
                }
            },
            failure: function(response, opts) {
                Ext.Msg.alert(avmon.common.failure,avmon.config.operationFail);
            }
        });
    },
    editScheduleClick: function(button, e, options) {
        var grid = Ext.getCmp("normalScheduleGrid");
        var selectCount = grid.getSelectionModel().getCount();
        if(selectCount == 0 || selectCount >1){
            Ext.MessageBox.show({
                title:avmon.config.wrong,
                msg:avmon.config.pleaseSelectASetOfStrategiesForEdit,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR,
                animateTarget:'editScheduleButId'
            });
        }else{
            //开始编辑选中行
            var selectionModule = grid.getSelectionModel().getSelection()[0];
            var editorPlugin = grid.getPlugin("scheduleEditorPluginId");
            var editorColum = Ext.getCmp("scheduleEditorColum");
            editorPlugin.startEdit(selectionModule,editorColum ); 
        }
    },
    onPushSelectedScheduleButIdClick: function(button, e, options) {
        var grid = Ext.getCmp("normalScheduleGrid");
        var selectCount = grid.getSelectionModel().getCount();
        var agentId = Ext.getCmp("agentIdLable1").getValue();
        if(selectCount == 0){
            Ext.MessageBox.show({
                title:avmon.config.wrong,
                msg:avmon.config.pleaseSelectNeedIssueStrategy,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR,
                animateTarget:'pushSelectedScheduleButId'
            });
        }else{
            var dataSelection = grid.getSelectionModel().getSelection();
            var jsonSource = "[";    
            for(var i=0;i<dataSelection.length;i++){
                if(i == dataSelection.length-1){
                    jsonSource += Ext.JSON.encode(dataSelection[i].data);  
                }else{
                    jsonSource += Ext.JSON.encode(dataSelection[i].data)+","; 
                }
            }
            jsonSource+= "]";
            //下发策略
            Ext.getCmp('normalAmpSetWindow').pushSelectedSchedule(jsonSource,'pushSelectedScheduleButId',agentId,"part");
        }
    },
    onPushALlScheduleButIdClick: function(button, e, options) {
        var grid = Ext.getCmp("normalScheduleGrid");
        var agentId = Ext.getCmp("agentIdLable1").getValue();
        var jsonSource ="[{'agentId':'" + agentId + "','ampInstId':'" + Ext.getCmp("normalAmpInstId").getValue() + "'}]"
        //下发策略
        Ext.getCmp('normalAmpSetWindow').pushSelectedSchedule(jsonSource,'pushALlScheduleButId',agentId,"all");
    },
    onGridcelleditingpluginEdit: function(editor, e, options) {
        var recordSource = e.record.data;
        var agentId = Ext.getCmp("agentIdLable1").getValue();
		if(recordSource.kpiGroup==null || recordSource.kpiGroup.length==0){
			var processBar = Ext.MessageBox.show({
                msg: avmon.config.savingDataPleaseWait,
                progressText: avmon.config.saving,
                width:300,
                wait:true
            });
            Ext.Ajax.request({
                url: 'saveAgentSchedue',
                method :"POST",
                params: {
                    scheduleAttr:Ext.JSON.encode(recordSource),
                    agentId:agentId
                },
                success: function(response){
                    processBar.close();
                    var jsonSource = Ext.JSON.decode(response.responseText);
                    if(jsonSource.success){
                        Ext.MessageBox.show({
                            title: avmon.common.message,
                            msg: avmon.config.schedulingPolicyChangeSuccess,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO,
                            toFrontOnShow:true,
                            animateTarget:"editScheduleButId"
                        });
                        //加载策略数据
                        var schduleStore = Ext.getStore('AmpNormalScheduleStore');
                        var schduleStoreProxy = schduleStore.getProxy();
                        schduleStoreProxy.extraParams.ampInstId = Ext.getCmp('normalAmpInstId').getValue();
                        schduleStoreProxy.extraParams.agentId = Ext.getCmp("agentIdLable1").getValue();
                        schduleStore.load();
                    }else{
                        Ext.MessageBox.show({
                            title: avmon.config.schedulingPolicyChangeFailure,
                            msg: jsonSource.errorMsg,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR,
                            toFrontOnShow:true,
                            animateTarget:"editScheduleButId"
                        }); 
                    }

                },
                failure: function(response, opts) {
                    Ext.Msg.alert(avmon.common.failure,avmon.config.operationFail);
                }
            }); 
		}else{
			Ext.MessageBox.confirm(avmon.config.confirmChanges, avmon.config.confirmTheOperation, function(but){
	            if(but == "yes"){
	                var processBar = Ext.MessageBox.show({
	                    msg: avmon.config.savingDataPleaseWait,
	                    progressText: avmon.config.saving,
	                    width:300,
	                    wait:true
	                });
	                Ext.Ajax.request({
	                    url: 'saveAgentSchedue',
	                    method :"POST",
	                    params: {
	                        scheduleAttr:Ext.JSON.encode(recordSource),
	                        agentId:agentId
	                    },
	                    success: function(response){
	                        processBar.close();
	                        var jsonSource = Ext.JSON.decode(response.responseText);
	                        if(jsonSource.success){
	                            Ext.MessageBox.show({
	                                title: avmon.common.message,
	                                msg: avmon.config.schedulingPolicyChangeSuccess,
	                                buttons: Ext.MessageBox.OK,
	                                icon: Ext.MessageBox.INFO,
	                                toFrontOnShow:true,
	                                animateTarget:"editScheduleButId"
	                            });
	                            //加载策略数据
	                            var schduleStore = Ext.getStore('AmpNormalScheduleStore');
	                            var schduleStoreProxy = schduleStore.getProxy();
	                            schduleStoreProxy.extraParams.ampInstId = Ext.getCmp('normalAmpInstId').getValue();
	                            schduleStoreProxy.extraParams.agentId = Ext.getCmp("agentIdLable1").getValue();
	                            schduleStore.load();
	                        }else{
	                            Ext.MessageBox.show({
	                                title: avmon.config.schedulingPolicyChangeFailure,
	                                msg: jsonSource.errorMsg,
	                                buttons: Ext.MessageBox.OK,
	                                icon: Ext.MessageBox.ERROR,
	                                toFrontOnShow:true,
	                                animateTarget:"editScheduleButId"
	                            }); 
	                        }
	                    },
	                    failure: function(response, opts) {
	                        Ext.Msg.alert(avmon.common.failure,avmon.config.operationFail);
	                    }
	                }); 
	            }else{
	            	//加载策略数据
	                var schduleStore = Ext.getStore('AmpNormalScheduleStore');
	                var schduleStoreProxy = schduleStore.getProxy();
	                schduleStoreProxy.extraParams.ampInstId = Ext.getCmp('normalAmpInstId').getValue();
	                schduleStoreProxy.extraParams.agentId = Ext.getCmp("agentIdLable1").getValue();
	                schduleStore.load();
	            }
	        });
		}
    },
    onWindowShow: function(abstractcomponent, options) {
        //设置按钮状态
        var statusTxt = Ext.getCmp("normalAmpStatus").getValue();
        //加载策略数据
        var schduleStore = Ext.getStore('AmpNormalScheduleStore');
        var schduleStoreProxy = schduleStore.getProxy();
        schduleStoreProxy.extraParams.ampInstId = Ext.getCmp('normalAmpInstId').getValue();
        schduleStoreProxy.extraParams.agentId = Ext.getCmp("agentIdLable1").getValue();
        schduleStore.load();
    },

    loadAmpListInfo: function(agentId) {
        var gridProxy = Ext.getCmp("ampListGridId").getStore().getProxy();
        gridProxy.extraParams.agentId = agentId;
        Ext.getCmp("ampListGridId").getStore().load();
    },

    pushSelectedSchedule: function(selectData, butId, agentId,flag) {
        var processBar = Ext.MessageBox.show({
            msg: avmon.config.issuingStrategyPleaseWait,
            progressText: avmon.config.issuing,
            width:300,
            wait:true
        }); 
        var url = "pushAgentAmpSchedule";
        if(flag!="all"){
        	url = "pushAmpSchedule";
        }
        Ext.Ajax.request({
            url: url,
            method :"POST",
            params: {
                agentAmpInfo:selectData,
                agentId:agentId
            },
            success: function(response){
                processBar.close();
                var jsonSource = Ext.JSON.decode(response.responseText);
                if(jsonSource.success==true ||jsonSource.success == 'true'){
                    Ext.MessageBox.show({
                        title: avmon.common.message,
                        msg: avmon.config.issueStrategySuccess,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                        toFrontOnShow:true,
                        animateTarget:butId
                    });
                    Ext.getCmp('normalScheduleGrid').store.load({
                      scope: this,
                      callback: function(records, operation, success) {
                        var grid = Ext.getCmp("normalScheduleGrid");
                        var items = grid.store.data.items;
                        var selModes = grid.selModel;
                        Ext.each(items,function(item,index){
                          if(item.data.status=='1'){
                            selModes.doSelect(items[index],true);
                          }
                        });
                      }
                    });
                }else{
                    Ext.MessageBox.show({
                        title: avmon.config.issueStrategyFailure,
                        msg: jsonSource.errorMsg,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        toFrontOnShow:true,
                        animateTarget:butId
                    }); 
                }
            },
            failure: function(response, opts) {
                Ext.Msg.alert(avmon.common.failure,avmon.config.operationFail);
            }
        });
    }
});