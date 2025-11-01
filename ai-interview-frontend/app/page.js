import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex flex-col justify-center items-center px-6">
      {/* Hero Section */}
      <section className="text-center max-w-2xl">
        <div className="animate-fadeIn">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm">
            Ace Your Next Interview 🚀
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Practice with our <span className="font-semibold text-indigo-600">AI-powered interviewer</span> 
            — get instant, smart feedback to improve your confidence and land your dream job.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Illustration / Accent */}
      <div className="mt-16 w-full max-w-lg">
     
      </div>
    </main>
  );
}
