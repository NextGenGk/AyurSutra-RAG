# AyurSutra RAG - AI-Powered Nurse Finder

A Next.js application that uses Retrieval-Augmented Generation (RAG) to help users find the perfect nurse for their healthcare needs through intelligent semantic search.

## 🏥 Features

- **AI-Powered Search**: Semantic search using Google Gemini embeddings and Pinecone vector database
- **Smart Matching**: Find nurses based on natural language queries like "Hindi speaking nurse for pregnancy care"
- **Comprehensive Profiles**: View nurse specializations, experience, languages, fees, and availability
- **Real-time Results**: Fast search with detailed nurse information and contact options
- **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS

## 🚀 Live Demo

Visit the live application: [https://ayur-sutra-rag.vercel.app](https://ayur-sutra-rag.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI/ML**: Google Gemini API for embeddings
- **Vector Database**: Pinecone for semantic search
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key
- Pinecone account and API key

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Google Gemini API
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=your_pinecone_index_name
```

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/NextGenGk/AyurSutra-RAG.git
   cd AyurSutra-RAG
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and configuration

4. **Ingest nurse data into Pinecone**
   ```bash
   # Start the development server first
   npm run dev
   
   # Then call the ingest endpoint
   curl http://localhost:3000/api/ingest
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Search Endpoints

#### GET /api/search
Search for nurses using query parameters.

**Parameters:**
- `query` (required): Search term or natural language query

**Example:**
```bash
curl "http://localhost:3000/api/search?query=pediatric nurse with Hindi language"
```

#### POST /api/search
Search for nurses using JSON body.

**Body:**
```json
{
  "query": "experienced nurse for elderly care"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "home visit nurse for pregnancy"}'
```

#### Response Format
```json
{
  "results": [
    {
      "id": "nurse-id",
      "name": "Nurse Name",
      "specializations": ["Specialty 1", "Specialty 2"],
      "experience_years": 5,
      "languages": ["en", "hi"],
      "consultation_fee": "500.00",
      "home_visit_fee": "450.00",
      "available_for_home_visits": true,
      "bio": "Nurse biography..."
    }
  ],
  "matches": [
    {
      "id": "nurse-id",
      "score": 0.85,
      "metadata": {...}
    }
  ]
}
```

### Data Ingestion

#### GET /api/ingest
Ingests nurse data from `data/nurses.json` into Pinecone vector database.

**Example:**
```bash
curl http://localhost:3000/api/ingest
```

## 🔍 How It Works

1. **Data Ingestion**: Nurse profiles are converted to text and embedded using Google Gemini
2. **Vector Storage**: Embeddings are stored in Pinecone with metadata
3. **Semantic Search**: User queries are embedded and matched against stored vectors
4. **Result Ranking**: Most similar nurses are returned based on cosine similarity
5. **UI Display**: Results are presented in an intuitive, searchable interface

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── ingest/
│   │   │   └── route.ts          # Data ingestion endpoint
│   │   └── search/
│   │       └── route.ts          # Search API endpoint
│   ├── ragsearch/
│   │   └── page.tsx              # Main search interface
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (redirects to search)
├── data/
│   └── nurses.json               # Nurse database
├── lib/
│   └── embedding.ts              # Embedding utility functions
└── README.md
```

## 🎯 Usage Examples

### Natural Language Queries
- "Find a Hindi speaking nurse for pregnancy care"
- "Experienced pediatric nurse with home visit availability"
- "Emergency care specialist with 5+ years experience"
- "Nurse for elderly care who speaks multiple languages"

### Direct URL Access
- `/ragsearch?query=headache` - Direct search with pre-filled query
- `/api/search?query=pediatric nurse` - API endpoint for integration

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for powerful embedding capabilities
- Pinecone for efficient vector search
- Next.js team for the excellent framework
- Vercel for seamless deployment

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

Built with ❤️ for better healthcare accessibility