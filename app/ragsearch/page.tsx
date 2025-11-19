"use client";

import { useState } from "react";

interface Nurse {
  id: string;
  name: string;
  profile_image_url?: string;
  specializations: string[];
  experience_years: number;
  languages: string[];
  consultation_fee: string;
  home_visit_fee: string;
  bio: string;
  available_for_home_visits: boolean;
}

export default function RagSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏥 Nurse Finder
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect nurse for your healthcare needs using AI-powered search
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
                  placeholder="Search for nurses... (e.g., 'Hindi speaking nurse for pregnancy care', 'experienced pediatric nurse')"
                  className="w-full px-4 py-3 text-lg bg-white text-black placeholder-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search terms or be more specific</p>
            </div>
          )}
          
          {results.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-600 text-center">
                Found <span className="font-semibold text-blue-600">{results.length}</span> matching nurses
              </p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((nurse, i) => (
              <div
                key={nurse.id || i}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Profile Image */}
                {nurse.profile_image_url && (
                  <div className="relative h-48 w-full">
                    <img
                      src={nurse.profile_image_url}
                      alt={nurse.name}
                      className="w-full h-full object-cover"
                    />
                    {nurse.available_for_home_visits && (
                      <span className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Home Visits
                      </span>
                    )}
                  </div>
                )}
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {nurse.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>👩‍⚕️</span>
                        <span>{nurse.experience_years} years experience</span>
                      </div>
                    </div>
                    {!nurse.profile_image_url && nurse.available_for_home_visits && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Home Visits
                      </span>
                    )}
                  </div>

                  {/* Specializations */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-1">
                      {nurse.specializations.slice(0, 3).map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                      {nurse.specializations.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          +{nurse.specializations.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-1">
                      {nurse.languages.slice(0, 3).map((lang, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                      {nurse.languages.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          +{nurse.languages.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {nurse.bio && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {nurse.bio}
                      </p>
                    </div>
                  )}

                  {/* Fees */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Consultation</span>
                        <p className="font-semibold text-green-600">{nurse.consultation_fee}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Home Visit</span>
                        <p className="font-semibold text-green-600">{nurse.home_visit_fee}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200">
                    Contact Nurse
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
                "Elderly care specialist"
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