import { Schema, Document, model } from 'mongoose';

export interface Reply {
  userId: string;
  reply: string;
  createdAt: Date;
}

export interface Comment extends Document {
  userId: string;
  comment: string;
  createdAt: Date;
  replies: Reply[];
}

export interface Rating {
  userId: string;
  rating: number;
  createdAt: Date;
}

export interface VideoDocument extends Document {
  title: string;
  description: string;
  duration: number;
  ageRestriction: string;
  averageRating: number;
  url: string;
  comments: Comment[];
  ratings: Rating[];
}

const ReplySchema = new Schema<Reply>({
  userId: { type: String, required: true },
  reply: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const CommentSchema = new Schema<Comment>({
  userId: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: { type: [ReplySchema], default: [] }
});

const RatingSchema = new Schema<Rating>({
  userId: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const VideoSchema = new Schema<VideoDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  ageRestriction: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  url: { type: String, required: true },
  comments: { type: [CommentSchema], default: [] },
  ratings: { type: [RatingSchema], default: [] }
});

export const VideoModel = model<VideoDocument>('Video', VideoSchema);

export { VideoSchema };
