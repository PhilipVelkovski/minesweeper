FROM mine-base as mine-application

WORKDIR /app

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY frontend/ ./frontend
RUN cd frontend && npm run build


COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

COPY backend/ ./backend




COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Move built frontend into Nginx's public directory
RUN rm -rf /usr/share/nginx/html/* && \
    cp -r ./frontend/dist/* /usr/share/nginx/html/


COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
