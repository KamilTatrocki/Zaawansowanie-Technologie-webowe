Generalnie, żeby odpalić apkę
./mvnw spring-boot:run
Spring sam wszystko pobierze i odpali dockera
Jest na tyle mądry, że sam czyta docker compose i wszystko ustawia
Ustawienia połączenia są w pliku 
/src/resources/applictation.properties - plik konfiguracyjny

Baza (jako łącze)
localhost:5433
Strona będzie dostępna pod
localhost:8080
System do zarządzania bazą pod
localhost:8079

System  - Postgres
Serwer  - db
User    - ztw_l5
Hasło   - ztw_l5
Baza    - app_db