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

export class FileSystem {
  private root: Directory;
  private pwd: Directory;
  FILESYSTEM_SIZE = 70_000_000;

  constructor(file: string) {
    const commands = fs.readFileSync(file, "utf8").split("\n");
    this.root = { name: "/", files: [], parent: null, subdirs: [] };
    this.pwd = this.root;
    this.processCommands(commands);
  }

  private processCommands(commands: string[]) {
    commands.forEach((command) => {
      this.processCommand(command, this.pwd, this.root);
    });
    this.pwd = this.root;
  }

  private processCommand(command: string, pwd: Directory, root: Directory) {
    const cmd = command.split(" ");
    switch (cmd[0]) {
      case "dir":
        const newFolder = {
          name: cmd[1],
          files: [],
          parent: pwd,
          subdirs: [],
        };
        this.pwd.subdirs.push(newFolder);
        break;
      case cmd[0].match(/\d+/)?.input:
        const newFile = { dir: pwd, name: cmd[1], size: parseInt(cmd[0]) };
        this.pwd.files.push(newFile);
        break;
      case "$":
        if (cmd[1] === "cd") {
          switch (cmd[2]) {
            case "..":
              this.pwd = pwd.parent ?? pwd;
              break;
            case "/":
              this.pwd = root;
              break;
            default:
              this.pwd = pwd.subdirs.find((dir) => dir.name === cmd[2]) ?? pwd;
          }
        }
        break;
      default:
        break;
    }
  }

  public dirSize(dir: Directory): number {
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

  private getFilesRecursiveFlat(dir: Directory): File[] {
    const currentDirFiles = dir.files;
    const childFiles = dir.subdirs
      .map((dir) => this.getFilesRecursiveFlat(dir))
      .flat();
    return [...currentDirFiles, ...childFiles];
  }

  public getSpaceUsed(dir: Directory = this.root) {
    const files = this.getFilesRecursiveFlat(dir);
    return files.reduce((acc, cur) => acc + cur.size, 0);
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

  public findSmallDirs(maxSize: number = 100_000) {
    const smallDirs = this.getDirsRecursiveFlat().filter(
      (dir) => this.dirSize(dir) < maxSize
    );
    return smallDirs.reduce((acc, cur) => acc + this.dirSize(cur), 0);
  }

  public printDir(dir: Directory = this.root, depth = 0, output = ""): string {
    const sortedSubfolders = dir.subdirs.sort((a, b) =>
      a.name < b.name ? -1 : 1
    );
    const sortedSubfiles = dir.files.sort((a, b) => (a.name < b.name ? -1 : 1));
    output += `${"  ".repeat(depth)}- ${dir.name} (dir)\n`;
    sortedSubfiles.forEach(
      (file) =>
        (output += `${"  ".repeat(depth + 1)}- ${file.name} (file, size=${
          file.size
        })\n`)
    );
    sortedSubfolders.forEach(
      (folder) => (output += this.printDir(folder, depth + 1))
    );
    return output;
  }
}

export function solve07a(fileSystem: FileSystem) {
  const smallFileSum = fileSystem.findSmallDirs();
  return smallFileSum;
}

export function solve07b(fileSystem: FileSystem) {
  const dirToDelete = fileSystem.getSmallestDirToDelete(
    30_000_000
  ) as Directory;
  return fileSystem.dirSize(dirToDelete);
}

const fileSystem = new FileSystem("07/input.txt");
console.log(solve07a(fileSystem));
console.log(solve07b(fileSystem));
