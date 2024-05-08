import { Controller, Get, Query, Post, Body, UseGuards, Req, Param, BadRequestException, Put } from '@nestjs/common';
import { VideoService } from './video.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { videoSchema, commentSchema, ratingSchema } from './video.validation';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  findAll(@Query('search') search: string, @Query('sort') sort: string) {
    return this.videoService.findAllVideos(search, sort);
  }

  @Post('play')
  @UseGuards(JwtAuthGuard)
  playVideo(@Body('videoId') videoId: string, @Req() req: any) {
    return this.videoService.playVideo(videoId, req.user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addVideo(@Body() body: any) {
    const { error } = videoSchema.validate(body);
    if (error) {
      throw new BadRequestException('Validation error', error.details[0].message);
    }
    return this.videoService.addVideo(body);
  }

  @Post(':videoId/comment')
  @UseGuards(JwtAuthGuard)
  addComment(@Param('videoId') videoId: string, @Body() body: any, @Req() req: any) {
    const { error } = commentSchema.validate(body);
    if (error) {
      throw new BadRequestException('Validation error', error.details[0].message);
    }
    return this.videoService.addComment(videoId, req.user.id, body.comment);
  }

  @Put(':videoId/comments/:commentId/update')
  @UseGuards(JwtAuthGuard)
  updateComment(@Param('videoId') videoId: string, @Param('commentId') commentId: string, @Body('comment') newComment: string, @Req() req: any) {
    return this.videoService.updateComment(videoId, commentId, req.user.id, newComment);
  }

  @Post(':videoId/rate')
  @UseGuards(JwtAuthGuard)
  rateVideo(@Param('videoId') videoId: string, @Body() body: any, @Req() req: any) {
    const { error } = ratingSchema.validate(body);
    if (error) {
      throw new BadRequestException('Validation error', error.details[0].message);
    }
    return this.videoService.addRating(videoId, req.user.id, body.rating);
  }

  @Get(':videoId/comments')
  @UseGuards(JwtAuthGuard)
  findAllComments(@Param('videoId') videoId: string, @Query('sort') sort: string) {
    return this.videoService.findAllComments(videoId, sort);
  }

  @Post(':videoId/comments/:commentId/reply')
  @UseGuards(JwtAuthGuard)
  replyToComment(@Param('videoId') videoId: string, @Param('commentId') commentId: string, @Body('reply') reply: string, @Req() req: any) {
    return this.videoService.replyToComment(videoId, commentId, req.user.id, reply);
  }
}
