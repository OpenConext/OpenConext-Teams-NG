# OpenConext-Teams-NG
[![Build Status](https://github.com/OpenConext/OpenConext-Teams-NG/actions/workflows/maven.yml/badge.svg)](https://github.com/OpenConext/OpenConext-Teams-NG/actions/workflows/maven.yml/badge.svg)
[![codecov.io](https://codecov.io/github/OpenConext/OpenConext-Teams-NG/coverage.svg)](https://codecov.io/github/OpenConext/OpenConext-Teams-NG)

## License

See the LICENSE file

## Disclaimer

See the NOTICE file

## System Requirements

- Java 21
- Maven 3
- MySQL 8
- node v14.17.3 (use for example `nvm use` to manage it - latest version of node does not work) 
- yarn (note that later versions break the sass compiler)

If you use nvm ensure you have the correct npm installed locally in that version

```
cd ~/.nvm/versions/node/v6.2.2/lib/
npm install npm@5.2.0
```

See https://stackoverflow.com/questions/9755841/how-can-i-change-the-version-of-npm-using-nvm

## Building and running

[Maven 3](http://maven.apache.org) is needed to build and run this project.

To build, first setup your local db:

Connect to your local mysql database: `mysql -uroot`

Execute the following:

```sql
DROP DATABASE IF EXISTS teams_ng;
CREATE DATABASE teams_ng CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

### The teams-server

To run locally:

`mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=dev,test"`

Or run / debug the [TeamsApplication](teams-server/src/main/java/teams/TeamsApplication.java) and don't forget to set 
the active profile to dev otherwise the application uses the real VOOT client on the test environment.



### The teams-gui

    cd teams-gui

Initial setup if you do:

    yarn install

Add new dependencies to `devDependencies`:

    yarn add ${dep} --dev

To build:

    ./build.sh

To run locally:

    yarn local

Browse to the [application homepage](http://localhost:8001/).

## Testing

To run the tests, just install both server and client:

    mvn clean install
    
To run only the JS tests:
    
    cd teams-gui
    yarn test
    
## Miscellaneous

If you add dependencies to the teams-gui with yarn you can see the impact on the production bundle:

    cd teams-gui
    rm -fr dist && yarn webpack-analyze | sed '1,6d' | sed '$d' | webpack-bundle-size-analyzer
    
## API
    
The teams application has three API's:
    
1. Internal Teams API on `api/teams` for the teams GUI
2. VOOT API on `api/voot` for the VOOT server app
3. LifeCycle user management  
  
The first one is secured with shibboleth and CSRF and the second and third one are secured with basic auth. For an example call:
  
    curl  -u voot:secret https://teams.demo.openconext.org/api/voot/user/urn:collab:person:example.com:admin/groups  
    
## LifeCycle Deprovisioning

Teams has a LifeCycle API to deprovision users. The preview endpoint:
```
curl -u life:secret http://localhost:8080/deprovision/urn:collab:person:surfnet.nl:jdoe | jq 
```
And the actual `Deprovisioning` of the user:
```
curl -X DELETE -u life:secret http://localhost:8080/deprovision/urn:collab:person:surfnet.nl:jdoe | jq
```
## Migration to Invite

Migration from Teams to Invite can be done on a per-team basis. A migrated team will keep all its members and will keep the same URN.
The `voot` API supports both Teams and Invite, so whether or not a team lives in Teams or Invite, the same URN will be returned for a user so the migration can be done one by one. Because PDP uses this API, PDP rules also do not need to change for a migration to succeeed and consuming SP's that receive the URN will also not see a difference. The only thing that is impacted by migration is the interface in which the members can be managed.

The only thing that is not carried over in the invite is pending / not yet accepted invitations to become a member of a Team (since the already sent emails will have an obsolete link). You need to re-invite the users from Invite that did not yet accept their invitation from Teams.

If you are planning migration to Invite, at any point in time you can enable the Teams feature flag to disable the creation of new teams in Teams by users.

### Migration steps

The migration is in some parts a bit bare-bones. It consists of the folling steps. They are described in more detail below.

1. Enrichment of the data in the Teams database. Teams do not contain much metadata while Invite needs more, most notably application(s) associated with the Invite role.
1. Migrate the actual team to Invite. After successful transfer is then immediately deleted from Teams as not to create duplications.
1. Enrichment of the data on the Invite side.

### Enrich Teams database

The Teams database requires modifications to prepare a team before it can be transferred.

1. Set the correct schacHomeOrganization for each user in the database. This can be done at once (and idempotently repeated) with this query:
```sql
UPDATE persons SET schac_home_organization = SUBSTRING_INDEX(SUBSTRING_INDEX(urn,':',4),':',-1) WHERE schac_home_organization IS NULL;
```
2. Add (the/one) (Manage) application / service provider that this team is used for, as Invite requires such an association. This also needs to be done in the database and may be customized depending on where you get the knowledge from what a team is for. E.g. is it used in the PDP to limit access, you can look up the application this team limits access to. If it's used as information released via AA / ARP for an SP, etc. Optionally you can also define a landing page.

An example commandline script that can set this information for a specific SP is: [teams_set_app](teams_set_app).
But you may choose to automate this differently.

### Migrate an actual team

The Teams GUI has functionality to migrate a team to the invite-database. You need to be super-user for this. Search a team and in the menu, press Migrate. The screen will show if the required metadata is present and list which members will be transferred. If you confirm, the team is then present in Invite and dropped from Teams.

There is also an API endpoint to migrate teams to do this in bulk:
```
curl -u teams:secret -X PUT -H 'Content-Type: application/json' -d '{"id":"35415"}'  "http://localhost:8080/api/v1/external/invite-app/migrate"
```

### Post-migration steps

After migration, the team will show in the Invite application, now called a role.

You do need to set the organization GUID for a role by editing it or doing this in the database.

For PDP, nothing needs to change since the voot API will still return the same URL. If you transfer the team URN in an attribute to SP's, you can (at any point after migration) in Manage upgrade the used source from `voot` to `invite` and remove any value filter. The `invite` AA source has knowledge of the SP that is authenticated to and will return only roles that are associated with this SP. Therefore the `invite` AA is a simpler variant to `voot` AA, but otherwise functionally identical.
