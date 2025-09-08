# Gumball

Gumball is a web service used by Darwin. It is a long-running Node.js application that monitors for replies to Darwin's messages via the [Discord Gateway](https://discord.com/developers/docs/events/gateway), and tells Darwin to reply back to them.

## Tech

* [Node.js](https://nodejs.org)
* [@discordjs/ws](https://discord.js.org/docs/packages/ws/main)
* [Upstash Redis](https://upstash.com/docs/redis)
* [Docker Compose](https://docs.docker.com/compose)

## To Do

- [ ] Add message limiting per user per week (gotta prevent parasocialism lol)
- [ ] Create Docker file for deployment