# DATABASE

## How to get inside db-bmusic container

### inside portainer

- psql -U postgres -d db-bmusic

### inside docker container using cli

- docker exec -it db-bmusic psql -U postgres -d db-bmusic
