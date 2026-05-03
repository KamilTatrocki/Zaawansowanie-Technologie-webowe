python3 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
docker compose up -d
cd dbs
python db_seeding.py
cd ..
npm install
npx prisma generate
