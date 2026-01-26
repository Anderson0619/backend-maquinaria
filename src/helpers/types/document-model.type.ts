import { Document, Model as MongooseModel } from "mongoose";

type DocumentModel<ModelDocument extends Document, ModelType> = Omit<
  MongooseModel<ModelDocument>,
  "new"
> & {
  new (doc: ModelType): ModelDocument;
};

export default DocumentModel;
