UPDATE teams SET public_link_disabled = 1;
ALTER TABLE teams MODIFY COLUMN public_link_disabled tinyint(1) NOT NULL DEFAULT '1';
