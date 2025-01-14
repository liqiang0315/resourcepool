/*
 * File: app/controller/KpiCompareController.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
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

Ext.define('MyApp.controller.KpiCompareController', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'mytreepanel',
            selector: 'mytreepanel'
        }
    ],

    onTreepanelCheckChange: function(node, checked, options) {
        if(checked){
            nodeIds.push(node.data.id);
        }else{
            Ext.Array.remove(nodeIds,node.data.id);
        }
        var kpiCheckBox = Ext.getCmp("compare_kpi_id");
        kpiCheckBox.clearValue();
        kpiCheckBox.store.proxy.url = "../config/kpiList?moId=" + nodeIds.join(',');
        kpiCheckBox.store.reload();
    },

    init: function(application) {
        this.control({
            "mytreepanel": {
                checkchange: this.onTreepanelCheckChange
            }
        });
    }

});
