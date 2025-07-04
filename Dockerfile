# Find eligible builder and runner images on Docker Hub. We use Ubuntu/Debian instead of
# Alpine to avoid DNS resolution issues in production.
#
# https://hub.docker.com/r/hexpm/elixir/tags?page=1&name=ubuntu
# https://hub.docker.com/_/ubuntu?tab=tags
#
#
# This file is based on these images:
#
#   - https://hub.docker.com/r/hexpm/elixir/tags - for the build image
#   - https://hub.docker.com/_/debian?tab=tags&page=1&name=bullseye-20210902-slim - for the release image
#   - https://pkgs.org/ - resource for finding needed packages
#   - Ex: hexpm/elixir:1.14.0-erlang-24.3.4-debian-bullseye-20210902-slim
#
ARG ELIXIR_VERSION=1.18.4
ARG OTP_VERSION=27.3.4.1
ARG DEBIAN_VERSION=bookworm-20250630-slim

ARG BUILDER_IMAGE="hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-debian-${DEBIAN_VERSION}"
ARG RUNNER_IMAGE="debian:${DEBIAN_VERSION}"

ARG APP_PATH="/app"
ARG FRONTEND_APP_PATH="/app/frontend"

FROM ${BUILDER_IMAGE} AS base

# Install node
ENV NODE_MAJOR=20

RUN apt-get -y update

RUN apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings  
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

# install build dependencies
RUN apt-get update && apt-get install -y nodejs \
  build-essential \
  inotify-tools \ 
  postgresql-client \
  git \
  vim \
  cmake && \
  apt-get clean && \ 
  rm -f /var/lib/apt/lists/*_*

RUN node --version
RUN npm --version

RUN mix do local.hex --force, local.rebar --force

WORKDIR $APP_PATH

FROM base AS development

FROM base AS production_builder

# set build ENV
ENV MIX_ENV="prod"

# This is required for arm64 builds, see https://elixirforum.com/t/mix-deps-get-memory-explosion-when-doing-cross-platform-docker-build/57157
ENV ERL_FLAGS="+JPperf true"

# Setting this env var will avoid warnings from the production config
# We could leave it as it as no effect on the build output
ENV SECRET_KEY_BASE="dummy_secret_key_base_to_avoid_warning_from_production_config"

# install mix dependencies
COPY mix.exs mix.lock ./
RUN mix deps.get --only $MIX_ENV
RUN mkdir config

# copy compile-time config files before we compile dependencies
# to ensure any relevant config change will trigger the dependencies
# to be re-compiled.
COPY config/config.exs config/${MIX_ENV}.exs config/
RUN mix deps.compile

COPY priv priv

COPY lib lib

# Install npm packages:
COPY frontend/package.json frontend/package-lock.json ./frontend/

# the build requires dev dependencies like vite to work. vite will create a production build.
RUN npm ci --prefix frontend
COPY frontend frontend

RUN npm run build --prefix frontend
RUN rm -rf ./priv/static/webapp
RUN mkdir ./priv/static/webapp
RUN mv ./frontend/dist/* ./priv/static/webapp
# frontend folder is not needed anymore
RUN rm -rf ./frontend

COPY assets assets

# compile assets
RUN mix assets.deploy

# Compile the release
RUN mix compile

# Changes to config/runtime.exs don't require recompiling the code
COPY config/runtime.exs config/

# copy release jobs
COPY rel rel

RUN mix release

# start a new build stage so that the final image will only contain
# the compiled release and other runtime necessities
FROM ${RUNNER_IMAGE} AS production

RUN apt-get update -y && apt-get install -y ca-certificates libstdc++6 postgresql-client openssl libncurses5 locales \
  && apt-get clean && rm -f /var/lib/apt/lists/*_*

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

WORKDIR "/app"
RUN chown nobody /app

# set runner ENV
ENV MIX_ENV="prod"
ENV NODE_ENV="production"

# Only copy the final release from the build stage
COPY --from=production_builder --chown=nobody:root /${APP_PATH}/_build/${MIX_ENV}/rel/wordcharts ./

USER nobody

# includes the migrate task
CMD ["/app/bin/server"]