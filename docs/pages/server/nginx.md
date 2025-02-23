# NGINX

[NGINX](https://nginx.org/en/) is a reverse proxy server, which forwards incoming client requests from web browsers to locally running applications and servers. [Apache](https://httpd.apache.org/) and [Caddy](https://caddyserver.com/) are popular alternatives.

## Common commands

Test if server and site configurations are valid.

```sh
sudo nginx -t
```

Restart NGINX service.

```sh
sudo systemctl restart nginx
```

Check the status of NGINX service.

```sh
sudo systemctl status nginx
```

## Example configurations

Change as needed: domain, server user, container port.

### WordPress site

```
server {
  listen 80;
  listen [::]:80;

  access_log /home/ubuntu/logs/example.com-access.log;
  error_log /home/ubuntu/logs/example.com-error.log;

  server_name example.com www.example.com;

  root /home/ubuntu/apps/example.com;

  location ^~ /.well-known/acme-challenge/ {
    allow all;
      default_type "text/plain";
  }

  location / {
    proxy_read_timeout    90;
    proxy_connect_timeout 90;
    proxy_redirect        off;
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
    proxy_pass http://localhost:3000;
  }
}
```

### WordPress site with HTTPS

```
server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;

  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
  ssl_stapling on;
  ssl_stapling_verify on;
  ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;

  access_log /home/ubuntu/logs/example.com-access.log;
  error_log /home/ubuntu/logs/example.com-error.log;

  server_name example.com;

  root /home/ubuntu/apps/example.com;

  location ^~ /.well-known/acme-challenge/ {
    allow all;
      default_type "text/plain";
  }

  # Deny/Block some extensions
  location ~* ^.+\.(sql)$ {
    deny all;
    access_log off;
    log_not_found off;
  }

  location / {
    proxy_read_timeout    90;
    proxy_connect_timeout 90;
    proxy_redirect        off;
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
    proxy_pass http://localhost:3000;
  }
}

# Redirect HTTP -> HTTPS
server {
  listen 80;
  listen [::]:80;
  server_name example.com www.example.com;
  return 301 https://$server_name$request_uri;
}

# Redirect WWW HTTPS
server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;

  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
  ssl_stapling on;
  ssl_stapling_verify on;
  ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;

  server_name www.example.com;
  return 301 https://example.com$request_uri;
}
```

### Static site

```
server {

  listen 80;
  listen [::]:80;

  server_name example.com www.example.com;
  root /home/ubuntu/apps/example.com/;

  index index.html;

  location / {
    try_files $uri $uri/ =404;
  }
}
```

### Static site with HTTPS

```
server {

  listen 443 ssl http2;
  listen [::]:443 ssl http2;

  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

  server_name example.com;
  root /home/ubuntu/apps/example.com/;

  index index.html;

  # Security headers

  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
  add_header X-Content-Type-Options nosniff;
  add_header X-Frame-Options "DENY";
  add_header X-XSS-Protection "1; mode=block";

  # Next.js
  # error_page 404 /404/index.html;
  # error_page 500 /500/index.html;
  # location /_next/static {
  #   add_header Cache-Control "max-age=31536000";
  # }

  location / {
    try_files $uri $uri/ =404;
  }
}

# Redirect HTTP -> HTTPS
server {
  listen 80;
  listen [::]:80;
  server_name example.com www.example.com;
  return 301 https://example.com$request_uri;
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;

  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

  server_name www.example.com;
  return 301 https://example.com$request_uri;
}
```
