/*
 * File: app/store/TreeNodes.js
 *
 * This file was generated by Sencha Architect version 2.2.3.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('performance.store.TreeNodes', {
    extend: 'Ext.data.TreeStore',

    requires: [
        'performance.model.TreeNode'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'performance.model.TreeNode',
            storeId: 'MyTreeStore',
            nodeParam: 'id',
            root: {
                expanded: false,
                views: 'totalView',
                defaultView: 'totalView',
                text: '数据中心',
                id: 'root'
            },
            proxy: {
                type: 'ajax',
                url: 'menuTree',
                reader: {
                    type: 'json',
                    idProperty: 'id'
                }
            }
        }, cfg)]);
    }
});