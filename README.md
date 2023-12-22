# Wordcharts

## Development

```
# start server on port 3000 (default)
docker-compose exec -w /app wordcharts npm --prefix frontend run dev
# start elixir backend on port 4000 (default)
docker-compose exec -w /app wordcharts mix phx.server 
```

### Translations
In case you add new translations:

1) First run extract, to extract new translations from javascript files to en language file: 
```
docker-compose exec -w /app wordcharts npm --prefix frontend run extract
```

2) Then compile the language files, so it can be used by the app:
```
docker-compose exec -w /app wordcharts npm --prefix frontend run compile
```

### Linting

```
docker-compose exec -w /app wordcharts bash
cd frontend
npx eslint .
```

Now you can visit [`localhost:3000`](http://localhost:3000) from your browser.

## Production

```
docker-compose --file docker-compose-prod.yml --env-file .env.prod up -d --build --force-recreate
```

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

- Optional: Generate self-signed ssl sertificate for the postgres server on the host machine; the generated files are mounted into the docker container

  ```bash
  mkdir -p ./ca
  openssl req -new -text -passout pass:abcd -subj /CN=localhost -out ./ca/server.req -keyout ./ca/privkey.pem
  openssl rsa -in ./ca/privkey.pem -passin pass:abcd -out ./ca/server.key
  openssl req -x509 -in ./ca/server.req -text -key ./ca/server.key -out ./ca/server.crt
  chmod 600 ./ca/server.key
  test $(uname -s) = Linux && chown 70 ./ca/server.key
  ```

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix

## Backup

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`
