-- Fictional portfolio dataset only. Production demo catalogue is checked before writing.
-- Additive and repeatable: existing cost records and populated usage months stay intact.
BEGIN;
DO $$ BEGIN
  IF (SELECT count(*) FROM tools WHERE name IN ('TeamChat','CodeForge','ArchiveBox','CampaignFlow','OldMetrics','Figma','GitHub','Notion','ChatGPT','Codex')) <> 10
    OR (SELECT count(*) FROM users WHERE id LIKE 'portfolio-demo-user-%') <> 18
  THEN RAISE EXCEPTION 'Unexpected production demo dataset'; END IF;
END $$;

-- Previous twelve months, aligned to the first of the current UTC month.
WITH months AS (
  SELECT (date_trunc('month', current_timestamp AT TIME ZONE 'UTC') - interval '23 months' + n * interval '1 month')::date AS month, n
  FROM generate_series(0,11) AS n
), scenario AS (
  SELECT t.id, m.month,
    CASE t.name
      WHEN 'TeamChat' THEN 25 + floor(m.n / 4.0) * 5
      WHEN 'CodeForge' THEN 15 + floor(m.n / 4.0) * 5
      WHEN 'OldMetrics' THEN 15 + floor(m.n / 6.0) * 5
      WHEN 'GitHub' THEN CASE WHEN m.n >= 6 THEN 10 ELSE 0 END
      ELSE 0
    END AS cost
  FROM tools t CROSS JOIN months m
  WHERE t.name IN ('TeamChat','CodeForge','ArchiveBox','CampaignFlow','OldMetrics','Figma','GitHub','Notion','ChatGPT','Codex')
)
INSERT INTO cost_tracking(id,tool_id,month,cost,user_count,cost_per_user,created_at,updated_at)
SELECT 'portfolio-demo-history-v3-' || to_char(month,'YYYY-MM') || '-' || id, id,month,cost,0,0,now(),now() FROM scenario
ON CONFLICT(tool_id,month) DO NOTHING;

-- Fill only complete months with no usage for the tool. A zero-priced month
-- represents pre-adoption. Current catalogue state is not rewritten.
WITH eligible AS (
 SELECT c.tool_id,c.month,c.cost,t.name,t.owner_department_id,
   row_number() OVER (PARTITION BY c.tool_id ORDER BY c.month) AS adoption_month
 FROM cost_tracking c JOIN tools t ON t.id=c.tool_id
 WHERE c.month >= (date_trunc('month',current_timestamp AT TIME ZONE 'UTC') - interval '23 months')::date
   AND c.month < date_trunc('month',current_timestamp AT TIME ZONE 'UTC')::date
   AND c.cost > 0
   AND t.name IN ('TeamChat','CodeForge','ArchiveBox','CampaignFlow','OldMetrics','Figma','GitHub','Notion','ChatGPT','Codex')
   AND NOT EXISTS (SELECT 1 FROM usage_logs l WHERE l."toolId"=c.tool_id AND l."usageDate">=c.month AND l."usageDate"<c.month+interval '1 month')
   AND NOT (t.name='ArchiveBox' AND c.month >= date '2026-08-01')
   AND NOT (t.name='OldMetrics' AND c.month >= date '2026-09-01')
), participants AS (
 SELECT e.*,u.id AS user_id,row_number() OVER(PARTITION BY e.tool_id,e.month ORDER BY u.id) AS rank
 FROM eligible e JOIN users u ON u.department_id=e.owner_department_id AND u.id LIKE 'portfolio-demo-user-%'
)
INSERT INTO usage_logs(id,"userId","toolId","usageDate","sessionCount","totalMinutes")
SELECT 'portfolio-demo-usage-v3-' || md5(user_id || tool_id || month::text || day::text),
 user_id,tool_id, month + day * interval '1 day' + interval '10 hours',
 1 + ((rank + day)::int % 4), (1 + ((rank + day)::int % 4)) * 20
FROM participants CROSS JOIN (VALUES (3),(10),(17),(24)) AS days(day)
WHERE rank <= least(4,1+floor(adoption_month/5.0))
ON CONFLICT DO NOTHING;

-- Enrich only the cost rows inserted by this version.
UPDATE cost_tracking c SET user_count=s.users,
 cost_per_user=CASE WHEN s.users>0 THEN round(c.cost/s.users,2) ELSE 0 END
FROM (
 SELECT c.id,count(DISTINCT l."userId")::int AS users
 FROM cost_tracking c LEFT JOIN usage_logs l ON l."toolId"=c.tool_id
 AND l."usageDate">=c.month AND l."usageDate"<c.month+interval '1 month' AND l."sessionCount">0
 WHERE c.id LIKE 'portfolio-demo-history-v3-%' GROUP BY c.id
) s WHERE c.id=s.id;
COMMIT;
SELECT count(*) AS cost_records,count(DISTINCT month) AS months,min(month),max(month) FROM cost_tracking;
SELECT date_trunc('month',"usageDate")::date AS month,count(*) AS usage_records,count(DISTINCT "userId") AS unique_users FROM usage_logs GROUP BY 1 ORDER BY 1;
