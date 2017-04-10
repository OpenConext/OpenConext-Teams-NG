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

`mvn spring-boot:run -Drun.jvmArguments="-Dspring.profiles.active=dev"`

Or run / debug the [TeamsApplication](teams-server/src/main/java/teams/TeamsApplication.java) and don't forget to set 
the active profile to dev otherwise the application uses the real VOOT client on the test environment.



### The pdp-gui

    cd pdp-gui

Initial setup if you do:

    nvm install
    npm install

Add new dependencies to `devDependencies`:

    npm install --save-dev ${dep}

To build:

    npm run webpack

To run locally:

    npm run webpack-dev-server

Browse to the [application homepage](http://localhost:8001/).

