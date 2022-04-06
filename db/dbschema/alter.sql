ALTER TABLE dnw_details ADD COLUMN from_detail_id int NULL;
ALTER TABLE dnw_details ADD COLUMN to_account_id int NULL;
--//2022-04-06 real 아직 추가 안함...
ALTER TABLE dnw_details ADD COLUMN std_account_amount DECIMAL(18,2) NULL;
ALTER TABLE dnw_details ADD COLUMN latest_account_amount DECIMAL(18,2) NULL;

