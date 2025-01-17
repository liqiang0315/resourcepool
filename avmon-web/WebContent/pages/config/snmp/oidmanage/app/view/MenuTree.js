/*
 * File: app/view/MenuTree.js
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

Ext.define('app.view.MenuTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.menuTree',
    id:	'menuTree',    
    store: 'Menus',
    rootVisible: false,    

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            viewConfig: {

            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'textfield',
                            id: 'treeSearch',
                            width: 120
                        },
                        {
                            xtype: 'buttongroup',
                            columns: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    id:	'btnTreeSearch',
                                    iconCls: 'icon-search',
                                    text: avmon.config.retrieve
                                }
                            ]
                        }
                    ]
	            },
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'button',
                            id: 'btnRefreshTree',
                            iconCls: 'icon-refresh',
                            text: avmon.config.refresh
                        },
                        {
                            xtype: 'button',
                            id: 'btnAddMO',
                            iconCls: 'icon-add',
                            text: avmon.config.newIncrease
                        },
                        {
                            xtype: 'button',
                            id: 'btnRemoveMO',
                            iconCls: 'icon-delete',
                            text: avmon.config.remove
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
        
    }
});