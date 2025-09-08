# Darwin

Darwin is a Next.js backend application that lets Darwin send weekly reminders for us to send progress updates to each other (triggered by QStash cron job) and reply back to people who reply to their messages (triggered by [Gumball](https://github.com/mikeploythai/darwin/tree/main/apps/gumball)).

## Tech

* [Next.js 15 Route Handlers](https://nextjs.org/docs/app/guides/backend-for-frontend)
* [@discordjs/rest](https://discord.js.org/docs/packages/rest/main)
* [AI SDK](https://ai-sdk.dev) + OpenRouter ([Llama 3.3 8B Instruct](https://openrouter.ai/meta-llama/llama-3.3-8b-instruct:free))
* [QStash Schedules](https://upstash.com/docs/qstash/features/schedules)
* [Upstash Redis](https://upstash.com/docs/redis)
* [Vercel](https://vercel.com)