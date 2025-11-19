# 🏥 Nurse Finder - AI-Powered Healthcare Search

A Next.js application that uses AI-powered semantic search to help users find the perfect nurse for their healthcare needs. Built with Google Gemini embeddings and Pinecone vector database.

## ✨ Features

- **AI-Powered Search**: Uses Google Gemini embeddings for semantic search
- **Smart Matching**: Finds nurses based on specializations, languages, experience, and more
- **Visual Interface**: Clean, modern UI with nurse profile images
- **Detailed Profiles**: Shows specializations, languages, experience, fees, and availability
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Google AI API key (for Gemini embeddings) - [Get one here](https://aistudio.google.com/app/apikey)
- Pinecone account and API key - [Sign up here](https://www.pinecone.io/)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd ayur-rag
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   GOOGLE_API_KEY=your_google_ai_api_key_here
   GOOGLE_EMBEDDING_MODEL=text-embedding-004
   PINECONE_API_KEY=your_pinecone_api_key_here
   PINECONE_INDEX_NAME=nurse-index
   ```

4. **Create Pinecone index**

   ```bash
   npm run create-embeddings
   ```

   This creates the Pinecone index with the correct dimensions for Google embeddings.

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Ingest nurse data into Pinecone**

   After the server is running, populate the vector database:

   ```bash
   curl -X POST http://localhost:3000/api/ingest
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Data Structure

The application uses nurse data stored in `data/nurses.json`. Each nurse record includes:

```json
{
  "id": "unique-id",
  "name": "Nurse Name",
  "profile_image_url": "https://example.com/image.jpg",
  "specializations": ["Pediatric Care", "Emergency Care"],
  "experience_years": 5,
  "languages": ["English", "Hindi"],
  "bio": "Experienced nurse specializing in...",
  "consultation_fee": "500.00",
  "home_visit_fee": "450.00",
  "available_for_home_visits": true,
  "available_for_online": true
}
```

## 🔄 Updating Nurse Data

When you modify the nurse data in `data/nurses.json`, you need to update the Pinecone vector database:

### Step 1: Update the Data

Edit `data/nurses.json` with your new nurse information.

### Step 2: Re-ingest Data into Pinecone

With your development server running, call the ingest API:

```bash
curl -X POST http://localhost:3000/api/ingest
```

This will:

- Read the updated nurse data from `data/nurses.json`
- Generate new Google Gemini embeddings for each nurse
- Store the embeddings in your Pinecone vector database
- The search API will immediately use the updated data

### Step 3: No Restart Required

The changes are reflected immediately since Pinecone is a live vector database.

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run create-embeddings` - Create Pinecone index (run once during setup)

## 📁 Project Structure

```
ayur-rag/
├── app/
│   ├── api/
│   │   ├── ingest/          # API for data ingestion
│   │   └── search/          # Search API endpoint
│   ├── ragsearch/           # Main search page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (redirects to search)
├── data/
│   └── nurses.json          # Nurse data (embeddings stored in Pinecone)
├── lib/
│   └── embedding.ts         # Embedding utilities
├── scripts/
│   └── create-index.js      # Embedding generation script
└── public/                  # Static assets
```

## 🔍 How It Works

1. **Data Preparation**: Nurse profiles are stored in JSON format
2. **Vector Database**: Pinecone stores vector embeddings for each nurse's combined information
3. **Embedding Generation**: Google Gemini creates semantic embeddings from nurse data
4. **Search Process**: User queries are converted to embeddings and matched against stored vectors
5. **Similarity Matching**: Cosine similarity in Pinecone finds the most relevant nurses
6. **Results Display**: Matching nurses are displayed with their profiles and images

## 🎨 Customization

### Adding New Fields

1. Update the nurse data structure in `data/nurses.json`
2. Modify the `Nurse` interface in `app/ragsearch/page.tsx`
3. Update the display components to show new fields
4. Regenerate embeddings with `npm run create-embeddings`

### Styling

- Modify `app/globals.css` for global styles
- Update Tailwind classes in components for UI changes
- Customize the color scheme and layout as needed

## 🔧 Configuration

### Google AI Settings

The application uses Google's `text-embedding-004` model by default. You can modify this in:

- `.env` - Change `GOOGLE_EMBEDDING_MODEL` variable
- `lib/embedding.ts` - For embedding generation logic

### Pinecone Settings

Configure your Pinecone setup in `.env`:

- `PINECONE_API_KEY` - Your Pinecone API key
- `PINECONE_INDEX_NAME` - Name of your vector index

### Search Parameters

Adjust search behavior in `app/api/search/route.ts`:

- Number of results returned
- Similarity threshold
- Ranking algorithms

## 🚨 Troubleshooting

### Common Issues

1. **"Index not found" error**

   - Run `npm run create-embeddings` to create the Pinecone index
   - Verify your `PINECONE_INDEX_NAME` in `.env`

2. **Google AI API errors**

   - Verify your `GOOGLE_API_KEY` in `.env`
   - Check your Google AI account has API access enabled

3. **Pinecone connection errors**

   - Verify your `PINECONE_API_KEY` in `.env`
   - Ensure your Pinecone project is active

4. **Search not working**
   - Ensure data is ingested into Pinecone via `/api/ingest`
   - Check browser console for API errors

### Performance Tips

- Keep nurse data under 1000 records for optimal performance
- Re-ingest data into Pinecone only when nurse data changes
- Pinecone handles scaling automatically for larger datasets
- Consider implementing caching for production use

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update embeddings if you modify nurse data
5. Test your changes
6. Submit a pull request

## � APpI Integration

You can integrate the nurse search functionality into other applications using the REST API endpoints.

### Search Endpoint

**URL:** `POST /api/search`

**Request Body:**

```json
{
  "query": "Hindi speaking nurse for pregnancy care"
}
```

**Response:**

```json
{
  "results": [
    {
      "id": "nurse-id-123",
      "name": "Nurse Name",
      "profile_image_url": "https://example.com/image.jpg",
      "specializations": ["Pregnancy Care", "Maternal Health"],
      "experience_years": 8,
      "languages": ["Hindi", "English"],
      "bio": "Experienced nurse specializing in...",
      "consultation_fee": "500.00",
      "home_visit_fee": "450.00",
      "available_for_home_visits": true,
      "available_for_online": true
    }
  ],
  "matches": [
    {
      "id": "nurse-id-123",
      "score": 0.85,
      "metadata": {}
    }
  ]
}
```

### Integration Examples

#### JavaScript/Node.js

```javascript
async function searchNurses(query) {
  const response = await fetch("http://localhost:3000/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  return data.results;
}

// Usage
const nurses = await searchNurses("pediatric nurse with 5+ years experience");
```

#### Python

```python
import requests
import json

def search_nurses(query):
    url = "http://localhost:3000/api/search"
    payload = {"query": query}
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, data=json.dumps(payload), headers=headers)
    return response.json()["results"]

# Usage
nurses = search_nurses("Hindi speaking nurse for elderly care")
```

#### cURL

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "emergency care nurse with home visit availability"}'
```

#### React/Frontend

```jsx
import { useState } from "react";

function NurseSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchNurses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for nurses..."
      />
      <button onClick={searchNurses} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {results.map((nurse) => (
        <div key={nurse.id}>
          <h3>{nurse.name}</h3>
          <p>{nurse.bio}</p>
          <p>Experience: {nurse.experience_years} years</p>
          <p>Languages: {nurse.languages.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
```

### Production Deployment

For production use, replace `localhost:3000` with your deployed API URL:

```javascript
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://your-app.vercel.app";

const response = await fetch(`${API_BASE_URL}/api/search`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
});
```

## 🚀 Vercel Deployment Endpoints

After deploying to Vercel, your API endpoints will be available at:

### **Live Endpoints**

- **Search API**: `POST https://your-app-name.vercel.app/api/search`
- **Data Ingestion**: `POST https://your-app-name.vercel.app/api/ingest`

### **Quick Test**

```bash
# Test search endpoint
curl -X POST https://your-app-name.vercel.app/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Hindi speaking nurse for pregnancy care"}'

# Update nurse data (after modifying data/nurses.json)
curl -X POST https://your-app-name.vercel.app/api/ingest
```

### **Integration Example**

```javascript
const API_BASE = "https://your-app-name.vercel.app";

async function searchNurses(query) {
  const response = await fetch(`${API_BASE}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return response.json();
}

// Usage
const results = await searchNurses("pediatric nurse with 5+ years");
console.log(results.results);
```

### **Environment Variables for Vercel**

Make sure to add these environment variables in your Vercel dashboard:

- `GOOGLE_API_KEY`
- `GOOGLE_EMBEDDING_MODEL`
- `PINECONE_API_KEY`
- `PINECONE_INDEX_NAME`

**Note:** Replace `your-app-name` with your actual Vercel deployment URL.

### Rate Limiting & Best Practices

- **Debounce searches** to avoid excessive API calls
- **Cache results** for repeated queries
- **Handle errors gracefully** with try-catch blocks
- **Validate input** before sending requests
- **Set timeouts** for API calls to prevent hanging

#### Example with Debouncing (React)

```jsx
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";

function useNurseSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchNurses = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) return;

      setLoading(true);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        });
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchNurses(query);
  }, [query, searchNurses]);

  return { query, setQuery, results, loading };
}
```

### CORS Configuration

If integrating from a different domain, you may need to configure CORS. Add this to your Next.js API route:

```javascript
// In your API route file
export async function POST(req: Request) {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  // Your existing search logic...
  const response = NextResponse.json(data);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
```

## 📞 Support

For questions or issues:

1. Check the troubleshooting section above
2. Review the project structure and API documentation
3. Open an issue on GitHub with detailed information

---

**Happy searching! 🏥✨**
