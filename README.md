# Supervirus

A silly little game written in JavaScript. [Play it here!](https://samgqroberts.com/supervirus)

![Screenshot](https://i.imgur.com/U4HqGfM.png)

## Development

This project hasn't been substantially touched in a while. Installing dependencies fails on modern versions of node (v12 or v14). I've successfully built this project recently reverting to node v8.17.

To install dependencies: `npm install`

Most build tasks are defined in `gulp`. You can see a list of these tasks via `npm run gulp -- --tasks`.

Npm scripts are set up to wrap the important ones.
`npm build` - compile all assets into the build/ directory
`npm watch` - watch for filesystem changes and rebuild into build/ directory
`npm serve` - serve the contents of the build/ directory to localhost:3000
