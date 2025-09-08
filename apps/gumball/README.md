# Gumball

Gumball is a web service used by Darwin. It is a long-running Node.js application that monitors for replies to Darwin's messages via the [Discord Gateway](https://discord.com/developers/docs/events/gateway), and tells Darwin to reply back to them.

## Tech

* [Node.js](https://nodejs.org)
* [@discordjs/ws](https://discord.js.org/docs/packages/ws/main)
* [Upstash Redis](https://upstash.com/docs/redis)
* [Docker Compose](https://docs.docker.com/compose)

## Deployment

1. In `darwin/apps/gumball`, rename `.env.example` to `.env.local` and enter the missing secrets.

2. In `darwin/`, run the following Docker Compose scripts to deploy the service.

  ```sh
  docker compose up -d
  docker compose logs -f gumball
  ```

## To Do

- [ ] Add message limiting per user per week (gotta prevent parasocialism lol)
- [x] Create Docker file for deployment