import ProfilePage from "./(dashboard)/profile/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-center">
      <h1 className="font-system text-display-md mb-4 text-primary animate-pulse-glow">
        SHADOW_HUD
      </h1>
      <p className="font-functional text-title-md text-on-surface-variant mb-8">
        System Initializing...
      </p>
      <a
        href="/auth/login"
        className="bg-primary text-primary-dark px-8 py-3 font-system text-label-md uppercase tracking-wider hover:shadow-bloom transition-all duration-200"
      >
        Authenticate Session
      </a>
      <ProfilePage />
    </main>
  )
}