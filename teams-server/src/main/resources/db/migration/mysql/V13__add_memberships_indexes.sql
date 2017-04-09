ALTER TABLE memberships
  ADD INDEX memberships_urn_team_index (urn_team);
ALTER TABLE memberships
  ADD INDEX memberships_urn_person_index (urn_person);
