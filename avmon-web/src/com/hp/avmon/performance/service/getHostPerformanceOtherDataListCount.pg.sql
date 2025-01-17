select 
count(*)
 from (select caption, mo_id 
           from td_avmon_mo_info where type_id like %s
          ) a
  inner join         
           (select attr.mo_id,attr.value from td_avmon_mo_info_attribute attr where 
           name='businessSystem' and attr.value not in (select businessname as "name" from tf_avmon_biz_dictionary) union all 
            ( select distinct mo_id, 'Other' from td_avmon_mo_info_attribute attr 
where attr.mo_id not in (select mo_id from td_avmon_mo_info_attribute attr 
where name='businessSystem'))) z on a.mo_id = z.mo_id
          ------------
  left join (select a.mo_id,count(*) as "count"  from tf_avmon_alarm_data a group by a.mo_id) tt 
  on a.mo_id =tt.mo_id 
    left join (select a.mo_id, a.instance, t.str_value 
               from tf_avmon_kpi_value_list a, tf_avmon_kpi_value_current t 
              where a.value_key = t.value_key 
                and a.kpi_code = '1001011005') b 
    on a.mo_id = b.mo_id 
    left join (select a.mo_id, a.instance, t.str_value 
               from tf_avmon_kpi_value_list a, tf_avmon_kpi_value_current t 
              where a.value_key = t.value_key 
                and a.kpi_code = '1001010001') c 
    on a.mo_id = c.mo_id 
    
        left join (select a.mo_id, a.instance, t.str_value 
               from tf_avmon_kpi_value_list a, tf_avmon_kpi_value_current t 
              where a.value_key = t.value_key 
                and a.kpi_code = '1001013003') d 
    on a.mo_id = d.mo_id 
          left join (select a.mo_id, a.instance,t.str_value 
               from tf_avmon_kpi_value_list a, tf_avmon_kpi_value_current t
              where a.value_key = t.value_key 
                and a.kpi_code = '1001005001') e 
    on a.mo_id = e.mo_id 
              left join (select a.mo_id, a.instance, t.str_value 
               from tf_avmon_kpi_value_list a, tf_avmon_kpi_value_current t 
              where a.value_key = t.value_key 
                and a.kpi_code = '1002001025')  f 
    on a.mo_id = f.mo_id 
     inner join (select  mo_id,protocal_method from td_avmon_mo_info ) g
          on  a.mo_id = g.mo_id
            left join (select a.mo_id, a.instance, tt.str_value 
               from tf_avmon_kpi_value_list a, tf_avmon_kpi_value_current tt 
              where a.value_key = tt.value_key 
                and a.kpi_code = '1001022001') h
    on a.mo_id = h.mo_id 
    %s
