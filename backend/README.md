# Scogo Serverless Services

A collection of all the services

## Instructions

Serverless must be installed on your system

```sh
npm i -g serverless
```

Installs project dependencies from npm

```sh
npm i
```

Run the project offline

```sh
cd /path/to/project
sls offline start
```

Default port is `3000`. You can change it by adding `--port 8080`

Testing Test cases

```sh
cd /path/to/project
jest test/*.spec.js
```

Deployment

```sh
cd /path/to/project
sls deploy --stage {dev|test|demo|prod}
```
