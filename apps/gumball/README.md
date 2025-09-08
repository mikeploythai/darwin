# Gumball

Gumball is a web service used by Darwin. It is a long-running Node.js application that monitors for replies to Darwin's messages via the [Discord Gateway](https://discord.com/developers/docs/events/gateway), and tells Darwin to reply back to them.

## Tech

* [Node.js](https://nodejs.org)
* [@discordjs/ws](https://discord.js.org/docs/packages/ws/main)
* [Upstash Redis](https://upstash.com/docs/redis)
* [Docker Compose](https://docs.docker.com/compose)

## Deployment

### Using pre-built image

Docker Images are automatically built and pushed when code is merged to `feat/docker` or when releases are created.

1. **Set up environment variables**:
   - In `darwin/apps/gumball`, copy `.env.example` to `.env.local` 
   - Fill in the missing secrets in `.env.local`
   - The `.env.local` file is already ignored by Git. DO NOT COMMIT IT.

2. **Run with Docker Compose**:
   ```sh
   # In the darwin/ directory
   docker compose -f docker-compose.prod.yml up -d
   docker compose -f docker-compose.prod.yml logs -f gumball
   ```

3. **Update to latest version**:
   ```sh
   docker compose -f docker-compose.prod.yml pull gumball
   docker compose -f docker-compose.prod.yml up -d gumball
   ```

### Building from source

```sh
# In the darwin/ root directory  
docker compose up -d
docker compose logs -f gumball
```

## To Do

- [ ] Add message limiting per user per week (gotta prevent parasocialism lol)
- [x] Create Docker file for deployment