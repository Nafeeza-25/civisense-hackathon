## Civisense Backend (FastAPI Civic Intelligence System)

This is the backend-only FastAPI service for **Civisense**, a civic intelligence system that ingests citizen grievances, classifies them, computes a priority score, maps them to welfare schemes, and exposes explainable results for a dashboard.

### Architecture

- **Flow**: Frontend → FastAPI → NLP Engine → Priority Engine → Welfare Engine → Database → Dashboard  
- **Tech stack**:
  - **Python**
  - **FastAPI**
  - **SQLite** (local by default) / **PostgreSQL-ready** via `DATABASE_URL`
  - **scikit-learn** integration hook for category model

### Project Structure

- `main.py` – FastAPI application, API endpoints, wiring of engines
- `db.py` – SQLAlchemy models and DB session management
  - Tables:
    - `complaints`: `id, text, category, confidence, urgency, population_impact, vulnerability, priority_score, scheme, area, status, timestamp`
    - `feedback`: `id, complaint_id, correct_category, correct_scheme, notes, timestamp`
- `nlp.py` – NLP engine for category + confidence (scikit-learn model if available, else rule-based)
- `priority.py` – urgency, population impact, vulnerability, and priority score logic
- `schemes.py` – welfare scheme mapping logic
- `requirements.txt` – Python dependencies
- `.env.example` – sample environment configuration

### Installation

1. **Clone / copy** this backend directory.
2. Create and activate a virtual environment (recommended):

```bash
python -m venv .venv
source .venv/Scripts/activate  # on Windows PowerShell use: .venv\Scripts\Activate.ps1
```

3. **Install dependencies**:

```bash
pip install -r requirements.txt
```

4. **Environment configuration**:

```bash
cp .env.example .env  # on Windows: copy .env.example .env
```

Edit `.env` if needed:

- `DATABASE_URL` – defaults to `sqlite:///./civisense.db`
- `MODELS_DIR` – directory where a scikit-learn category model bundle can live
- `PORT` – optional port when running `python main.py`

### Running Locally

Using `uvicorn` directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Or via the module entry point:

```bash
python main.py
```

The API will be available at `http://localhost:8000`.

- Interactive docs (Swagger UI): `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Core API Endpoints

- **POST `/complaint`**
  - Body:
    - `text` – grievance text
    - `area` – locality/ward (optional but recommended)
    - `status` – initial status (default `"new"`)
  - Flow:
    1. NLP engine predicts **category** + **confidence**.
    2. Priority engine computes **urgency**, **population_impact**, **vulnerability**, and **priority_score**.
    3. Welfare engine selects **scheme**.
    4. Result is stored in `complaints` table.
    5. Returns complaint record plus an **explanation** block for dashboards.

- **GET `/dashboard`**
  - Returns aggregated metrics:
    - `total_complaints`
    - `by_status`
    - `by_category`
    - `top_areas`
    - `recent_high_priority` (list of recent complaints ordered by priority).

- **PATCH `/status/{id}`**
  - Body: `{ "status": "in_progress" | "resolved" | ... }`
  - Updates complaint status and returns updated complaint.

- **POST `/feedback`**
  - Body:
    - `complaint_id`
    - `correct_category` (optional)
    - `correct_scheme` (optional)
    - `notes` (optional)
  - Stores feedback in `feedback` table and optionally updates the complaint.

### scikit-learn Model Integration

The NLP engine looks for a **joblib bundle** at:

- `MODELS_DIR/category_model.joblib` (by default: `models/category_model.joblib`)

Expected structure of the bundle:

```python
{
    "model": trained_classifier,
    "vectorizer": fitted_vectorizer,
    "labels": list_of_label_names,  # optional but recommended
}
```

If present, this model is used to predict categories and confidence scores; otherwise, a rule-based classifier is used.

### Database Notes

- Default is a local SQLite database file: `civisense.db` in the project root.
- The application is **PostgreSQL-ready** – just point `DATABASE_URL` to a Postgres URI, e.g.:

```bash
DATABASE_URL=postgresql+psycopg2://user:password@host:5432/civisense
```

Make sure to install the appropriate DB driver (e.g. `psycopg2-binary`) if you switch to Postgres.

### Deployment (Render / Railway)

**Common settings:**

- **Build command**:

```bash
pip install -r requirements.txt
```

- **Start command**:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

- Ensure the platform sets the `PORT` environment variable (both Render and Railway do this by default).
- Set `DATABASE_URL` as an environment variable if you are using managed PostgreSQL; otherwise it will fall back to SQLite.

#### Render

- Create a new **Web Service** from this repo/folder.
- Use the build and start commands above.
- Add environment variables under **Environment**:
  - `DATABASE_URL`
  - `MODELS_DIR` (optional)

#### Railway

- Create a new **Service** and deploy this backend.
- Attach a **PostgreSQL** plugin if desired; Railway will give you a connection URL.
- Set `DATABASE_URL` to the Railway PostgreSQL URL.
- Use the same start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend / Dashboard

This repository is **backend-only**. A separate frontend or dashboard can be built to:

- Submit complaints via **POST `/complaint`**
- Visualize aggregates from **GET `/dashboard`**
- Update statuses via **PATCH `/status/{id}`**
- Feed corrections via **POST `/feedback`**

