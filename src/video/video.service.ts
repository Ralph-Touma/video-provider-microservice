import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VideoDocument, Comment, Rating } from './video.schema';

@Injectable()
export class VideoService {
  constructor(@InjectModel('Video') private readonly videoModel: Model<VideoDocument>) {}

  async findAllVideos(search: string, sort: string) {
    const pipeline = [];

    if (search) {
      pipeline.push({
        $match: { title: { $regex: search, $options: 'i' } }
      });
    }

    if (sort) {
      pipeline.push({
        $sort: { averageRating: sort === 'desc' ? -1 : 1 }
      });
    }

    return this.videoModel.aggregate(pipeline).exec();
  }

  async playVideo(videoId: string, user: any) {
    const video = await this.videoModel.findById(videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    if (!this.isAgeAppropriate(video.ageRestriction, user.age)) {
      throw new BadRequestException('You are not allowed to watch this video due to age restrictions');
    }

    return { url: video.url };
  }

  async addVideo(body: any) {
    const newVideo = new this.videoModel(body);
    return newVideo.save();
  }

  async addComment(videoId: string, userId: string, comment: string) {
    const video = await this.videoModel.findById(videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    video.comments.push({ userId, comment, createdAt: new Date(), replies: [] } as Comment);
    return video.save();
  }

  async updateComment(videoId: string, commentId: string, userId: string, newComment: string) {
    const video = await this.videoModel.findById(videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const comment = video.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new BadRequestException('Unauthorized update attempt');
    }

    comment.comment = newComment;
    comment.createdAt = new Date(); 

    return video.save();
  }

  async addRating(videoId: string, userId: string, rating: number) {
    const video = await this.videoModel.findById(videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    video.ratings.push({ userId, rating, createdAt: new Date() } as Rating);
    const totalRatings = video.ratings.reduce((sum, r) => sum + r.rating, 0);
    video.averageRating = totalRatings / video.ratings.length;

    return video.save();
  }

  async findAllComments(videoId: string, sort: string) {
    const video = await this.videoModel.findById(videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const comments = video.comments.sort((a, b) => {
      if (sort === 'desc') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return comments;
  }

  async replyToComment(videoId: string, commentId: string, userId: string, reply: string) {
    const video = await this.videoModel.findById(videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const comment = video.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.replies.push({ userId, reply, createdAt: new Date() });
    return video.save();
  }

  private isAgeAppropriate(ageRestriction: string, userAge: number): boolean {
    const ageMap = { 'PG': 0, 'PG13': 13, 'PG16': 16, 'R': 18 };
    return userAge >= ageMap[ageRestriction];
  }
}
