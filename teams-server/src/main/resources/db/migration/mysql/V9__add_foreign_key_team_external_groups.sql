ALTER TABLE team_external_groups
  ADD team_id MEDIUMINT;

UPDATE team_external_groups AS team_external_groups
SET team_external_groups.team_id = (SELECT teams.id
                                    FROM teams
                                    WHERE teams.urn = team_external_groups.grouper_team_id);
DELETE FROM team_external_groups WHERE team_id IS NULL;
ALTER TABLE team_external_groups
  MODIFY COLUMN team_id MEDIUMINT NOT NULL;
ALTER TABLE team_external_groups
  ADD CONSTRAINT fk_team_external_groups_teams_id FOREIGN KEY (team_id) REFERENCES teams (id);
ALTER TABLE team_external_groups
  DROP INDEX grouper_team_id;
ALTER TABLE team_external_groups
  DROP COLUMN grouper_team_id;
