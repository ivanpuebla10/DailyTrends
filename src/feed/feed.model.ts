import mongoose, { Document, Schema } from 'mongoose';

export interface IFeed extends Document {
  title: string;
  summary: string;
  source: string;
  publicationDate: Date;
  creationDate: Date;
}

const FeedSchema: Schema = new Schema<IFeed>({
  title: { type: String, required: true },
  summary: { type: String },
  source: { type: String, enum: ['El País', 'El Mundo', 'Custom'], required: true },
  publicationDate: { type: Date, required: true },
  creationDate: { type: Date, default: Date.now },
});

export default mongoose.model<IFeed>('Feed', FeedSchema);
