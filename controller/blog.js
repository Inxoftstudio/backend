const {createBlogSchema, getByIdSchema, updateBlogSchema, deleteBlogSchema} = require("../schema/blog");
const fs = require("fs");
const Blog = require("../models/blog");
const { CLOUD_NAME, API_KEY, API_SECRET } = require("../config");
const BlogDTO = require("../dto/blog");
const BlogDetailsDTO = require("../dto/blog-detail");
const Comment = require("../models/comment");
const cloudinary = require("cloudinary").v2;






// Configuration
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});




const blogController = {

    async create(req,res,next){
        const {error} = createBlogSchema.validate(req.body)

        if(error){
            return next(error);
        }

        const {title, author, content, photo} = req.body;

        try {
            response = await cloudinary.uploader.upload(photo);
        } catch (error) {
            return next(error);
        }

        let newBlog;
        try {
            newBlog = new Blog({
                title,
                author,
                content,
                photoPath: response.url,
            })

            await newBlog.save()

        } catch (error) {
            return next(error)
        }
        const blogBto = new BlogDTO(newBlog)
        res.status(201).json({blog: blogBto})

    },

    async getAll(req,res,next){
        try {
            const blogs = await Blog.find({});
            const blogsDto = [];

            for(let i=0; i < blogs.length; i++){
                const dto = new BlogDTO(blogs[i]);
                blogsDto.push(dto);
            }

            return res.status(200).json({blogs: blogsDto});

        } catch (error) {
            return next(error);
        }
    },

    async getById(req,res,next){
        const {error} = getByIdSchema.validate(req.params);

        if(error){
            return next(error)
        }

        let blog;

        const {id} = req.params;

        try {
            blog = await Blog.findOne({_id: id}).populate("author")
        } catch (error) {
            return next(error)
        }

        const blogDto = new BlogDetailsDTO(blog);

        res.status(200).json({blog: blogDto})

    },

    async update(req,res,next){

        const { error } = updateBlogSchema.validate(req.body);

        const { title, content, author, blogId, photo } = req.body;
    
        let blog;

        try {
            blog = await Blog.findOne({ _id: blogId });
          } catch (error) {
            return next(error);
          }
      
        if (photo) {
   
            let response;
            try {
                response = await cloudinary.uploader.upload(photo);
            } catch (error) {
                return next(error);
            }

            await Blog.updateOne({ _id: blogId}, 
                {
                    title, 
                    content, 
                    photoPath: response.url,
                }
            )
        }

        else {
            await Blog.updateOne({ _id: blogId }, { title, content });
          }
      
        return res.status(200).json({ message: "Blog Updated Successfully!" });

    },
    
    async delete(req,res,next){
        const {error} = deleteBlogSchema.validate(req.body)

   
        const {id} = req.params;
        try {
            await Blog.deleteOne({_id: id});
            await Comment.deleteMany({blog: id });
        } catch (error) {
            return next(error)
        }

        return res.status(200).json({ message: "Blog Deleted Successfully!"})

    },

}

module.exports = blogController;