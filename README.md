# piman.dev
piman's personal site

## Installation
```
git clone git@github.com:piman51277/piman.dev.git
cd piman.dev
npm run setup
npm i
npm run build-all
```

## Configuration
This is done with `.env`:
```envfile
PORT=port
NODE_ENV=development,production
```

## Adding Projects
There are multiple options:
1. Git submodule
2. Symbolic link
3. Manual addition

In any case, the `projects` directory should contain sub-directories following the [project specification](./projects.md).