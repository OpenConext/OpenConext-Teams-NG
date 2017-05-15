ALTER TABLE teams ADD public_link varchar(255);
ALTER TABLE teams ADD UNIQUE INDEX public_link_index (public_link);