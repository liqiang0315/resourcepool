/*
 * File: app/view/MyViewport.js
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

Ext.define('MyApp.view.MyViewport', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'fit'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: {
                        type: 'fit'
                    },
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'button',
                                    icon: 'config.gif',
                                    text: avmon.ireport.conditionSet,
                                    listeners: {
                                        click: {
                                            fn: me.onButtonClick1,
                                            scope: me
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'form',
                            dock: 'top',
                            hidden: true,
                            id: 'searchForm',
                            itemId: 'searchForm',
                            layout: {
                                type: 'absolute'
                            },
                            bodyPadding: 10,
                            items: [
                                {
                                    xtype: 'datefield',
                                    x: 10,
                                    y: 10,
                                    name: 's_start_date',
                                    fieldLabel: avmon.ireport.startDate,
                                    labelWidth: 70,
                                    allowBlank: false,
                                    format: 'Y-m-d'
                                },
                                {
                                    xtype: 'datefield',
                                    x: 240,
                                    y: 10,
                                    name: 's_end_date',
                                    fieldLabel: avmon.ireport.dueDate,
                                    labelWidth: 70,
                                    allowBlank: false,
                                    format: 'Y-m-d'
                                },
                                {
                                    xtype: 'button',
                                    x: 480,
                                    y: 10,
                                    width: 60,
                                    text: avmon.ireport.generateReport,
                                    listeners: {
                                        click: {
                                            fn: me.onButtonClick,
                                            scope: me
                                        }
                                    }
                                }
                            ]
                        }
                    ],
                    items: [
                        {
                            xtype: 'panel',
                            id: 'contentPanel',
                            itemId: 'contentPanel',
                            autoScroll: true,
                            layout: {
                                type: 'fit'
                            },
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    hidden: true,
                                    items: [
                                        {
                                            xtype: 'button',
                                            icon: '../source/image/exportPdf.png',
                                            text: avmon.ireport.exportPDF,
                                            listeners: {
                                                click: {
                                                    fn: me.onButtonClick2,
                                                    scope: me
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'tbseparator'
                                        },
                                        {
                                            xtype: 'button',
                                            icon: '../source/image/word.gif',
                                            text: avmon.ireport.exportWord,
                                            listeners: {
                                                click: {
                                                    fn: me.onButtonClick3,
                                                    scope: me
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'tbseparator'
                                        },
                                        {
                                            xtype: 'button',
                                            icon: '../source/image/excel.gif',
                                            text: avmon.ireport.exportExcel,
                                            listeners: {
                                                click: {
                                                    fn: me.onButtonClick4,
                                                    scope: me
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    listeners: {
                        afterrender: {
                            fn: me.onPanelAfterRender,
                            scope: me
                        }
                    }
                }
            ]
        });

        me.callParent(arguments);
    },

    onButtonClick1: function(button, e, options) {
        Ext.create('MyApp.view.MyWindow').show();
    },

    onButtonClick: function(button, e, options) {
        var myform = Ext.getCmp('searchForm').getForm();

        var startDate, endDate;			
        if (myform.isValid()) {
            Ext.iterate(myform.getValues(), function(key, value) {
                if (key == 's_start_date') {
                    if (value != null && value != '') {
                        //s_start_date = Ext.util.Format.date(new Date(), 'Y/m/d h:m:s');
                        startDate = value;// + ' 00:00:00';
                    }
                } else if (key == 's_end_date') {
                    if (value != null && value != '') {
                        endDate = value;// + ' 23:59:59';
                    }
                }
            }, this);

            //alert('<%=reportId%>');
            //alert(startDate);
            //alert(endDate);

            Ext.getCmp('contentPanel').update('<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="../../ireport/getNetworkPollingData.jsp?reportId='+ Ext.arpcheck.reportId + '&mo='+'1'+'&startDate=' + startDate + '&endDate=' + endDate + '"></iframe>');
        }
    },

    onButtonClick2: function(button, e, options) {
        var url  = "../source/config/report-html.jsp?reportId="+Ext.arpcheck.reportId+
        "&type=pdf&params="+encodeURI(Ext.arpcheck.parmstr);
        window.location=url;
    },

    onButtonClick3: function(button, e, options) {
        var url  = "../source/config/report-html.jsp?reportId="+Ext.arpcheck.reportId+
        "&type=word&params="+encodeURI(Ext.arpcheck.parmstr);
        window.location=url;
    },

    onButtonClick4: function(button, e, options) {
        var url  = "../source/config/report-html.jsp?reportId="+Ext.arpcheck.reportId+
        "&type=excel&params="+encodeURI(Ext.arpcheck.parmstr);
        window.location=url;
    },

    onPanelAfterRender: function(abstractcomponent, options) {
        Ext.create('MyApp.view.MyWindow').show();
    }

});