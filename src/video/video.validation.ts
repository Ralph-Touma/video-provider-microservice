import * as Joi from 'joi';

export const videoSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  duration: Joi.number().required(),
  ageRestriction: Joi.string().valid('PG', 'PG13', 'PG16', 'R').required(),
  averageRating: Joi.number().min(1).max(5)
});

export const commentSchema = Joi.object({
  comment: Joi.string().required()
});

export const ratingSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required()
});
