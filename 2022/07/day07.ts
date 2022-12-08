import fs from "fs";

type File = {
  dir: Directory;
  name: string;
  size: number;
};

type Directory = {
  name: string;
  files: File[];
  parent: Directory | null;
  subdirs: Directory[];
};

class FileSystem {
  root: Directory;
  pwd: Directory;
  FILESYSTEM_SIZE = 70_000_000;

  constructor(file: string) {
    const commands = fs.readFileSync(file, "utf8").split("\n");
    this.root = { name: "/", files: [], parent: null, subdirs: [] };
    this.pwd = this.root;
    this.processCommands(commands);
    this.printDir(this.root);
  }

  private processCommands(commands: string[]) {
    commands.forEach((command) => {
      this.processCommand(command, this.pwd, this.root);
      console.log("command: " + command);
    });
    this.pwd = this.root;
  }

  private processCommand(command: string, pwd: Directory, root: Directory) {
    console.log("processing", command, pwd.name, root.name);
    const cmd = command.split(" ");
    switch (cmd[0]) {
      case "dir":
        // create a new subfolder
        const newFolder = {
          name: cmd[1],
          files: [],
          parent: pwd,
          subdirs: [],
        };
        this.pwd.subdirs.push(newFolder);
        break;
      case cmd[0].match(/\d+/)?.input:
        // create a new file
        const newFile = { dir: pwd, name: cmd[1], size: parseInt(cmd[0]) };
        this.pwd.files.push(newFile);
        break;
      case "$":
        if (cmd[1] === "ls") {
          break;
        }
        if (cmd[1] === "cd") {
          if (cmd[2] === "..") {
            this.pwd = pwd.parent ?? pwd;
          } else if (cmd[2] === "/") {
            this.pwd = root;
          } else {
            this.pwd = pwd.subdirs.find((dir) => dir.name === cmd[2]) ?? pwd;
            console.log("new pwd", pwd.name);
          }
        }
        break;
      default:
        break;
    }
  }

  public dirSize(dir: Directory) {
    const files = this.getFilesRecursiveFlat(dir);
    const size = files.reduce((acc, cur) => acc + cur.size, 0);
    return size;
  }

  private getDirsRecursiveFlat(dir: Directory = this.root): Directory[] {
    const currentDir = dir;
    const childDirs: Directory[] = dir.subdirs
      .map((dir) => this.getDirsRecursiveFlat(dir))
      .flat();
    return [currentDir, ...childDirs];
  }

  private getFilesRecursiveFlat(dir: Directory) {
    // get files
    const currentDirFiles = dir.files;
    const childFiles = dir.subdirs
      .map((dir) => this.getFilesRecursiveFlat(dir))
      .flat() as File[];
    return [...currentDirFiles, ...childFiles];
  }

  public getSmallestDirToDelete(requiredSpace: number): Directory | undefined {
    const freeSpace = this.FILESYSTEM_SIZE - this.getSpaceUsed();
    const needToClear = requiredSpace - freeSpace;
    const dirs = this.getDirsRecursiveFlat();
    const dirToDelete = dirs
      .filter((dir) => this.dirSize(dir) >= needToClear)
      .sort((a, b) => this.dirSize(a) - this.dirSize(b))
      .shift();
    return dirToDelete;
  }

  public getSpaceUsed(dir: Directory = this.root) {
    const files = this.getFilesRecursiveFlat(dir);
    const usedSpace = files.reduce((acc, cur) => acc + cur.size, 0);
    return usedSpace;
  }

  // TODO use orderDirsBySize for this & below
  public findSmallDirs() {
    const smallDirs = [] as { dir: Directory; size: number }[];
    this.findSmallDirsRecursive(this.root, smallDirs);
    console.log(
      `--fsd done, dirs: ${smallDirs.map((dir) => dir.size).join(",")}`
    );
    return smallDirs.reduce((acc, cur) => acc + cur.size, 0);
  }

  // TODO use orderDirsBySize for this
  private findSmallDirsRecursive(
    dir: Directory,
    smallDirs: { dir: Directory; size: number }[]
  ) {
    // TODO: count dir size recursively instead!
    console.log(`--fsdr - dir: ${dir.name}, smallDirs: ${smallDirs}`);
    const size = this.dirSize(dir);
    if (size <= 100000) {
      smallDirs.push({ dir, size });
    }
    dir.subdirs.forEach((dir) => this.findSmallDirsRecursive(dir, smallDirs));
  }

  // TODO: port generation to the class

  public printDir(dir: Directory = this.root, depth = 0) {
    const sortedSubfolders = dir.subdirs.sort((a, b) =>
      a.name < b.name ? -1 : 1
    );
    const sortedSubfiles = dir.files.sort((a, b) => (a.name < b.name ? -1 : 1));
    console.log(`${"  ".repeat(depth)}- ${dir.name} (dir)`);
    sortedSubfiles.forEach((file) =>
      console.log(
        `${"  ".repeat(depth + 1)}- ${file.name} (file, size=${file.size})`
      )
    );
    sortedSubfolders.forEach((folder) => this.printDir(folder, depth + 1));
  }
}

export function solve07a(file: string) {
  const inputA = new FileSystem(file);
  const smallFileSum = inputA.findSmallDirs();
  return smallFileSum;
}

export function solve07b(file: string) {
  const inputB = new FileSystem(file);
  const dirToDelete = inputB.getSmallestDirToDelete(30_000_000);
  console.log(inputB.dirSize(dirToDelete));
}

console.log(solve07a("07/input.txt"));
solve07b("07/input.txt");

/**
 * TODO: clean this up & write tests
 */
