import Feed, { IFeed } from './feed.model';

export async function create(data: IFeed) {
  const feed = new Feed(data);
  return feed.save();
}

export async function getAll() {
  return Feed.find().sort({ publicationDate: -1 }).limit(10);
}

export async function getById(id: string) {
  return Feed.findOne({ id });
}

export async function updateById(id: string, data: Partial<IFeed>) {
  return Feed.findOneAndUpdate({ id }, data, { new: true });
}

export async function deleteById(id: string) {
  return Feed.findOneAndDelete({ id });
}

export async function getTopFeedsBySource(source: string, limit = 5): Promise<IFeed[]> {
  return Feed.find({ source }).sort({ publicationDate: -1 }).limit(limit).exec();
}
