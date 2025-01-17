package com.hp.xo.resourcepool.schedule.service.impl;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hp.xo.resourcepool.model.ProvisionAttribute;
import com.hp.xo.resourcepool.model.Response;
import com.hp.xo.resourcepool.model.WorkItem;
import com.hp.xo.resourcepool.model.WorkOrder;
import com.hp.xo.resourcepool.schedule.SASchedule;
import com.hp.xo.resourcepool.service.ProvisionAttributeManager;
import com.hp.xo.resourcepool.service.impl.GenericCloudServerManagerImpl;
@Service(value="saNewVolumeImpl")
public class SANewVolumeImpl extends AbstractSAManager {
	private final Logger log = LoggerFactory.getLogger(SASchedule.class);
	@Autowired
	private ProvisionAttributeManager provisionAttributeManager=null;	
	@Autowired
	private GenericCloudServerManagerImpl genericCloudServerManager;

	@Override
	public Map<String,String> getOrderTypeSpecificParams(){
		Map<String,String> woSpecificParams =new LinkedHashMap();
		woSpecificParams.put("commandName", "createVolume");
		woSpecificParams.put("responseHead", "createvolumeresponse");
		woSpecificParams.put("jobResultresponseHead", "volume");
		return woSpecificParams; 
	}
    public Map<String,Object[]> getProvisionAttributes(Map<String,Object[]> cloudStackParams, WorkOrder workOrder){    	
    	List<WorkItem> workItemList=workOrder.getWorkItems();
		Collections.sort(workItemList, new Comparator(){
			public int compare(Object o1, Object o2) {  
		        WorkItem s1=(WorkItem)o1;  
		        WorkItem s2=(WorkItem)o2;  
		        
		        if(s1.getStep()<s2.getStep()){  
		            return -1;  
		        }  
		        if(s1.getStep()>s2.getStep()){  
		            return 1;  
		        }  
		        return 0;  
		    }  
		});  
		//将工单的开通属性放入MAP中。
		for(WorkItem wi:workItemList){
			ProvisionAttribute pa=new ProvisionAttribute();
			pa.setWorkOrderType(workOrder.getWorkOrderType());
			List paList=provisionAttributeManager.findByExample(pa);
			Iterator iterPa=paList.iterator();
			while(iterPa.hasNext()){
				ProvisionAttribute pa1=(ProvisionAttribute)iterPa.next();
				if(pa1.getAttributeName().equalsIgnoreCase(ignoreFields)){
					continue;
				}
				if(pa1.getAttributeName().equalsIgnoreCase(wi.getAttributeName())){
					String attributeName=wi.getAttributeName();
					String attributeValue=wi.getAttributeValue();
					if(null!=attributeValue&&!"".equalsIgnoreCase(attributeValue.trim())){
						attributeName=attributeName.trim();
						attributeValue=attributeValue.trim();
						if("virtualmachineid".equalsIgnoreCase(attributeName)){
					         this.putZoneId(cloudStackParams, attributeValue);
						}else {
							cloudStackParams.put(attributeName, new Object[]{attributeValue});
						}
					}
					
				}
			}
			
         }
		if(cloudStackParams.containsKey("iscustomized") && cloudStackParams.get("iscustomized").length==1 && cloudStackParams.get("iscustomized")[0].toString().equals("1")){
			cloudStackParams.put("size",cloudStackParams.get("diskSize"));
		}
		
		if(cloudStackParams.containsKey("diskSize")){
			cloudStackParams.remove("diskSize");
		}
		if(cloudStackParams.containsKey("iscustomized")){
			cloudStackParams.remove("iscustomized");
		}
		//projectid = -1 表示是默认视图
		if(!cloudStackParams.containsKey("projectid") || "-1".equals(cloudStackParams.get("projectid")[0].toString())){
			cloudStackParams.put("domainId", new Object[]{workOrder.getDomainId()});
			cloudStackParams.put("account", new Object[]{workOrder.getAccount()});
		}		
		Map<String, Object[]> listUsersParams = new HashMap<String, Object[]>();
		listUsersParams.put("command", new Object[] { "listUsers" });
		listUsersParams.put("response", new Object[] { "json" });
		listUsersParams.put("account", new Object[] { workOrder.getAccount() });
		listUsersParams.put("domainid", new Object[] { workOrder.getDomainId()});

		Response listUsersResponse = genericCloudServerManager.get(listUsersParams, false);

		String apikey = "";
		String secretkey = "";
		if (StringUtils.isNotBlank(listUsersResponse.getResponseString())) {
			JSONObject jo = JSONObject.fromObject(listUsersResponse.getResponseString());
			jo = JSONObject.fromObject(jo.getString("listusersresponse"));
			JSONArray jos = jo.getJSONArray("user");
			jo = JSONObject.fromObject(jos.get(0));
			apikey = jo.getString("apikey");
			secretkey = jo.getString("secretkey");
		}
		cloudStackParams.put("apikey", new Object[] { apikey });
		cloudStackParams.put("secretkey", new Object[] { secretkey });
		cloudStackParams.put("response", new Object[] { "json" });
		return cloudStackParams;
	};
	public void putZoneId(Map<String, Object[]> cloudStackParams,String vmId){
		Object[] apikey=cloudStackParams.get("apikey");
		Object[] secretkey=cloudStackParams.get("secretkey");
		Object[] sessionkey=cloudStackParams.get("sessionkey");
		Object[] response=cloudStackParams.get("response");
		LinkedHashMap<String,Object[]>  newcloudStackParams=new  LinkedHashMap<String,Object[]>();
		newcloudStackParams.put("apikey", apikey);
		newcloudStackParams.put("secretkey",secretkey);
		newcloudStackParams.put("sessionkey", sessionkey);
		newcloudStackParams.put("response", response);		
		newcloudStackParams.put("command", new Object[]{"listVirtualMachines"});
		newcloudStackParams.put("id", new Object[]{vmId});
		
		Response listVirtualMachinesResponse = genericCloudServerManager.get(newcloudStackParams);
		JSONObject listVirtualMachinesResponseJSONObj = JSONObject.fromObject(listVirtualMachinesResponse.getResponseString());
		if(log.isDebugEnabled()){
			log.debug("apikey="+apikey[0]);
			log.debug("JSON="+listVirtualMachinesResponseJSONObj.toString());
		}
		String zoneid = ""; 
		if(listVirtualMachinesResponseJSONObj.containsKey("listvirtualmachinesresponse")){
			listVirtualMachinesResponseJSONObj = listVirtualMachinesResponseJSONObj.getJSONObject("listvirtualmachinesresponse");
			if(listVirtualMachinesResponseJSONObj.containsKey("count") && listVirtualMachinesResponseJSONObj.getInt("count")>0){
				zoneid = listVirtualMachinesResponseJSONObj.getJSONArray("virtualmachine").getJSONObject(0).getString("zoneid");
			}
		}
		cloudStackParams.put("zoneId", new Object[]{zoneid});		
	}
	public ProvisionAttributeManager getProvisionAttributeManager() {
		return provisionAttributeManager;
	}
	
	public void setProvisionAttributeManager(ProvisionAttributeManager provisionAttributeManager) {
		this.provisionAttributeManager = provisionAttributeManager;
	}
	public GenericCloudServerManagerImpl getGenericCloudServerManager() {
		return genericCloudServerManager;
	}
	public void setGenericCloudServerManager(GenericCloudServerManagerImpl genericCloudServerManager) {
	
		this.genericCloudServerManager = genericCloudServerManager;
	}
	
}
