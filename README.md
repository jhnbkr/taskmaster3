# Task Master 3

**Task Master 3** is an accessible TODO application with user authentication and realtime data synchronisation.

### Demo

[https://taskmaster3.app](https://taskmaster3.app), hosted on [Vercel](https://vercel.com/docs).

---

## Stack

-   [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag)
-   [Next.js](https://nextjs.org/docs)
-   [TypeScript](https://www.typescriptlang.org/docs)
-   [Tailwind CSS](https://tailwindcss.com/docs)
-   [Firebase | Authentication](https://firebase.google.com/docs/auth)
-   [Firebase | Cloud Firestore](https://firebase.google.com/docs/firestore)

---

## Setup

Install dependencies

```bash
npm install
# or
yarn install
```

Configure environment, see [Configuration](#configuration).

```bash
touch .env.local
```

Run development process

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

---

## Configuration

| Name                                     | Type   | Required |
| ---------------------------------------- | ------ | :------: |
| NEXT_PUBLIC_FIREBASE_API_KEY             | string |    ✅    |
| NEXT_PUBLIC_FIREBASE_APP_ID              | string |    ✅    |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         | string |    ✅    |
| NEXT_PUBLIC_FIREBASE_DATABASE_URL        | string |    ✅    |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID          | string |    ✅    |
| NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID      | string |    ❌    |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | string |    ❌    |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      | string |    ❌    |

---

## TODO

-   [ ] Dark theme
    -   [ ] default system preference
    -   [ ] persistent user preference
-   [ ] UX
    -   [ ] orderable lists
    -   [ ] orderable tasks
    -   [ ] task transfer between lists

---

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
