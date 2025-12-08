import { Navbar } from "./Navbar";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <Navbar />

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        <div className="text-center">
          <h2 className="mb-4 font-bold text-gray-900 text-5xl">
            Welcome to NESK Help Desk
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-gray-600 text-xl">
            A modern, full-featured ticketing system built with Next.js 16,
            Prisma, and Better-Auth
          </p>

          <div className="gap-8 grid md:grid-cols-3 mt-16">
            <div className="bg-white shadow-md p-8 rounded-lg">
              <div className="mb-4 text-4xl">🎫</div>
              <h3 className="mb-2 font-semibold text-xl">Submit Tickets</h3>
              <p className="text-gray-600">
                Easy ticket submission with real-time status tracking
              </p>
            </div>

            <div className="bg-white shadow-md p-8 rounded-lg">
              <div className="mb-4 text-4xl">📚</div>
              <h3 className="mb-2 font-semibold text-xl">Knowledge Base</h3>
              <p className="text-gray-600">
                Search and browse helpful articles and documentation
              </p>
            </div>

            <div className="bg-white shadow-md p-8 rounded-lg">
              <div className="mb-4 text-4xl">👥</div>
              <h3 className="mb-2 font-semibold text-xl">Team Management</h3>
              <p className="text-gray-600">
                Assign tickets and collaborate with your support team
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="mb-8 font-bold text-2xl">Getting Started</h3>
            <div className="bg-white shadow-md mx-auto p-8 rounded-lg max-w-3xl text-left">
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="mr-3 font-bold text-blue-600">1.</span>
                  <div>
                    <strong>Start Prisma Database:</strong>
                    <code className="block bg-gray-100 mt-1 p-2 rounded">
                      bun db:dev
                    </code>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 font-bold text-blue-600">2.</span>
                  <div>
                    <strong>Push Database Schema:</strong>
                    <code className="block bg-gray-100 mt-1 p-2 rounded">
                      bun db:push
                    </code>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 font-bold text-blue-600">3.</span>
                  <div>
                    <strong>Start Development Server:</strong>
                    <code className="block bg-gray-100 mt-1 p-2 rounded">
                      bun dev
                    </code>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 font-bold text-blue-600">4.</span>
                  <div>
                    <strong>Create an account and start using NESK!</strong>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
