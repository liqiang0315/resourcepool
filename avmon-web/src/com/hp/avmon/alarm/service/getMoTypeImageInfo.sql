SELECT 
	RESOURCE_PICTURE AS RESOURCE_PICTURE,  
	RESOURCE_PICTURE_DIRECTION AS PICTURE_DIRECTION 
FROM TD_AVMON_MO_TYPE T1 
INNER JOIN TD_AVMON_MO_INFO T2 ON (T2.TYPE_ID = T1.TYPE_ID) 
INNER JOIN TF_AVMON_ALARM_DATA T3 ON (T3.MO_ID = T2.MO_ID) 
WHERE T3.alarm_id = '%s' 