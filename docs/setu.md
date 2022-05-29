# Project Setup

## Assumptions

- Node v16.14.0
- psql (PostgreSQL) 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)
- Ubuntu 20.04.4 LTS

## Postgres setup

- check if psql started - `sudo service postgresql status`
  - if not stated use - `sudo service postgresql start`
- Go into postgres shell - `psql postgres`
- create user with CREATEDB role - `create role app_provider_dev with createdb login password 'app_provider_dev';`
- see the list of users - `\du`
- go to the terminal - `\q`
- add user with same name as the psql user you created - `sudo adduser app_provider_dev`
- log in to psql with app_provider_dev - `sudo psql -d app_provider -U app_provider_dev`
