# OpenConext-Teams-NG

[![Build Status](https://travis-ci.org/OpenConext/OpenConext-Teams-NG.svg?branch=master)](https://travis-ci.org/OpenConext/OpenConext-Teams-NG)
[![codecov.io](https://codecov.io/github/OpenConext/OpenConext-Teams-NG/coverage.svg)](https://codecov.io/github/OpenConext/OpenConext-Teams-NG)

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

    yarn install --save-dev ${dep}

To build:

    ./build.sh

To run locally:

    yarn run webpack-dev-server

Browse to the [application homepage](http://localhost:8001/).

