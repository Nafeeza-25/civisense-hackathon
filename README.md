Civisense — HackElite26 Prototype



Team: Civitech

Project: Citizen Grievance \& Welfare Intelligence System



What This Is



Civisense is a full-stack prototype that uses AI to:



Classify citizen complaints



Calculate priority (urgency, population impact, vulnerability)



Suggest relevant welfare schemes



Show complaints in an officer dashboard



Tech Stack



Frontend: React + Vite + Tailwind



Backend: FastAPI (Python)



AI: Scikit-learn (TF-IDF + ML model)



DB: SQLite / SQLAlchemy



How To Run (Local)

1\. Clone Repo

git clone https://github.com/Nafeeza-25/civisense-hackathon.git

cd civisense-hackathon



2\. Backend

cd backend

python -m venv venv

venv\\Scripts\\activate

pip install -r requirements.txt

uvicorn main:app --reload





Open API Docs:

http://127.0.0.1:8000/docs



3\. Frontend (New Terminal)

cd frontend

npm install

npm run dev





Open App:

http://localhost:8080



Demo Flow



Submit a complaint from the frontend



System predicts category \& priority



Open dashboard to view and update status



Team Notes



Don’t push directly to main



Create your own branch:



git checkout -b your-name-feature



License



Prototype for HackElite26 — Demo \& Educational Use Only

