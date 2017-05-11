ALTER TABLE external_groups DROP INDEX external_groups_identifier_index;
ALTER TABLE external_groups ADD UNIQUE INDEX external_groups_identifier_index (identifier);
