"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface Doctor {
  did: string;
  name?: string;
  specialization: string;
  qualification: string;
  years_of_experience: number;
  languages: string[];
  consultation_fee: string;
  bio: string;
  clinic_name: string;
  city: string;
  image_url?: string;
}

function SearchComponent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle URL query parameters
  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (urlQuery) {
      setQuery(urlQuery);
      // Auto-search if query is provided in URL
      handleSearchWithQuery(urlQuery);
    }
  }, [searchParams]);

  async function handleSearchWithQuery(searchQuery: string) {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    await handleSearchWithQuery(query);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏥 Doctor Finder
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect doctor for your healthcare needs using AI-powered
            search
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for doctors... (e.g., 'cardiologist in Indore', 'pediatric surgeon with experience')"
                  className="w-full px-4 py-3 text-lg bg-white text-black placeholder-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : (
                  "🔍 Search"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-6xl mx-auto">
          {results.length === 0 && !loading && query && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No results found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or be more specific
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-600 text-center">
                Found{" "}
                <span className="font-semibold text-blue-600">
                  {results.length}
                </span>{" "}
                matching doctors
              </p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((doctor, i) => (
              <div
                key={doctor.did || i}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4 mb-4">
                         {doctor.image_url ? (
                            <img 
                                src={doctor.image_url} 
                                alt={doctor.specialization} 
                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shadow-sm"
                            />
                         ) : (
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                                👨‍⚕️
                            </div>
                         )}
                         <div>
                             {/* Use 'Doctor' as fallback if name is not available yet (though we should add it) */}
                             <h3 className="text-xl font-bold text-gray-800">
                                {doctor.name || "Doctor"}
                             </h3>
                             <p className="text-sm text-blue-600 font-medium">
                                {doctor.specialization}
                             </p>
                         </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <span>👨‍⚕️</span>
                      <span>{doctor.years_of_experience} years experience</span>
                    </div>
                    <p className="text-sm text-gray-600">{doctor.qualification}</p>
                  </div>

                  {/* Clinic Info */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">
                      Clinic
                    </h4>
                    <p className="text-sm text-gray-600">{doctor.clinic_name}</p>
                    <p className="text-xs text-gray-500">{doctor.city}</p>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {doctor.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  {doctor.bio && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {doctor.bio}
                      </p>
                    </div>
                  )}

                  {/* Fees */}
                  <div className="border-t pt-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Consultation Fee</span>
                      <p className="font-semibold text-green-600 text-lg">
                        ₹{doctor.consultation_fee}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Searches */}
        {results.length === 0 && !query && (
          <div className="max-w-4xl mx-auto mt-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">
              Try these sample searches:
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                "Hindi speaking nurse",
                "Pregnancy care specialist",
                "Pediatric nurse with 5+ years",
                "Home visit available",
                "Emergency care nurse",
                "Elderly care specialist",
              ].map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(sample)}
                  className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-left border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💡</span>
                    <span className="text-gray-700">{sample}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RagSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏥</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Doctor Finder
            </h1>
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchComponent />
    </Suspense>
  );
}
