# Ekagra
## Utility app

Ekagra is a full-stack productivity utility app designed to help you focus, manage tasks, and boost your efficiency. It combines a Pomodoro timer, task management, analytics, and Spotify music integration in a beautiful, responsive, and PWA-ready interface.

---

## Features

- **Pomodoro Timer**: Start, pause, resume, and track Pomodoro sessions. Works for both logged-in users and guests.
- **Task Management**: Create, edit, delete, and update tasks. Tasks are stored in your account or locally for guests.
- **Analytics**: View total Pomodoro hours and completed tasks, with stats for both logged-in users and guests.
- **Spotify Integration**: Log in with Spotify, search for songs/playlists, and listen while you work (uses Spotify Web API and Web Playback SDK).
- **User Authentication**: Register, log in, and manage your preferences (Pomodoro durations, dark mode, etc).
- **Settings**: Update Pomodoro and UI preferences.
- **Responsive Design**: Works on desktop, tablet, and mobile.
- **PWA Support**: Installable and offline-ready.

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, MongoDB, JWT Auth
- **Spotify**: Web API & Web Playback SDK
- **State Management**: React Context API

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Spotify Developer Account (for integration)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ekagra.git
cd ekagra
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env # Edit .env with your MongoDB URI, JWT secret, etc.
npm install
npm run dev
```
- The backend runs on `http://localhost:5000` by default.

### 3. Frontend Setup
```bash
cd ../frontend
cp .env.local.example .env.local # Edit with your API URL and Spotify credentials
npm install
npm run dev
```
- The frontend runs on `http://localhost:3000` by default.

### 4. Spotify Integration
- Register your app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
- Add your Client ID, Client Secret, and Redirect URI to `frontend/.env.local`

```
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/spotify/callback
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Usage
- Register or log in to save your tasks and Pomodoro stats in the cloud.
- Use the app as a guest for local-only productivity (data stored in your browser).
- Start Pomodoro sessions, manage your tasks, and view analytics.
- Log in with Spotify to search and play music while you work.
- Update your preferences in the settings panel.

---

## Project Structure

```
ekagra/
├── backend/         # Express API, MongoDB models, routes, controllers
├── frontend/        # Next.js app, React components, contexts, pages
├── README.md        # This file
```

---

## Contributing

1. Fork the repo and create your branch (`git checkout -b feature/your-feature`)
2. Commit your changes (`git commit -am 'Add new feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request

---

## License

---

### furture work
- complete the user authentication 
- complete the spotify integration
- complete the settings for the app
- improve the ui ux
- add more features

## Credits
- Inspired by productivity techniques and modern web best practices.
