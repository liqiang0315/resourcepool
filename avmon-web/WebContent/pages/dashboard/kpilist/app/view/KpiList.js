/*
 * File: app/view/KpiList.js
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

Ext.define('app.view.KpiList', {
    extend: 'Ext.container.Viewport',

    id: 'performance-kpiListPanel',
//    layout: {
//        type: 'anchor'
//    },
    
    

    initComponent: function() {
        var me = this;
        
        var moId=Ext.avmon.currentMoId;
        
        setInterval(this.onButtonClickAutoRefresh,60000);
        
//        var allGridId = '';
        
        var wholepanel = Ext.create('Ext.panel.Panel', {
        	id:'wholepanel',
        	autoScroll: true,
        	height:500,
            layout: {
                type: 'anchor'
            },
            items: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        width: 1100,
                        items: [
                            {
                                xtype: 'button',
                                id: 'btn009',
                                iconCls: 'icon-refresh',
//                                enableToggle: true,
//                                pressed: false,
                                text: '手动刷新',
                                listeners: {
                                    click: {
                                        fn: me.onButtonClickmanuRefresh,
                                        scope: me
                                    }                                                                                                                
                                }
                            },
                            {
                                xtype: 'button',
                                id: 'btn014',
                                iconCls: 'icon-refresh',
                                text: '自动刷新',
                                pressed:true
//                                	,
//                                listeners: {
//                                    click: {
//                                        fn: me.onButtonClickAutoRefresh,
//                                        scope: me
//                                    }                                                                                                                
//                                }
                            }
                            ,
                            {
                            	xtype:'textfield',
                            	hidden:true,
                            	id:'allpageGridID'
                            }
                        ]
                    }
//                    ,
//                    
//                    {
//                    	xtype:'button',
//                    	iconCls: 'icon-zoomin',
//                    	id:'009plus',
//                    	anchor:'100% 4%',
//                    	text:'012-主机CPU等待队列信息（012）',
//                    	width:15,
//                    	height:20,
//                    	listeners: {
//                            click: {
////                            	fn:{Ext.getCmp("grid014").show();
////                            	alert('inte tet');}
//                                fn: me.expand,
//                                scope: me
//                            }                                                                                                                
//                        }
//                    		
//                    }
                    
                    
                        
                
            ]
        });

        
    	Ext.Ajax.request({
        	url : "../../performance/getAllType",
        	params : {
        	mo : moId
        	},
        	method : 'POST',
        	success : function(response) {
//        		alert('response.responseText  ' + response.responseText);
//        	var json = Ext.JSON.decode(response.responseText);
        		
        		var allGridValue = '';
        	
        		var types = response.responseText;
        		
        		
        		var arrTypes= new Array(); 
        		
        		arrTypes = types.split(',');
        		
        		var arrIds = new Array();
        		
        		for (var n=0;n<arrTypes.length;n++)
        		{
        			arrIds.push('name' + n);
        			
        			allGridValue = allGridValue + ('name' + n) + '|' + arrTypes[n] + ',';
        			
        			
//        			allGridId = allGridId + arrIds.push('name' + n) + ','; 
        			
        		}
        		
        		Ext.getCmp('allpageGridID').setValue(allGridValue);
        		
        		
        		for (var v=0;v<arrTypes.length;v++)	
        	    {  
        			var dyntype = arrTypes[v]; 
        			
        			var typeId = arrIds[v];
        			
//        			if(v == 0)
//        			{
//        				alert('v ... ' + v);
//        				var tempidin = v;
        			
        				var innerid = '';
            			var addButton = Ext.create("Ext.Button", {
            				iconCls: 'icon-zoomin',
                        	id:'addbtn'+typeId,
                        	anchor:'100%',
                        	text:dyntype,
                        	textAlign:'left',
                        	width:15,
                        	height:30
                        	,
                        	listeners: {
                        		click:function(){
//                        			alert(this.id.length);
//                        			alert('click grid id' + this.id.substring(6,this.id.length) + '|||');
//                        			alert(this.text + '  ' + this.id);
                        			innerid = this.id.substring(6,this.id.length);
                    		    	var moId=Ext.avmon.currentMoId;
                    		    	Ext.Ajax.request({
                    		        	url : "../../performance/dynamicgrid",
                    		        	params : {
                    		        	mo : moId,
//                    		        	type:'012-主机CPU等待队列信息（012）'
                    		        	type:this.text	
                    		        		
                    		        	},
                    		        	method : 'POST',
                    		        	success : function(response) {
                    		        	var json = Ext.JSON.decode(response.responseText);
                    		        	column = new Ext.grid.column.Column(json.columModle);        	
                    		        	var store = Ext.create('Ext.data.Store', {
                    		        	fields : json.fieldsNames,
                    		        	data : json.data
                    		        	});
                    		      
//                    		        	Ext.getCmp(tempidin1+'id').reconfigure(store, json.columModle);
                    		        	
//                    		        	alert('click in ajaxlll,,,,,' + innerid);
                    		        	Ext.getCmp(innerid).reconfigure(store, json.columModle);
//                    		        	Ext.getCmp(this.id.substring(6,this.id.length)).reconfigure(store, json.columModle);
                    		        	
//                    		        	continue;
        
                    		        	}
                    		        	});
                    		    	
                    		    	Ext.getCmp(innerid).show();
                    		    	
//                    		    	Ext.getCmp(this.id.substring(6,this.id.length)).show();
                        			
                        		
                        		}
                        		
//                                click: {
//                                	function(){
//                                		alert();
//                                	}
////                                    fn: me.expand(dyntype,typeId),
////                                    scope: me
//                                }                                                                                                                
                            }
            				
            			});
            			
//            			addButton.on("click", function () {
//            				
//            				alert('dyntype  ' + dyntype + ' typeId ' + typeId);
//
//            		    	var moId=Ext.avmon.currentMoId;
//            		    	Ext.Ajax.request({
//            		        	url : "../../performance/dynamicgrid",
//            		        	params : {
//            		        	mo : moId,
////            		        	type:'012-主机CPU等待队列信息（012）'
//            		        	type:dyntype	
//            		        		
//            		        	},
//            		        	method : 'POST',
//            		        	success : function(response) {
//            		        	var json = Ext.JSON.decode(response.responseText);
//            		        	column = new Ext.grid.column.Column(json.columModle);        	
//            		        	var store = Ext.create('Ext.data.Store', {
//            		        	fields : json.fieldsNames,
//            		        	data : json.data
//            		        	});
//            		      
////            		        	Ext.getCmp(tempidin1+'id').reconfigure(store, json.columModle);
//            		        	
////            		        	Ext.getCmp('name0').reconfigure(store, json.columModle);
//            		        	Ext.getCmp(typeId).reconfigure(store, json.columModle);
//            		        	
////            		        	continue;
//
//            		        	}
//            		        	});
//            		    	
//            		    	Ext.getCmp(typeId).show();
//            		    	
////            		    	Ext.getCmp("name0").show();
//            		    	
//            		    	alert('click add button');
//            		    	
//            		    
//            				
//            			});

            			wholepanel.add(addButton).show();	
        				
//        				arrIds[v] = 'id' + v;
        				
        			var gridPanel = Ext.create('Ext.grid.Panel', {
//        	    		id:tempidin+'id',
        	    		id:typeId,
//        	    		name:v+'id',
        	    		anchor:'100%',
        	        	hidden:true,
        	    		height:70,
        	        	store : 'templateStore', 
        	        	columns : []
//        			    ,
//        	        	title: dyntype
        	    	});
        			
        			
        			
        			wholepanel.add(gridPanel);
        			
        	    	 
                	
//                	alert('grid id ----- ' + gridPanel.getId());
                	
    
                	
//                	wholepanel.add(gridPanel).show();
//                	wholepanel.doLayout(); 

       
//        			}
        			
//        			else if(v == 1)
//        			{
////        				alert('grid2');
////        				alert('v nnnlllll;;;;....|||; ' + v);
//        				
////        				var tempidin1 = v;
//        				var innerid = '';
//            			var addButton = Ext.create("Ext.Button", {
//            				iconCls: 'icon-zoomin',
//                        	id:'addbtn'+typeId,
//                        	anchor:'100% 4%',
//                        	text:dyntype,
//                        	width:15,
//                        	height:20
//                        	,
//                        	listeners: {
//                        		
//
//                        		click:function(){
//                        			
////                        			alert(this.text + '  ' + this.id);
//                        			
////                        			alert('click grid id  ' + this.id.substring(6,this.id.length));
//                        			innerid = this.id.substring(6,this.id.length);
//                    		    	var moId=Ext.avmon.currentMoId;
//                    		    	Ext.Ajax.request({
//                    		        	url : "../../performance/dynamicgrid",
//                    		        	params : {
//                    		        	mo : moId,
////                    		        	type:'012-主机CPU等待队列信息（012）'
//                    		        	type:this.text	
//                    		        		
//                    		        	},
//                    		        	method : 'POST',
//                    		        	success : function(response) {
//                    		        	var json = Ext.JSON.decode(response.responseText);
//                    		        	column = new Ext.grid.column.Column(json.columModle);        	
//                    		        	var store = Ext.create('Ext.data.Store', {
//                    		        	fields : json.fieldsNames,
//                    		        	data : json.data
//                    		        	});
//                    		      
////                    		        	Ext.getCmp(tempidin1+'id').reconfigure(store, json.columModle);
//                    		        	
////                    		        	Ext.getCmp('name0').reconfigure(store, json.columModle);
//                    		        	Ext.getCmp(innerid).reconfigure(store, json.columModle);
//                    		        	
//        
//                    		        	}
//                    		        	});
//                    		    	
//                    		    	Ext.getCmp(innerid).show();
//                        			
//                        		
//                        		}
//                        		
////                                click: {
////                                	function(){
////                                		alert();
////                                	}
//////                                    fn: me.expand(dyntype,typeId),
//////                                    scope: me
////                                }                                                                                                                
//                            
//                        		
////                                click: {
////                                    fn: me.expand1,
////                                    scope: me
////                                }                                                                                                                
//                            }
//            				
//            			});
//            			
////            			addButton.on("click", function () {
////            				
////            				alert('dyntype  ' + dyntype + ' typeId ' + typeId);
////
////            		    	var moId=Ext.avmon.currentMoId;
////            		    	Ext.Ajax.request({
////            		        	url : "../../performance/dynamicgrid",
////            		        	params : {
////            		        	mo : moId,
//////            		        	type:'014-主机磁盘信息（014）'
////            		        	type:dyntype	
////            		        	},
////            		        	method : 'POST',
////            		        	success : function(response) {
////            		        	var json = Ext.JSON.decode(response.responseText);
////            		        	column = new Ext.grid.column.Column(json.columModle);        	
////            		        	var store = Ext.create('Ext.data.Store', {
////            		        	fields : json.fieldsNames,
////            		        	data : json.data
////            		        	});
////            		      
//////            		        	Ext.getCmp(tempidin1+'id').reconfigure(store, json.columModle);
////            		        	
////            		        	Ext.getCmp(typeId).reconfigure(store, json.columModle);
////            		        	
//////            		        	Ext.getCmp('name1').reconfigure(store, json.columModle);
////            		        	
//////            		        	continue;
////
////            		        	}
////            		        	});
////            		    	
////            		    	Ext.getCmp(typeId).show();
////            		    	
//////            		    	Ext.getCmp("name1").show();
////            		    	
////            		    	alert('click add button1');
////            		    	
////            		    
////            				
////            			});
//            			
//
//            			wholepanel.add(addButton).show();    
//        				
////        				arrIds[v] = 'id' + v;
//        				
//            			var gridPanel = Ext.create('Ext.grid.Panel', {
////            	    		id:tempidin1+'id',
//            				id:typeId,
////            	    		name:v+'id',
//            	    		anchor:'100% 15%',
//            	        	hidden:true,
//            	        	store : 'templateStore', 
//            	        	columns : []
////            			    ,
////            	        	title: dyntype
//            	    	});
//            	    	    
//            			
//            			
//            			wholepanel.add(gridPanel);            			            			            			
//
////            	    	wholepanel.add(gridPanel).show();
////                    	wholepanel.doLayout();
////                    	alert('grid id ----- ' + gridPanel.getId());
//                    	
////                    	Ext.Ajax.request({
////                        	url : "../../performance/dynamicgrid",
////                        	params : {
////                        	mo : moId,
////                        	type:dyntype
////                        	},
////                        	method : 'POST',
////                        	success : function(response) {
////                        	var json = Ext.JSON.decode(response.responseText);
////                        	column = new Ext.grid.column.Column(json.columModle);        	
////                        	var store = Ext.create('Ext.data.Store', {
////                        	fields : json.fieldsNames,
////                        	data : json.data
////                        	});
////                      
//////                        	Ext.getCmp('gridid1').reconfigure(store, json.columModle);  
////                        	
////                        	
//////                        	Ext.getCmp(tempidin+'id').reconfigure(store, json.columModle);
////                        	alert('ajax grid id ' + gridPanel.getId());
////                        	Ext.getCmp(gridPanel.getId()).reconfigure(store, json.columModle);
////                        	
//////                        	continue;
////
////                        	}
////                        	});
//                    	
//                    	
//                    	
//                    	
//        			}	
        	    }        		
 
//        		for (var v=0;v<2;v++)
//        		{
//        			var dyntype = arrTypes[v]; 
//        			
//        			var typeId = arrIds[v];
//        			
//        			alert('typeId  ' + typeId + ' ');
//        			
//        			if(v==0)
//        			{
//                    	Ext.Ajax.request({
//                        	url : "../../performance/dynamicgrid",
//                        	params : {
//                        	mo : moId,
//                        	type:dyntype
//                        	},
//                        	method : 'POST',
//                        	success : function(response) {
//                        	var json = Ext.JSON.decode(response.responseText);
//                        	column = new Ext.grid.column.Column(json.columModle);        	
//                        	var store = Ext.create('Ext.data.Store', {
//                        	fields : json.fieldsNames,
//                        	data : json.data
//                        	});
//                      
////                        	Ext.getCmp('gridid1').reconfigure(store, json.columModle);  
//                        	
//                        	
////                        	Ext.getCmp(tempidin+'id').reconfigure(store, json.columModle);
//                        	
//                        	Ext.getCmp(typeId).reconfigure(store, json.columModle);
//                        	
////                        	continue;
//        
//                        	}
//                        	});        	    	    
//        			
//
//        			}	
//        			else if(v==1)
//        			{
//                    	Ext.Ajax.request({
//                        	url : "../../performance/dynamicgrid",
//                        	params : {
//                        	mo : moId,
//                        	type:dyntype
//                        	},
//                        	method : 'POST',
//                        	success : function(response) {
//                        	var json = Ext.JSON.decode(response.responseText);
//                        	column = new Ext.grid.column.Column(json.columModle);        	
//                        	var store = Ext.create('Ext.data.Store', {
//                        	fields : json.fieldsNames,
//                        	data : json.data
//                        	});
//                      
////                        	Ext.getCmp(tempidin1+'id').reconfigure(store, json.columModle);
//                        	
//                        	Ext.getCmp(typeId).reconfigure(store, json.columModle);
//                        	
////                        	continue;
//        
//                        	}
//                        	});        	    	    
//        			
//        			}	
//        		}	

        	}
        	});        

        Ext.Ajax.timeout = 90000000000;

        Ext.applyIf(me, {
        	autoScroll: true,
//        	height:1000,
        	items:wholepanel

        });

        
        
        me.callParent(arguments);
    },

    onButtonClickmanuRefresh: function(button, e, eOpts) {
//        var moId=Ext.avmon.currentMoId;
//        
////        alert(Ext.getCmp('allpageGridID').getValue());
////        
////        alert(Ext.getCmp('allpageGridID').getValue().substring(0,(Ext.getCmp('allpageGridID').getValue().length-1)));
//        
//        var allIds = Ext.getCmp('allpageGridID').getValue().substring(0,(Ext.getCmp('allpageGridID').getValue().length-1)).split(',');
//        
//        for(var n=0;n<allIds.length;n++)
//        {
//        	var id_type = allIds[n];
//        	var arrId_type = allIds[n].split('|');
//        	var updId = arrId_type[0];
//        	var updType = arrId_type[1];
//        	Ext.Ajax.request({
//	        	url : "../../performance/dynamicgrid",
//	        	params : {
//	        	mo : moId,
//	        	type:updType	
//	        		
//	        	},
//	        	method : 'POST',
//	        	success : function(response) {
//	        	var json = Ext.JSON.decode(response.responseText);
//	        	column = new Ext.grid.column.Column(json.columModle);        	
//	        	var store = Ext.create('Ext.data.Store', {
//	        	fields : json.fieldsNames,
//	        	data : json.data
//	        	});
//	      
//	        	Ext.getCmp(updId).reconfigure(store, json.columModle);
//	        	
//	        	
//
//	        	}
//	        	});
//        	
//        	continue;
//        }	
        
    	this.refreshWholePage();

    },

//    onButtonClickAutoRefresh: function(button, e, eOpts) {
    onButtonClickAutoRefresh: function() {	
//        var moId=Ext.avmon.currentMoId;

//        setInterval(this.this.refreshWholePage,60000);
    	
    	if(! Ext.getCmp("btn014").pressed){
            return;
        }
    	
    	
        var moId=Ext.avmon.currentMoId;
        
//        alert('update!');
        var allIds = Ext.getCmp('allpageGridID').getValue().substring(0,(Ext.getCmp('allpageGridID').getValue().length-1)).split(',');
        
        for(var n=0;n<allIds.length;n++)
        {
        	var id_type = allIds[n];
        	var arrId_type = allIds[n].split('|');
        	var updId = arrId_type[0];
        	var updType = arrId_type[1];
        	Ext.Ajax.request({
  	        	url : "../../performance/dynamicgrid",
  	        	params : {
  	        	mo : moId,
  	        	type:updType	
  	        		
  	        	},
  	        	method : 'POST',
  	        	success : function(response) {
  	        	var json = Ext.JSON.decode(response.responseText);
  	        	column = new Ext.grid.column.Column(json.columModle);        	
  	        	var store = Ext.create('Ext.data.Store', {
  	        	fields : json.fieldsNames,
  	        	data : json.data
  	        	});
  	      
  	        	Ext.getCmp(updId).reconfigure(store, json.columModle);
  	        	
  	        	

  	        	}
  	        	});
        	
        	continue;
        }
    },    
    
    refreshWholePage:function()
    {
        var moId=Ext.avmon.currentMoId;
        
//      alert('update!');
      var allIds = Ext.getCmp('allpageGridID').getValue().substring(0,(Ext.getCmp('allpageGridID').getValue().length-1)).split(',');
      
      for(var n=0;n<allIds.length;n++)
      {
      	var id_type = allIds[n];
      	var arrId_type = allIds[n].split('|');
      	var updId = arrId_type[0];
      	var updType = arrId_type[1];
      	Ext.Ajax.request({
	        	url : "../../performance/dynamicgrid",
	        	params : {
	        	mo : moId,
	        	type:updType	
	        		
	        	},
	        	method : 'POST',
	        	success : function(response) {
	        	var json = Ext.JSON.decode(response.responseText);
	        	column = new Ext.grid.column.Column(json.columModle);        	
	        	var store = Ext.create('Ext.data.Store', {
	        	fields : json.fieldsNames,
	        	data : json.data
	        	});
	      
	        	Ext.getCmp(updId).reconfigure(store, json.columModle);
	        	
	        	

	        	}
	        	});
      	
      	continue;
      }
    },
    
    expand:function(type,id)
    {
    	alert(type + '  ' + id);
//    	var moId=Ext.avmon.currentMoId;
//    	Ext.Ajax.request({
//        	url : "../../performance/dynamicgrid",
//        	params : {
//        	mo : moId,
//        	type:'012-主机CPU等待队列信息（012）'
//        	},
//        	method : 'POST',
//        	success : function(response) {
//        	var json = Ext.JSON.decode(response.responseText);
//        	column = new Ext.grid.column.Column(json.columModle);        	
//        	var store = Ext.create('Ext.data.Store', {
//        	fields : json.fieldsNames,
//        	data : json.data
//        	});
//      
////        	Ext.getCmp(tempidin1+'id').reconfigure(store, json.columModle);
//        	
//        	Ext.getCmp('name0').reconfigure(store, json.columModle);
//        	
////        	continue;
//
//        	}
//        	});
//    	
//    	Ext.getCmp("name0").show();
//    	
//    	alert('click add button');
    	
    },
    
    expand1:function()
    {
    	var moId=Ext.avmon.currentMoId;
    	Ext.Ajax.request({
        	url : "../../performance/dynamicgrid",
        	params : {
        	mo : moId,
        	type:'014-主机磁盘信息（014）'
        	},
        	method : 'POST',
        	success : function(response) {
        	var json = Ext.JSON.decode(response.responseText);
        	column = new Ext.grid.column.Column(json.columModle);        	
        	var store = Ext.create('Ext.data.Store', {
        	fields : json.fieldsNames,
        	data : json.data
        	});
      
//        	Ext.getCmp(tempidin1+'id').reconfigure(store, json.columModle);
        	
        	Ext.getCmp('name1').reconfigure(store, json.columModle);
        	
//        	continue;

        	}
        	});
    	
    	Ext.getCmp("name1").show();
    	
    	alert('click add button1');
    	
    },    
    

    reloadModule: function(moId) {
 
    	alert('000');
//    	var store1 = Ext.getCmp("kpiListGrid").getStore();
//    	store1.load({params:{mo:moId}});
//        
//    	var store2 = Ext.getCmp("kpiListGrid1").getStore(); 
//    	store2.load({params:{mo:moId}});
//    	
//    	Ext.getCmp("kpiListGrid2").getStore().load({params:{mo:moId}});
    	

    }
    
    ,
    beforegridshow: function()
    {
    	Ext.getCmp("kpiListGrid").getStore().load({params:{type:'grid01'}});
    }
    ,
    beforegrid1show: function()
    {    	
//    	Ext.getCmp("kpiListGrid").getStore().load({params:{type:'grid01'}});
    	Ext.getCmp("kpiListGrid1").getStore().load({params:{type:'grid02'}});
    }

});