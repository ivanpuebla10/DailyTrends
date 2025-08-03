import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFeed extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  summary?: string;
  author?: string;
  publicationDate: Date;
  creationDate: Date;
  url: string;
  source: string;
  imageUrl?: string;
}

const FeedSchema: Schema = new Schema<IFeed>({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  summary: { type: String },
  author: { type: String },
  source: { type: String, required: true },
  url: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  creationDate: { type: Date, default: Date.now },
  imageUrl: { type: String },
});

FeedSchema.pre('save', function (this: IFeed, next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
  next();
});

export default mongoose.model<IFeed>('Feed', FeedSchema);
