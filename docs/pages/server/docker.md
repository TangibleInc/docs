# Docker

[Docker](https://docker.com) is used to manage containers, which are isolated virtual environments for running software stacks.

## Install

Install Docker Engine by following the [install instructions](https://docs.docker.com/engine/install/).

For Windows and macOS, you can install Docker Desktop (GUI app) which includes the engine; or choose a more technical way to install the engine by itself.

- [Docker on Windows WSL2 without Docker Desktop](https://rmauro.dev/run-docker-on-wsl2-without-docker-desktop/)
- [How to use docker engine without Docker Desktop on macOS with Colima](https://aalonso.dev/blog/2024/how-to-use-docker-engine-without-docker-desktop-macos-colima)

There are other container solutions, such as Podman and Apple's Container.

## Commands

Start the containers.

```sh
docker compose up -d
```

Visit the site at [`http://localhost:3000`](http://localhost:3000). Change the default port number `3000` in the config file to run multiple applications.

Stop the containers.

```sh
docker compose down
```

List running processes.

```sh
docker compose ps
```

## Example configurations

### WordPress site

Example config file `docker-compose.yml` for a WordPress site with MariaDB and WP-CLI. It uses a named volume `mysql` for persistent storage of database.


```yml
services:
  mysql:
    image: mariadb:11.4
    environment:
      MYSQL_ROOT_HOST: '%'
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: wordpress
    restart: always
    volumes:
      - 'mysql:/var/lib/mysql'
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
  wordpress:
    depends_on:
      - mysql
    image: wordpress:php8.0
    ports:
      - '3000:80'
    environment:
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: password
      WORDPRESS_DB_NAME: wordpress
    volumes: &ref_0
      - .:/var/www/html
    restart: always
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
  cli:
    depends_on:
      - wordpress
    image: wordpress:cli-php8.0
    volumes: *ref_0
    user: '33:33'
    environment:
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: password
      WORDPRESS_DB_NAME: wordpress
volumes:
  mysql: {}
```
