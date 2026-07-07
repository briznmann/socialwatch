import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, Filter, Calendar } from "lucide-react";
import Sidebar from "@/components/navigation/sidebar";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Mock search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Search</h2>
              <p className="text-slate-600">Search through all captured content</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Search Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Full-Text Search</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search through post text, handles, platforms..."
                    className="pl-10 pr-4 py-3 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button
                    type="submit"
                    className="btn-primary"
                    disabled={isSearching || !searchQuery.trim()}
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                  
                  <Button variant="outline" type="button">
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Filters
                  </Button>
                  
                  <Button variant="outline" type="button">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date Range
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          {isSearching ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-12 bg-slate-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No results found
              </h3>
              <p className="text-slate-600">
                Try different keywords or check your spelling.
              </p>
            </div>
          ) : !searchQuery ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Search Your Content
              </h3>
              <p className="text-slate-600 mb-6">
                Search through all captured posts, comments, and profiles using keywords, handles, or platform names.
              </p>
              
              {/* Search Tips */}
              <div className="max-w-2xl mx-auto">
                <div className="text-left">
                  <h4 className="font-semibold text-slate-900 mb-3">Search Tips:</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Use quotes for exact phrases: "artificial intelligence"</li>
                    <li>• Search by platform: platform:twitter</li>
                    <li>• Search by handle: @username</li>
                    <li>• Use date ranges with advanced filters</li>
                    <li>• Search supports partial matches and common typos</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : null}

          {/* Premium Search Features Upsell */}
          {!searchQuery && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Unlock Advanced Search Features
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Get OCR text extraction, historical search, and advanced filtering with Pro.
                    </p>
                  </div>
                  <Button className="btn-primary">
                    Upgrade to Pro
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
