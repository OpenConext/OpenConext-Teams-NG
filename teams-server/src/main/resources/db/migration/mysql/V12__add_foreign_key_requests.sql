ALTER TABLE requests
  ADD team_id MEDIUMINT;
ALTER TABLE requests
  ADD person_id MEDIUMINT;

UPDATE requests AS requests
SET requests.team_id = (SELECT teams.id
                        FROM teams
                        WHERE teams.urn = requests.group_id),
  requests.person_id = (SELECT persons.id
                        FROM persons
                        WHERE persons.urn = requests.uuid);


ALTER TABLE requests
  MODIFY COLUMN team_id MEDIUMINT NOT NULL;
ALTER TABLE requests
  ADD CONSTRAINT fk_requests_teams_id FOREIGN KEY (team_id) REFERENCES teams (id)
  ON DELETE CASCADE;
ALTER TABLE requests
  DROP COLUMN group_id;

ALTER TABLE requests
  MODIFY COLUMN person_id MEDIUMINT NOT NULL;
ALTER TABLE requests
  ADD CONSTRAINT fk_requests_person_id FOREIGN KEY (person_id) REFERENCES persons (id)
  ON DELETE CASCADE;
ALTER TABLE requests
  DROP COLUMN uuid;

ALTER TABLE requests DROP COLUMN email;
ALTER TABLE requests DROP COLUMN display_name;
ALTER TABLE requests DROP COLUMN `timestamp`;
ALTER TABLE requests ADD created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;