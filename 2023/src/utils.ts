declare global {
  interface Array<T> {
    sum(): T;
  }
}

Array.prototype.sum = function () {
  if (this.length === 0) {
    throw new Error("Array is empty");
  }

  const firstItem = this[0];
  if (typeof firstItem === "number") {
    return this.reduce((acc, val) => acc + val, 0);
  } else if (typeof firstItem === "string") {
    return this.reduce((acc, val) => acc + val, "");
  } else {
    throw new Error("Unsupported array type");
  }
};
