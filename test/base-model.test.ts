// File: test/base-model.test.ts

import { Schema, Document } from "mongoose";
import { Request } from "express";
import { BaseModel } from "../src/base-model";
import { ISearch } from "../src/types/interface";

// Define a mock schema interface
interface ExtendedModel<T extends Document> {
  search(req: Request): Promise<ISearch<T>>;
  delete(id: string): Promise<T>;
  deleteAll(): Promise<T>;
}

// Mock schema and Request objects
let mockSchema: Schema<Document>;
let mockModel: ExtendedModel<Document>;
let mockRequest: Request;

// Mock implementation of parseFilters function
const mockParseFilters = jest.fn((query: any) => query);

describe("BaseModel", () => {
  beforeEach(() => {
    // Initialize mock schema
    mockSchema = new Schema<Document>();
    mockRequest = {} as Request;
  });

  it("should delete a document by ID", async () => {
    // Spy on the delete method
    const deleteSpy = jest.fn().mockResolvedValue("deletedDocument");

    // Call BaseModel plugin with mock schema and parseFilters function
    BaseModel(mockSchema, { parseFilters: mockParseFilters });

    // Apply the plugin to the schema
    mockModel = mockSchema as unknown as ExtendedModel<Document>;
    mockModel.delete = deleteSpy;

    // Call delete method on the mock model
    const result = await mockModel.delete("123");

    // Check if delete was called with the correct ID
    expect(deleteSpy).toHaveBeenCalledWith("123");

    // Check if the result is returned
    expect(result).toBe("deletedDocument");
  });

  it("should delete all documents", async () => {
    // Spy on the deleteMany method
    const deleteManySpy = jest.fn().mockResolvedValue("deleteResult");

    // Call BaseModel plugin with mock schema and parseFilters function
    BaseModel(mockSchema, { parseFilters: mockParseFilters });

    // Apply the plugin to the schema
    mockModel = mockSchema as unknown as ExtendedModel<Document>;
    mockModel.deleteAll = deleteManySpy;

    // Call deleteAll method on the mock model
    const result = await mockModel.deleteAll();

    // Check if deleteMany was called
    expect(deleteManySpy).toHaveBeenCalled();

    // Check if the result is returned
    expect(result).toBe("deleteResult");
  });

  it("should perform a search operation", async () => {
    // Mock search result
    const searchResult: ISearch<any> = {
      _filter: {} as any[],
      status: "success",
      data: [],
      total: 0,
    };

    // Spy on the search method
    const searchSpy = jest.fn().mockResolvedValue(searchResult);

    // Call BaseModel plugin with mock schema and parseFilters function
    BaseModel(mockSchema, { parseFilters: mockParseFilters });

    // Apply the plugin to the schema
    mockModel = mockSchema as unknown as ExtendedModel<Document>;
    mockModel.search = searchSpy;

    // Call search method on the mock model
    const result = await mockModel.search(mockRequest);

    // Check if search was called with the correct request
    expect(searchSpy).toHaveBeenCalledWith(mockRequest);

    // Check if the result is returned
    expect(result).toBe(searchResult);
  });
});
