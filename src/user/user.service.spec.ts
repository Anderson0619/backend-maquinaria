export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

export const mockRepository = jest.fn(() => ({
  findOne: jest.fn(entity => entity),
  save: jest.fn(entity => entity),
  create: jest.fn(entity => entity),
  metadata: {
    columns: [],
    relations: [],
  },
}));

export const mockCommonService = jest.fn(() => ({
  sendEmail: jest.fn(entity => true),
  upload: jest.fn(entity => true),
}));
