/*
 * File: app/store/KpiValues.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('app.store.KpiValues', {
    extend: 'Ext.data.Store',

    requires: [
        'app.model.KpiValuez'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
        	autoLoad: false,
            model: 'app.model.KpiValuez',
            storeId: 'MyJsonStore1',
            groupField: 'AMP_INSTANCE_NAME',
            timeout:10000000000000,
            proxy: {
                type: 'ajax',
                extraParams: {
                    mo: 'None'
                },
                url: '../../performance/kpiValueList',
                reader: {
                    type: 'json',
                    root: 'activeData009',
                }
            }
        }, cfg)]);
    }
});