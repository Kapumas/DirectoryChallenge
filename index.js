// @kapumas

const constants = require("./constants");
const entryFile = require("./input");
const mapDirectories = {};

const commandMap = {
  CREATE: createFolder,
  MOVE: moveFolder,
  DELETE: deleteFolder,
  LIST: listFolders,
};

let output = ``;

/**
 * Init function
 * @param input - The input string that contains the commands to be executed.
 * @returns The output of the commands
 */
function runDirectories(input) {
  /* Initializing the output variable to an empty string. */
  output = "";
  console.log("[✔] Reading entry file: \n" + input);
  console.log("-----------------------------------");
  const commands = input.split("\n");
  commands.forEach((inst) => {
    output += inst + "\n";
    const splittedCmds = inst.split(" ");
    const cmd = splittedCmds[0];
    const path = splittedCmds[1];
    const commandFound = commandMap[cmd.toUpperCase()];
    if (!commandFound) {
      output += "Command not found \n";
      return;
    }
    if (cmd === constants.MOVE) {
      commandFound(path, splittedCmds[2]);
    } else {
      commandFound(path);
    }
  });
  return output;
}

/**
 * It creates a new folder in the current directory if the folder name doesn't already exist and if the
 * path to the folder exists
 * @param pathName - The path of the folder to be created.
 */
function createFolder(pathName) {
  const pathArray = pathName.split("/");
  const folder = pathName.substring(0, pathName.lastIndexOf("/"));
  const name = pathArray[pathArray.length - 1];
  // if (mapDirectories[name])
  //   return (output += `Cannot create a new folder [${pathName}], the name already exists \n`);
  // if (!!folder && !mapDirectories[folder])
  //   return (output += `Cannot create a new folder [${pathName}], the path [${folder}] doesn't exists \n`);
  mapDirectories[!!folder ? `${folder}/${name}` : name] = name;
}

/**
 * It moves a folder to a destiny folder, and if the destiny folder doesn't exist, it returns an error
 * @param folder - the folder to move
 * @param destiny - The destiny folder
 */
function moveFolder(folder, destiny) {
  const childs = getChildsByFolder(folder);
  if (childs.length) {
    childs.forEach((item) => {
      moveFolder(item, destiny);
    });
  }
  mapDirectories[`${destiny}/${folder}`] = folder;
  delete mapDirectories[folder];
}

/**
 * It deletes a folder and all its childs
 * @param folder - The folder to delete.
 * @returns the output variable.
 */
function deleteFolder(folder) {
  const splittedFolder = folder.split("/");
  const destiny = splittedFolder[0];
  if (!mapDirectories[folder]) {
    output += `Cannot delete ${folder} - ${destiny} does not exist\n`;
    return;
  }
  const childs = getChildsByFolder(folder);
  if (childs.length) {
    childs.forEach((item) => {
      deleteFolder(item);
    });
  }
  delete mapDirectories[folder];
}

/**
 * It takes the map of directories and creates a tree structure out of it
 */
function listFolders() {
  let tree = {};
  Object.keys(mapDirectories).forEach((folder) => {
    const splitPath = folder.split("/");
    mapPathToTree(tree, splitPath);
  });
  printTree(tree, 0);
}

/**
 * It takes a tree and a path, and maps the path to the tree
 * @param tree - the tree to add the path to
 * @param pathParts - The path parts of the file.
 * @returns the tree object.
 */
function mapPathToTree(tree, pathParts) {
  if (pathParts && pathParts.length <= 1) {
    tree[pathParts[0]] = tree[pathParts[0]];
    return;
  }
  const currPart = pathParts[0];
  let subTree = tree[currPart];
  if (!subTree) {
    subTree = {};
    tree[currPart] = subTree;
  }
  mapPathToTree(subTree, pathParts.slice(1));
}

/**
 * It takes a tree and a level, and prints the tree with the given level of indentation
 * @param subTree - the current subtree we're looking at
 * @param level - The level of the current subtree.
 */
function printTree(subTree, level) {
  for (const key in subTree) {
    output += " ".repeat(level).concat(key) + "\n";
    printTree(subTree[key], level + 1);
  }
}

/**
 * It returns an array of all the keys in the mapDirectories object that start with the folder name
 * passed in as an argument
 * @param folder - The folder you want to get the childs from.
 * @returns An array of all the keys in the mapDirectories object that start with the folder name.
 */
function getChildsByFolder(folder) {
  return Object.keys(mapDirectories).filter((item) =>
    item.startsWith(`${folder}/`)
  );
}

runDirectories(entryFile);
module.exports = runDirectories;
