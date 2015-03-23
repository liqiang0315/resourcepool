var isLoadingModule=false;

function menuButtonHandler(button, e, options){
	//alert(button);
	//console.log(button._pageConfig.title);
	showPerformancePlugin(button._pageConfig.id);
}

Ext.define('performance.controller.MenuTree', {
    extend: 'Ext.app.Controller',

    onMenuTreeAfterRender: function(abstractcomponent, options) {
        var tree=Ext.getCmp("performance-menuTree");

        var parentNode=tree.getRootNode();

        parentNode.expand(false,function(){
        	tree.getSelectionModel().select(tree.getStore().getNodeById('root'),true);
        });

    },

    onMenuTreeSelect: function(selModel, record, index, options) {
        var tabs=Ext.getCmp('performance-tabPanel');
        var toolbar=tabs.down("toolbar");
        var viewItems=record.get("views");
        var firstView=record.get("defaultView");
        if(viewItems==null) return;//目前虚机中有没有dashboard页面的节点，点击这样的节点时做了返回操作。
        toolbar.down("#labelTitle").setText(record.get("text"));
        
        var showingItem=null;
        
        //如果当前tab页适用于该节点，则继续显示该tab页
        if(tabs._activePageId){
        	var itemId=tabs._activePageId;
        	if(viewItems.indexOf(itemId)>=0){
        		showingItem=getPerformancePlugin(itemId);
        	}
        }
        //如果当前tab页不适用于该节点，则获取默认视图
        if(showingItem==null){
        	showingItem=getPerformancePlugin(firstView);
        }
        
    	Ext.each(performancePlugins,function(item){
    		//如果不存在则创建
    		if(!item.button){
    			item.button=Ext.create("Ext.Button", {
    	            text: item.title,
    	            allowDepress: false, 
    	            toggleGroup: 'modules',
    	            enableToggle: true,
    	            iconCls:item.iconCls,
    	            hidden:true,
    	            _pageConfig:item,
                    listeners: {
                        click: {
                            fn: menuButtonHandler
                        }
                    }
    	        });
    			item.currentMoId="-1";
    			item.visible=false;
    			toolbar.add(item.button);
    		}
    		//判断是否应该显示，并在tabs上显示或隐藏tab页
    		var shouldShow=false;
    		if(viewItems.indexOf(item.id)>=0){
    			shouldShow=true;
    			item.button.show();
    		}
    		else{
    			item.button.hide();
    		}

    		//加载
    		if(shouldShow){
    			if(showingItem==null){
    				showingItem=item;
    			}
    			item.newMoId=record.get("id");
    			//add by ted. filter caused by vmvare
    			if(item.newMoId.indexOf('@') > -1)
    			{
    				var segs = item.newMoId.split('@');
    				console.log("segs : "+segs);
    				item.newMoId = segs[1].toString();
    				console.log(item.newMoId);
    			}
    		}
    	});
    	
    	//设置active tab
//    	if(showingItem && showingItem.panel!=tabs.getActiveTab()){
//    		tabs.setActiveTab(showingItem.panel);
//    	}
    	if(showingItem){
    		tabs._activePageId=showingItem.id;
    		showingItem.button.toggle(true,false);
    		menuButtonHandler(showingItem.button,null,null);
    	}
    	//showPerformancePlugin(showingItem.id);

    },

    init: function(application) {
        this.control({
            "#performance-menuTree": {
                afterrender: this.onMenuTreeAfterRender,
                select: this.onMenuTreeSelect
            }
        });
    }

});