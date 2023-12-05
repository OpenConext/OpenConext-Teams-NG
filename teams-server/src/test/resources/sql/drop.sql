--
-- SELECT concat('DROP TABLE IF EXISTS ', table_name, ';') FROM information_schema.tables WHERE table_schema = 'teams';
--
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS invitations;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS persons;
DROP TABLE IF EXISTS schema_version;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS teams_applications;
