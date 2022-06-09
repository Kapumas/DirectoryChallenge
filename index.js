// @kapumas

const constants = require("./constants");
const entryFile = require("./input");

class Directory {
  /**
   * The constructor function takes a file as an argument and assigns it to the inputFile property
   * @param _file - The file to be read.
   */
  constructor(_file) {
    this.inputFile = _file;
  }
  /* Creating an empty object. */
  mapDirectories = {};
  /* Initializing the this.output variable to an empty string. */
  output = ``;
  /* Creating a map of commands to functions. */
  commandMap = {
    CREATE: this.createFolder.bind(this),
    MOVE: this.moveFolder.bind(this),
    DELETE: this.deleteFolder.bind(this),
    LIST: this.listFolders.bind(this),
  };
  /**
   * Init function
   * @param input - The input string that contains the commands to be executed.
   * @returns The this.output of the commands
   */
  runDirectories() {
    /* Initializing the this.output variable to an empty string. */
    this.output = "";
    console.log("[✔] Reading entry file: \n" + this.inputFile);
    console.log("-----------------------------------");
    /* Splitting the input string into an array of commands. */
    const commands = this.inputFile.split("\n");
    /* A forEach loop that is iterating over the commands array. */
    commands.forEach((inst) => {
      this.output += inst + "\n";
      const splittedCmds = inst.split(" ");
      const cmd = splittedCmds[0];
      const path = splittedCmds[1];
      const commandFound = this.commandMap[cmd.toUpperCase()];
      if (!commandFound) {
        this.output += "Command not found \n";
        return;
      }
      if (cmd === constants.MOVE) {
        commandFound(path, splittedCmds[2]);
      } else {
        commandFound(path);
      }
    });
    console.log("[✔] this.output file:");
    console.log("-----------------------------------");
    console.log(this.output);
    return this.output;
  }

  /**
   * It creates a new folder in the current directory if the folder name doesn't already exist and if the
   * path to the folder exists
   * @param pathName - The path of the folder to be created.
   */
  createFolder(pathName) {
    const pathArray = pathName.split("/");
    const folder = pathName.substring(0, pathName.lastIndexOf("/"));
    const name = pathArray[pathArray.length - 1];
    this.mapDirectories[!!folder ? `${folder}/${name}` : name] = name;
  }

  /**
   * It's moving a folder to another folder
   * @param folder - The folder that you want to move.
   * @param destiny - The destiny folder.
   * @param [splitFolder=true] - It's a boolean that's used to check if the folder has more than one
   * slash in it, and if it does, it's splitting the folder into an array of strings, and then it's
   * taking the last item in the array, which is the folder name, and then it's moving the
   */
  moveFolder(folder, destiny, splitFolder = true) {
    const childs = this.getChildsByFolder(folder);
    if (childs.length) {
      childs.forEach((item) => {
        this.moveFolder(item, destiny, false);
      });
    }
    if (folder.split("/").length > 1 && splitFolder) {
      const splittedFolder = folder.split("/");
      const lastFolder = splittedFolder[splittedFolder.length - 1];
      this.mapDirectories[`${destiny}/${lastFolder}`] = folder;
    } else {
      this.mapDirectories[`${destiny}/${folder}`] = folder;
    }
    delete this.mapDirectories[folder];
  }

  /**
   * It deletes a folder and all its childs
   * @param folder - The folder to delete.
   * @returns the this.output variable.
   */
  deleteFolder(folder) {
    const splittedFolder = folder.split("/");
    const destiny = splittedFolder[0];
    if (!this.mapDirectories[folder]) {
      this.output += `Cannot delete ${folder} - ${destiny} does not exist\n`;
      return;
    }
    const childs = this.getChildsByFolder(folder);
    if (childs.length) {
      childs.forEach((item) => {
        this.deleteFolder(item);
      });
    }
    delete this.mapDirectories[folder];
  }

  /**
   * It takes the map of directories and creates a tree structure out of it
   */
  listFolders() {
    let tree = {};
    /* Sorting the array of keys in the mapDirectories object. */
    const sortedArray = Object.keys(this.mapDirectories).sort((a, b) => {
      const splitA = a.split("/");
      const splitB = b.split("/");
      if (splitA.length > 1) a = splitA[splitA.length - 1];
      if (splitB.length > 1) b = splitB[splitB.length - 1];
      return a <= b ? -1 : 1;
    });
    sortedArray.forEach((folder) => {
      const splitPath = folder.split("/");
      this.mapPathToTree(tree, splitPath);
    });
    this.printTree(tree, 0);
  }

  /**
   * It takes a tree and a path, and maps the path to the tree
   * @param tree - the tree to add the path to
   * @param pathParts - The path parts of the file.
   * @returns the tree object.
   */
  mapPathToTree(tree, pathParts) {
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
    this.mapPathToTree(subTree, pathParts.slice(1));
  }

  /**
   * It takes a tree and a level, and prints the tree with the given level of indentation
   * @param subTree - the current subtree we're looking at
   * @param level - The level of the current subtree.
   */
  printTree(subTree, level) {
    for (const key in subTree) {
      this.output += "  ".repeat(level).concat(key) + "\n";
      this.printTree(subTree[key], level + 1);
    }
  }

  /**
   * It returns an array of all the keys in the this.mapDirectories object that start with the folder name
   * passed in as an argument
   * @param folder - The folder you want to get the childs from.
   * @returns An array of all the keys in the this.mapDirectories object that start with the folder name.
   */
  getChildsByFolder(folder) {
    return Object.keys(this.mapDirectories).filter((item) =>
      item.startsWith(`${folder}/`)
    );
  }
}

/* It's creating a new instance of the Directory class, and it's passing the entryFile as an argument. */
const myDirectory = new Directory(entryFile);
myDirectory.runDirectories();
module.exports = Directory;
