# AI Resume Analyzer — Backend

Express API for the AI Resume Analyzer frontend.

## Run locally

```bash
cd backend
npm install
npm start
```

The server listens on **http://localhost:5000**.

## Endpoints

### `POST /analyze`
Body:
```json
{ "resumeText": "string (>= 20 chars)", "jobRole": "Frontend Developer" }
```
Returns full analysis: `score`, `matchedSkills`, `missingSkills`, `suggestions`, `jobRecommendations`, `salaryInsights`, `learningRoadmap`, `modifiedResume`, `mockInterviewQuestions`, `chatbotResponse`.

### `POST /chat`
Body:
```json
{ "message": "How can I improve?", "context": <analysis result object> }
```
Returns `{ "reply": "..." }`.

## Frontend connection
The React frontend calls `http://localhost:5000/analyze` and `http://localhost:5000/chat`. Make sure the backend is running before clicking **Get Analysis**.

You can override the base URL in the frontend by setting `VITE_API_URL` in a `.env` file at the project root, e.g.:
```
VITE_API_URL=http://localhost:5000
```

## Deploy on Render (optional)
1. Push this `backend/` folder to a Git repo (or use the project repo with root dir `backend`).
2. On https://render.com → **New Web Service** → connect repo.
3. **Root Directory**: `backend`  •  **Build Command**: `npm install`  •  **Start Command**: `npm start`.
4. After deploy, set `VITE_API_URL=https://your-service.onrender.com` in the frontend env and redeploy the frontend.