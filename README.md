# Unity meta file creator  action

An action to create the meta files needed by Unity game engine. Mainly intended if you are developing a standalone csharp library that you then want to publish to as a unity package in a upm repo

## Inputs

## `directory`

**Required** The directory from which to start work. Default `"."`.


## Example usage

uses: andreparodi/unity-meta-file-creator-action@v0.1
with:
  directory: 'src'
