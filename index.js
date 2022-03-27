const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const fs = require('fs');
const {randomUUID} = require('crypto');

const directoryTemplate = `fileFormatVersion: 2
guid: %%GUID%%
folderAsset: yes
DefaultImporter:
  externalObjects: {}
  userData: 
  assetBundleName: 
  assetBundleVariant: `;
const monoTemplate = `fileFormatVersion: 2
guid: %%GUID%%
MonoImporter:
  externalObjects: {}
  serializedVersion: 2
  defaultReferences: []
  executionOrder: 0
  icon: {instanceID: 0}
  userData: 
  assetBundleName: 
  assetBundleVariant: `;
const packageManifestTemplate = `fileFormatVersion: 2
guid: %%GUID%%
PackageManifestImporter:
  externalObjects: {}
  userData: 
  assetBundleName: 
  assetBundleVariant: `;
const assemblyDefinitionTemplate = `fileFormatVersion: 2
guid: %%GUID%%
AssemblyDefinitionImporter:
  externalObjects: {}
  userData: 
  assetBundleName: 
  assetBundleVariant: `;
const unknownTemplate = `fileFormatVersion: 2
guid: %%GUID%%
timeCreated: 1648391988`;

run()

function run() {
    try {
        const directory = core.getInput('directory');
        //const directory = "testfolder"
        console.log(`Processing ${directory}!`);
        walkTree(directory);
    } catch (error) {
        myFail(error.message);
    }
}

function walkTree(dirname)
{
    fs.readdir(dirname, function (err, files) {
        if (err) {
            myFail(err);
            return
        }

        files.forEach(function (file, index) {
            file = dirname + path.sep + file
            fs.stat(file, function (err, stats) {
                if (err) {
                    myFail(err)
                    return
                }
        
                if (stats.isFile()) {
                    processFile(file)
                } else if (stats.isDirectory()) {
                    writeMetaFile(file, directoryTemplate);
                    walkTree(file);
                }
            })
        })
    })
}

function processFile( file)
{
    if (path.extname(file) === ".cs")
    {
        writeMetaFile(file, monoTemplate);
    }
    else if (path.basename(file) === "package.json")
    {
        writeMetaFile(file, packageManifestTemplate);
    }
    else if (path.extname(file) === ".asmdef")
    {
        writeMetaFile(file, assemblyDefinitionTemplate);
    }
    else if (path.extname(file) != ".meta")
    {
        writeMetaFile(file, unknownTemplate);
    }
}

function writeMetaFile(origFilePath, templateString)
{
    var guid = randomUUID().toString().replaceAll('-', '')
    var metaFileContents = templateString.replace('%%GUID%%', guid)
    console.log(`Writing meta file for ${origFilePath}`)
    fs.writeFile(origFilePath + ".meta", metaFileContents, err => {
        if (err) {
            myFail(err);
            return
        }
    })
}

function myFail(message, err) {
    console.error(message);
    console.error(err);
}

function myFail(err)
{
    core.setFailed(err);
    //console.error(err)
}
