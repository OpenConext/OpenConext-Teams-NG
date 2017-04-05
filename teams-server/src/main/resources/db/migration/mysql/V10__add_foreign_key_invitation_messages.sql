ALTER TABLE invitations
  ADD team_id MEDIUMINT;

UPDATE invitations AS invitations
SET invitations.team_id = (SELECT teams.id
                           FROM teams
                           WHERE teams.urn = invitations.group_id);
ALTER TABLE invitations
  MODIFY COLUMN team_id MEDIUMINT NOT NULL;
ALTER TABLE invitations
  ADD CONSTRAINT fk_teams_id FOREIGN KEY (team_id) REFERENCES teams (id)
  ON DELETE CASCADE;
ALTER TABLE invitations
  DROP COLUMN group_id;
