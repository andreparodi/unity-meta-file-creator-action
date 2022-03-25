const core = require('@actions/core');
const github = require('@actions/github');

try {
  const directory = core.getInput('directory');
  console.log(`Hello ${directory}!`);
} catch (error) {
  core.setFailed(error.message);
}