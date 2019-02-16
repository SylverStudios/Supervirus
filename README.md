To set up your development environment, run `npm install`

Most build tasks are defined in `gulp`. You can see a list of these tasks via `npm run gulp -- --tasks`.

Npm scripts are set up to wrap the important ones.
`npm build` - compile all assets into the build/ directory
`npm watch` - watch for filesystem changes and rebuild into build/ directory
`npm serve` - serve the contents of the build/ directory to localhost:3000
