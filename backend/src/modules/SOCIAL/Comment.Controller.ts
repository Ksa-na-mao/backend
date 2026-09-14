import {Request, Response, NextFunction} from "express"
import Controller from "@/core/Controller/Controller";
import CommentService from "./Comment.Service.ts"
const commentService = new CommentService()


class CommentController extends Controller{
    constructor(){
        super(commentService)
    }
    async commentInARecipe(req:Request, res:Response, next:NextFunction){
        try {
            const {text, picture} = Request.body
            const userId = req.user.userId
            const recipeId = req.params.recipeId
            const comment = await commentService.commentInARecipe(text, userId, recipeId, picture)
            return comment
        } catch (error) {
            next(error)
        }
        
    }
}

export default CommentController