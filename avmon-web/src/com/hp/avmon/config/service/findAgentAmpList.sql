select
ag.AMP_ID as "ampId",
ag.agent_id as "agentId",
ag.amp_inst_id as "ampInstId",
ag.amp_version as "ampVersion",
ag.caption as "caption",
ag.enable_flag as "enableFlg",
ag.last_active_time as "lastActiveTime",
ag.schedule as "schedule",
ag.status as "status",
upper(amp.type) as "ampType",
to_char(ag.last_amp_update_time,'yyyy-MM-dd HH24:mi:ss') as "lastAmpUpdateTime",
to_char(ag.last_schedule_update_time,'yyyy-MM-dd HH24:mi:ss') as "lastScheduleUpdateTime",
to_char(ag.last_config_update_time,'yyyy-MM-dd HH24:mi:ss') as "lastConfigUpdateTime"
from TD_AVMON_AMP_INST ag
left join TD_AVMON_AMP amp
on ag.amp_id=amp.amp_id