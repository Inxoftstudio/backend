const {commentSchema,commentByIdSchema} = require("../schema/comment");
const Comment = require("../models/comment");
const CommentDTO = require("../dto/comment");

const CommentController = {
    async create(req, res, next) {

        const { error } = commentSchema.validate(req.body);
      
        if (error) {
            return next(error)
        }

        const { author, blog, content } = req.body;

        try {
            const newComment = new Comment({
                author, blog, content
            })

            await newComment.save()

        } catch (error) {
            return next(error)
        }

        return res.status(201).json({ message: "Comment Created successfully!" })

    },

    async getById(req, res, next) {
      
        const { error } = commentByIdSchema.validate(req.params);
      
        if (error) {
            return next(error)
        }

        const {id} = req.params;

        let comments;

        try {
            comments = await Comment.find({ blog: id }).populate("author")
        } catch (error) {
            return next(error)
        }   

        let commentsDto = [];

        for( let i = 0; i < comments.length; i++){
            const Obj = new CommentDTO(comments[i]);
            commentsDto.push(Obj)
        }

        return res.status(201).json({ data: commentsDto })

    }
}


module.exports = CommentController;