## Config files used for site (backend + frontend)

nginx config
```
server {
    listen 80;
    server_name 35.183.91.143;

    location / {
        root /home/bitnami/projects/TorontoOpenData/build;
        try_files $uri $uri/ /index.html;
    }
    
    # ChatGPT's suggestion to override MIME types 
    location ~* \.(css)$ {
        root /home/bitnami/projects/TorontoOpenData/build;
        types {}
        default_type text/css;
    }

    location ~* \.(js)$ {
        root /home/bitnami/projects/TorontoOpenData/build;
        types {}
        default_type text/js;
    } 

    location /api {
        include proxy_params;
        proxy_pass http://localhost:8000/;
    }
}
```
