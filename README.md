# github-imports

Proxy server for HTML Imports, fetching directly from GitHub.

Supports multiple configurations (a set of versions).

Configured to work with Docker, uses Redis and nginx.

## Setup

- Install `docker` and `docker-compose`
- Copy `build/imports/.env.example` to `build/imports/.env` and set github token

## Run it

`$ docker-compose up`

By default it runs on localhost, port 80.

## GitHub user/organization config

Currently it's hardcoded in `build/imports/app/org.js`, but it would make sense to create an API and store this data in Redis (possibly on per-configuration basis)

## API

| Route                           | Description                         | Notes                                                       |
| ------------------------------- | ----------------------------------- | ----------------------------------------------------------- |
| GET /:configId/:repo/:filePath  | Get a file from GitHub repo         | Will fetch latest version and lock the configuration to it  |
| GET /:configId                  | List versions used by configuration | Response e.g. `{"firmfirm/f-singleton":"v0.2.1"}`           |
| PUT /:configId                  | Set versions for a configuration    | Body e.g. `{"firmfirm/f-singleton":"v0.2.1"}`               |
| GET /cache/clear                | Clear all cached files              |                                                             |
