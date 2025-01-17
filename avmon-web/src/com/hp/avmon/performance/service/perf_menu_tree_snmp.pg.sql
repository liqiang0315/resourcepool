select 'SNMP'||type_id as "id",
    caption as "text",
    parent_id as "pid",
    type_views as "views",
    type_default_view as "defaultView",
    icon_cls as "iconCls",
    icon_cls_pause as "iconClsPause",
    icon_cls_error as "iconClsError",
    resource_picture as "resourcePicture",
    resource_picture_direction as "resourcePictureDirection",
    0 as "isInstance",
    'false' as "leaf",
    'false' as "expanded"
 from td_avmon_snmp_type where parent_id='%s' and display_flag=1
 
 union all
 
 select a.mo_id,
    a.caption ,
    a.type_id,
    b.instance_views,
    b.instance_default_view,
    b.icon_cls,
    b.icon_cls_pause,
    b.icon_cls_error,
    b.resource_picture,
    b.resource_picture_direction,
    1,
    'true',
    'false'
    
  from td_avmon_snmp_info a,td_avmon_snmp_type b 
  where a.type_id=b.type_id and a.type_id='%s' 
 
 order by 2
 