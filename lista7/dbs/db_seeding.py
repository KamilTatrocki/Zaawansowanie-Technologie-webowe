
import sqlite3
from pathlib import Path
import psycopg2
#SQLITE

data_path = Path("sqlite-data/database.db")
if data_path.exists():
    data_path.unlink()

con = sqlite3.connect(data_path)

cur = con.cursor()

cur.execute("CREATE TABLE user(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL" +
            ", email TEXT NOT NULL, login TEXT UNIQUE NOT NULL)")
con.commit()
cur.execute(
    "CREATE TABLE todo(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, completed INTEGER NOT NULL, user INTEGER NOT NULL, " +
    "CONSTRAINT fk_todo_user FOREIGN KEY (user) REFERENCES user (id) ON DELETE RESTRICT)"
)
con.commit()

user_data = [
    ('Garry', 'Garry@gmail.com', "garry02"),
    ('Mary', 'Mary@gmail.com', "Marry03"),
    ('pwnzer0', 'pwn@pwn.com', "ssh-nuke"),
]

todo_data = [
    ('Cleaning', False, 1),
    ('Shopping', True, 1),
    ('Breathing', False, 1),
    ('Breaking', True, 2),
    ('Barking', True, 2),
]

cur.executemany("INSERT INTO user VALUES(NULL,?, ?, ?)", user_data)
con.commit()
cur.executemany("INSERT INTO todo VALUES(NULL,?, ?, ?)", todo_data)
con.commit()

print("Initialized sqlite db")
print("Top 3 users:")
print(cur.execute("SELECT * FROM user").fetchmany(3))
print("Top 3 todos:")
print(cur.execute("SELECT * FROM todo").fetchmany(3))

cur.close()
con.close()
# POSTGRES

print()
con = psycopg2.connect(
    dbname="app_db",
    user="ztw_l7",
    password="ztw_l7",
    host="localhost",
    port="5432"
)

cur = con.cursor()

cur.execute("DROP TABLE IF EXISTS todo;")
cur.execute('DROP TABLE IF EXISTS "user";')
con.commit()

cur.execute("""
    CREATE TABLE "user" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        email VARCHAR(30) NOT NULL,
        login VARCHAR(50) UNIQUE NOT NULL
    )
""")
con.commit()

cur.execute("""
    CREATE TABLE todo (
        id SERIAL PRIMARY KEY,
        title VARCHAR(30) NOT NULL,
        completed BOOLEAN NOT NULL,
        "user" INTEGER REFERENCES "user" NOT NULL
    )
""")
con.commit()

cur.executemany('INSERT INTO "user" (name, email, login) VALUES (%s, %s, %s)', user_data)
con.commit()

cur.executemany('INSERT INTO todo (title, completed, "user") VALUES (%s, %s, %s)', todo_data)
con.commit()

print("Initialized postgres db")

print("Top 3 users:")
cur.execute('SELECT * FROM "user"')
print(cur.fetchmany(3))

print("Top 3 todos:")
cur.execute("SELECT * FROM todo")
print(cur.fetchmany(3))

cur.close()
con.close()
