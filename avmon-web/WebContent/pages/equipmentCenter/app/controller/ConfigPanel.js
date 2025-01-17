/*
 * File: app/controller/ConfigPanel.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('app.controller.ConfigPanel', {
    extend: 'Ext.app.Controller',
    alias: 'controller.configPanel',

    refs: [
        {
            ref: 'propertyGrid',
            selector: 'propertyGrid'
        }
    ],

    onBtnSavePropClick: function(button, e, eOpts) {
        var p=this.getPropertyGrid();

        if(p.activeEditor != null){  
            p.activeEditor.completeEdit();  
        } 


        var records=p.getStore().getUpdatedRecords();

        var s="";

        Ext.each(records,function(record){
            s+=record.get("propId")+"="+record.get("value")+",";
        });

        var moId=Ext.getCmp('moId').getValue();
        Ext.Ajax.request({
            url: 'saveMoProperty',
            params: {mo:moId,props:s},
            timeout:30000,
            success: function(response, opts) {
                //p.getStore().commitChanges();
                Ext.example.msg('Done', avmon.config.saveSuccess);
            },
            failure: function(response, opts) {
            	Ext.example.msg('Done', avmon.config.saveFailure);
            }
        });
    },

    onBtnPauseAgentClick: function(button, e, eOpts) {

        var moId=Ext.getCmp('moId').getValue();

        Ext.Ajax.request({
            url: 'pauseAgent',
            params: {mo:moId},
            success: function(response, opts) {
                Ext.getCmp("agentStatus").setValue("暂停");
                Ext.example.msg('Done', 'Agent已暂停！');
            },
            failure: function(response, opts) {
                alert('error');
            }
        });

    },

    onBtnStartAgentClick: function(button, e, eOpts) {

        var moId=Ext.getCmp('moId').getValue();

        Ext.Ajax.request({
            url: 'startAgent',
            params: {mo:moId},
            success: function(response, opts) {
                Ext.getCmp("agentStatus").setValue("恢复运行");
                Ext.example.msg('Done', 'Agent已设置恢复运行！');
            },
            failure: function(response, opts) {
                alert('error');
            }
        });

    },

    init: function(application) {
        this.control({
            "#btnSaveProp": {
                click: this.onBtnSavePropClick
            },
            "#btnPauseAgent": {
                click: this.onBtnPauseAgentClick
            },
            "#btnStartAgent": {
                click: this.onBtnStartAgentClick
            }
        });
    }

});
