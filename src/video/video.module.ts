import { Schema, model } from 'mongoose';

const CommentSchema = new Schema({
    userId: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }]
});

const RatingSchema = new Schema({
    userId: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const VideoSchema = new Schema({
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    ageRestriction: { type: String, required: true },
    averageRating: { type: Number, default: 0 },
    url: { type: String, required: true },
    comments: [CommentSchema],
    ratings: [RatingSchema],
}, { timestamps: true });

export const VideoModel = model('Video', VideoSchema);
