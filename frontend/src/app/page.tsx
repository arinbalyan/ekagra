"use client";
import TaskList from '@/components/tasks/TaskList';
import Timer from '@/components/timer/Timer';
import { useState, useEffect } from 'react';
import Image from 'next/image';

function AnalyticsSidebar() {
  return (
    <aside className="gradient-card shadow rounded-lg flex flex-col justify-between h-full p-4 min-w-[180px]">
      <div>
        <h2 className="text-xl font-bold mb-6 gradient-primary">Analytics</h2>
        {/* Add analytics charts/stats here */}
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <button className="text-left gradient-secondary hover:underline">Login</button>
        <button className="text-left gradient-secondary hover:underline">Settings</button>
      </div>
    </aside>
  );
}

function ClockInfo() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  if (!now) {
    return <div className="text-gray-500">Loading time...</div>;
  }
  return (
    <div className="gradient-card shadow rounded-lg p-6 flex flex-col items-center justify-center h-full min-h-[160px]">
      <div className="text-3xl font-bold mb-2 gradient-primary">{now.toLocaleTimeString()}</div>
      <div className="text-lg mb-1">{now.toLocaleDateString()}</div>
      <div className="text-sm text-gray-500">Location: <span className="font-medium">Your City</span></div>
      <div className="text-sm text-gray-500">Time Zone: <span className="font-medium">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span></div>
    </div>
  );
}

function SpotifyIntegration() {
  // Placeholder for Spotify login, search, and player
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="gradient-card shadow rounded-lg p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 gradient-primary">Spotify integration</h2>
      {!isLoggedIn ? (
        <button
          className="px-4 py-2 gradient-button rounded"
          onClick={() => {
            // TODO: Implement Spotify OAuth login
            setIsLoggedIn(true);
          }}
        >
          Login with Spotify
        </button>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          {/* TODO: Implement search and player using Spotify Web API and Web Playback SDK */}
          <input
            type="text"
            placeholder="Search for songs or playlists..."
            className="w-full px-3 py-2 rounded border border-gray-700 bg-[#121212] text-white"
          />
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <span>Spotify player will appear here</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black flex flex-row gap-4 p-4">
      {/* Sidebar */}
      <div className="w-[200px] flex-shrink-0 flex flex-col">
        <AnalyticsSidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 min-h-[600px]">
        {/* Task List */}
        <div className="row-span-2">
          <TaskList />
        </div>
        {/* Clock/Date/Location/Timezone */}
        <div>
          <ClockInfo />
        </div>
        {/* Pomodoro Clock */}
        <div>
          <Timer />
        </div>
      </div>
      {/* Spotify Integration */}
      <div className="w-[320px] flex-shrink-0 flex flex-col">
        <SpotifyIntegration />
      </div>
    </div>
  );
}
