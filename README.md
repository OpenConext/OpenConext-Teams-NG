# OpenConext-Teams-NG

[![Build Status](https://travis-ci.org/OpenConext/OpenConext-Teams-NG.svg?branch=master)](https://travis-ci.org/OpenConext/OpenConext-Teams-NG)
[![codecov.io](https://codecov.io/github/OpenConext/OpenConext-Teams-NG/coverage.svg)](https://codecov.io/github/OpenConext/OpenConext-Teams-NG)
[![Sonar](https://sonarqube.com/api/badges/gate?key=openconext%3Ateams-ng)](https://sonarqube.com/dashboard/index/openconext:teams-ng)

## License

See the LICENSE file

## Disclaimer

See the NOTICE file

## System Requirements

- Java 8
- Maven 3
- MySQL
- yarn

## Building and running

[Maven 3](http://maven.apache.org) is needed to build and run this project.

To build, first setup your local db:

Connect to your local mysql database: `mysql -uroot`

Execute the following:

```sql
CREATE DATABASE teams_ng DEFAULT CHARACTER SET utf8;
```

### The teams-server

To run locally:

`mvn spring-boot:run -Drun.jvmArguments="-Dspring.profiles.active=dev,test"`

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
    
The teams application has two API:
    
1. Internal Teams API on `api/teams` for the teams GUI
2. VOOT API on `api/voot` for the VOOT server app  
  
The first one is secured with shibboleth and CSRF and the second one is secured with basic auth. For an example call:
  
    curl  -u voot:secret https://teams.test2.surfconext.nl/api/voot/user/urn:collab:person:example.com:admin/groups  
    