const Directory = require("../../index");
const mockDataInput = require("../mock/directories-input");
const mockDataOutput = require("../mock/directories-output");
const mockDataInvalidCommand = require("../mock/directories-invalid-commands-input");
describe("Index test", () => {
  it("Should return exact output lines", () => {
    const directoryTest = new Directory(mockDataInput);
    const result = directoryTest.runDirectories();
    expect(result).toContain(mockDataOutput);
  });

  it("Should return a exactly quantities of commands", () => {
    const directoryTest = new Directory(mockDataInput);
    const result = directoryTest.runDirectories();

    // Input quantities
    const inputCreateQty = (result.match(/CREATE/g) || []).length;
    const inputMoveQty = (result.match(/MOVE/g) || []).length;
    const inputDeleteQty = (result.match(/DELETE/g) || []).length;
    const inputListQty = (result.match(/LIST/g) || []).length;

    // Output quantities
    const outputCreateQty = (mockDataOutput.match(/CREATE/g) || []).length;
    const outputMoveQty = (mockDataOutput.match(/MOVE/g) || []).length;
    const outputListQty = (mockDataOutput.match(/LIST/g) || []).length;
    const outputDeleteQty = (mockDataOutput.match(/DELETE/g) || []).length;

    expect(inputCreateQty).toBe(outputCreateQty);
    expect(inputMoveQty).toBe(outputMoveQty);
    expect(inputListQty).toBe(outputListQty);
    expect(inputDeleteQty).toBe(outputDeleteQty);
  });

  it("Should return a line with Command not found", () => {
    const directoryTest = new Directory(mockDataInvalidCommand);
    const result = directoryTest.runDirectories();
    expect(result).toContain("Command not found");
  });
});
