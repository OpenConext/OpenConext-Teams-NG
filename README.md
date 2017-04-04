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

# Start the app

To run locally:

`mvn spring-boot:run -Drun.jvmArguments="-Dspring.profiles.active=dev"`

Or run / debug the [TeamsApplication](teams-server/src/main/java/teams/TeamsApplication.java).