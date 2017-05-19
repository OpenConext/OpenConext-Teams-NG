ALTER TABLE invitations
  ADD team_id MEDIUMINT;

UPDATE invitations AS invitations
SET invitations.team_id = (SELECT teams.id
                           FROM teams
                           WHERE teams.urn = invitations.group_id);
ALTER TABLE invitations
  MODIFY COLUMN team_id MEDIUMINT NOT NULL;
ALTER TABLE invitations
  ADD CONSTRAINT fk_invitation_teams_id FOREIGN KEY (team_id) REFERENCES teams (id)
  ON DELETE CASCADE;
ALTER TABLE invitations
  DROP COLUMN group_id;

ALTER TABLE invitations
  ADD INDEX invitation_uiid_index (invitation_uiid);

ALTER TABLE invitation_message
  ADD person_id MEDIUMINT;

UPDATE invitation_message im INNER JOIN persons p
    ON p.name = im.inviter
SET im.inviter = p.urn;

UPDATE invitation_message AS invitation_message
SET invitation_message.person_id = (SELECT persons.id
                                    FROM persons
                                    WHERE persons.urn = invitation_message.inviter);

DELETE FROM invitation_message
WHERE person_id IS NULL;

ALTER TABLE invitation_message
  MODIFY COLUMN person_id MEDIUMINT NOT NULL;
ALTER TABLE invitation_message
  ADD CONSTRAINT fk_invitation_message_person_id FOREIGN KEY (person_id) REFERENCES persons (id)
  ON DELETE CASCADE;
ALTER TABLE invitation_message
  DROP COLUMN inviter;

DELETE im FROM invitation_message im WHERE NOT EXISTS (SELECT NULL FROM invitations i WHERE i.id = im.invitation_id);
ALTER TABLE invitation_message
  ADD CONSTRAINT fk_invitation_message_invitation_id FOREIGN KEY (invitation_id) REFERENCES invitations (id)
  ON DELETE CASCADE;

