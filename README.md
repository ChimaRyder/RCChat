# RC Chat: An Omegle-inspired Chat Platform

RC Chat is a chat platform with a twist. Instead of finding new friends to chat on your own, we finds them for you! Chat with your new pals in a new, unexpected fashion.

This project is web-based port of the original RC Chat. Both projects are inspired from Omegle Chat, where users get to chat with random strangers.

Deciding to modernize the idea, RC Chat blends the randomized chats with the modern UIs of Discord and Messenger.
## Authors

- [@ChimaRyder](https://www.github.com/ChimaRyder)


## Tech Stack

**Client:** ![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white&style=for-the-badge) ![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white&style=for-the-badge) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff&style=for-the-badge)

**Server:** ![Clerk](https://img.shields.io/badge/Clerk-6c47ff?logo=clerk&logoColor=fff&style=for-the-badge) ![Ably](https://img.shields.io/badge/Ably-ED760A?style=for-the-badge&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

## Features

- Create an account
- Find a New Chat via "New Chat"
- Realtime chats and new chat notifications
- View recent chat histories
- Customizable profiles
- Light/Dark mode


## Run Locally

Clone the project

```bash
  git clone https://github.com/ChimaRyder/RCChat
```

Go to the project directory

```bash
  cd RCChat
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

`CLERK_SECRET_KEY`

`ABLY_SECRET_KEY`

`MONGODB_URI`

