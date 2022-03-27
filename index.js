const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const fs = require('fs');
const {randomUUID} = require('crypto');

const directoryTemplate = "templates/directory.meta";
const monoTemplate = "templates/mono.meta";
const packageManifestTemplate = "templates/package-manifest.meta";
const assemblyDefinitionTemplate = "templates/assemblydef.meta";

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
}

function writeMetaFile(origFilePath, templatePath)
{
    fs.readFile(templatePath, 'utf8' , (err, data) => {
        if (err) {
            myFail(err)
            return
        }

        var guid = randomUUID().toString().replaceAll('-', '')
        var metaFileContents = data.replace('%%GUID%%', guid)
        console.log(`Writing meta file for ${origFilePath}`)
        fs.writeFile(origFilePath + ".meta", metaFileContents, err => {
            if (err) {
                myFail(err);
                return
            }
          })
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
