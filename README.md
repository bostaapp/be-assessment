# Bosta Backend Assessment

To get this demo working simple run the command `pnpm docker:dev` (assuming you have docker, and pnpm installed already).

## Architecture

The app is built with Nestjs which is a Nodejs framework heavily insipired by Angular of all things (I wanted to try it no particular technical reason).

For the database, I'm using MongoDB (would use an SQL database in real life situations, but I wanted to move fast).

If you checked the `docker-compose.yaml` file, you'd notice there's also `Redis` database. This Redis instance is used
by [`bull`](https://github.com/OptimalBits/bull) which is a queue manager I use to schedule the health checks.

## Documentation

For a more details look for the `swagger` documentations at `/api`.

The demo has a handful of endpoints, but for the sake of brevity, we'll be exploring only 3 endpoints in this document.

### /auth

First off before trying anything else since almost every endpoint is locked behind a json web token authentication. We need to create a user account.

To register, send a post request to the `/auth/register` route, it expects the request body to be as follows:

```json
{
  "username": "username",
  "email": "test@test.com",
  "password": "supersecretpassword"
}
```

I'm using a Ethereal for emails in the development environment, so by default this post request would return back a url
which has the "email" link which simulates an ordinary email. If you missed it no worries, you could use the `/auth/login`
endpoint to login, then use the access token provided to get a new email by hitting the `/auth/verify/new` endpoint with
the `Authorization` header set.

Now that we have an access token, set the `Authorization` header to `Bearer ${access_token}` for all of the upcoming requests.

### /url

Now we need to create a url process which would be run in the interval specified.
To create a process, send a post request to the `/url` endpoint. Here's an example

```json
{
  "name": "good_test",
  "url": "google.com",
  "protocol": "HTTP",
  "interval": 10,
  "timeout": 1,
  "tags": ["google", "success"]
}
```

This will create a process which polls the url `google.com` every 10 seconds.

### /health

To generate a report including the process we just created, hit the `/health/report` endpoint with a get request.

To filter processes included in the report, we could filter them by `tags` and/or process (the endpoint only shows processes created by the currently logged in user).

#### Examples

```
GET /health/report?process={processId}&tags="google"
```

Or multiple tags:

```
GET /health/report?tags="google"&tags="success"
```

## Extension, and the future

Notifiers could be added very easily and added to the `NotifiersDriver` which would run just about any class that implements the `INotifier` interface.

Nestjs relies heavily on the dependency injection model which makes it very easy to test. In this demo I haven't actually written an unit test, but theoritically,
in a perfect world, it'd be quite easy to write unit tests.

The demo has a `Swagger` documentation which is accessible by going to the `/api` route. This documentation in admittedly half hearted. The documentation would
be more detailed in a real world application.
