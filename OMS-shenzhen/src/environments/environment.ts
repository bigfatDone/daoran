// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  domain: '/jit_pms',
  // imgApi: 'http://60.205.178.172/HD/',
  // imgApiSD: 'http://60.205.178.172/SD/',
  // imgApi: 'http://192.168.1.96:25603/HD/',
  // imgApiSD: 'http://192.168.1.96:25603/SD/'
  imgApi: 'http://192.168.1.95:25603/HD/',
  imgApiSD: 'http://192.168.1.95:25603/SD/'
};
