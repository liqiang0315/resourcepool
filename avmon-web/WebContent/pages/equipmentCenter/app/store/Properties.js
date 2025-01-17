/*
 * File: app/store/Properties.js
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

Ext.define('app.store.Properties', {
    extend: 'Ext.data.Store',

    requires: [
        'app.model.Property'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'app.model.Property',
            storeId: 'MyJsonStore2',
            groupField: 'typeName',
            proxy: {
                type: 'ajax',
                url: 'moDetail',
                reader: {
                    type: 'json',
                    root: 'properties',
                    totalProperty: 'propertyTotal'
                }
            },
            sorters: {
                property: 'index'
            }
        }, cfg)]);
    }
});