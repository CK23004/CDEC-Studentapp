step 1 : clone the project code using git clone repo_url

step 2 : try to run the project locally if possible ( needed mysql server on locally or on any host )

step 3 : create dockerfiles for both frontend and backend 

step 4: build images for each frontend and backend

step 5: create docker network as student-network

step 6: run mysql container using -d --network student-network -e MYSQL_ROOT_PASSWORD=root --name studentapp-db -p 3306:3306 mysql:latest

step 7: run backend and then frontend container use details shown in readme file 

