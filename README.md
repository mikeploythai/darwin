# Darwin

Darwin is a Discord bot for self-improvement accountability. It is used in my friend group's Discord server in a channel dedicated towards encouraging each other to be 1% better everyday. Darwin sends weekly reminders for us to send progress updates to each other, ~~helps us set goals and celebrate small wins~~, and ~~replies to people with helpful advice in a warm, friendly tone!~~

## Tech

* [Next.js 15 Route Handlers](https://nextjs.org/docs/app/guides/backend-for-frontend)
* [@discordjs/rest](https://discord.js.org/docs/packages/rest/main)
* [AI SDK](https://ai-sdk.dev/) + OpenRouter ([Llama 3.3 8B Instruct](https://openrouter.ai/meta-llama/llama-3.3-8b-instruct:free))
* [QStash Schedules](https://upstash.com/docs/qstash/features/schedules)
* [Vercel](https://vercel.com/)

## To do

- [ ] Replies
- [ ] Thread management
- [ ] Text streaming???

## FAQ

<details>

<summary>Why Next.js route handlers?</summary>

its easy

</details>

<details>

<summary>Why @discordjs/rest over the normal discord.js package?</summary>

it kept throwing an error related to one of its dependencies called zlib-sync. apparently webpack (and i guess turbopack) [tries to load discord.js as client-side code](https://www.armannotes.com/posts/zlib-error-nextjs-server-actions) but i dunno

as long as i have a type-safe way to interact with the discord api, then idc lol

</details>

<details>

<summary>Why use Upstash instead of Vercel's cron jobs?</summary>

during testing, i learned that vercel only allows 1 cron invocation a day in the free plan. that's totally fine, but during dev i wanted to test if my code was actually reliable, so i switched to upstash and their very, *very* generous free tier

i am now too lazy to change it back

</details>

<details>

<summary>Why use a Llama model?</summary>

free

</details>