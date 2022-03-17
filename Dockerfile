FROM ruby:3.0.2-alpine

RUN apk add --update --no-cache  --virtual run-dependencies \
build-base \
postgresql-client \
postgresql-dev \
yarn \
git \
tzdata \
libpq \
&& rm -rf /var/cache/apk/*

WORKDIR /geno_sur

ENV BUNDLE_PATH /gems

COPY Gemfile Gemfile.lock /geno_sur/
RUN gem install bundler
RUN bundle install

COPY . /geno_sur/

ENTRYPOINT ["bin/rails"]
CMD ["s", "-b", "0.0.0.0"]

EXPOSE 3000