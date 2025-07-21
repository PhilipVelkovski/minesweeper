Project.
Project uses a base image to reduce downloading image on every build.
It is split into 
   - frontend  - vue js application
   - backend - express server
   - base - base image where the project is built un top of
   - ngnix - configuration file for the container


Run application localy.
# Setup
1) npm install
2) chmod +x /base/build.sh
3) cd base && sh build.sh && cd ..
### Frontend
4) cd frontend && npm install 
5) npm run build
### Backend
5) cd backend && npm install 
6) npm run build
7) docker compose build (from root)
6) docker compose up  

# Frontend: 
   Used vue cli to scafold a project from vue base.
   Components like CellBlock.vue GameBoard.vue & WinPrompt.vue are all ChatGPT generated with logic inside of them.
# Backend: 
  Node server + Express HTTP client
  Simple one file entry + routes + migration script.
# Server
  Nginx to connect the FE and BE ( no auth )
# Docker 
  Running application with compose 2 containers 1 mysql 8 database 1 container Node Express Server with Nginx proxy