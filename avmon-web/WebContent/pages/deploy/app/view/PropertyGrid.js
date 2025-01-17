/*
 * File: app/view/PropertyGrid.js
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

Ext.define('app.view.PropertyGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.propertyGrid',

    title: '',
    store: 'Properties',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'typeName',
                    text: 'TypeName'
                },
                {
                    xtype: 'gridcolumn',
                    width: 200,
                    dataIndex: 'propName',
                    text: avmon.deploy.properties
                },
                {
                    xtype: 'gridcolumn',
                    width: 300,
                    dataIndex: 'value',
                    text: avmon.deploy.value,
                    editor: {
                        xtype: 'textfield'
                    }
                }
            ],
            selModel: Ext.create('Ext.selection.CellModel', {

            }),
            features: [
                {
                    ftype: 'grouping',
                    hideGroupedHeader: true
                }
            ],
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ]
        });

        me.callParent(arguments);
    }

});