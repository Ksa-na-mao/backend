import BadRequest from "@/core/Errors/BadRequest";
import Services from "@/core/Services/Services";
import dataSource from "@models/index.ts";

const Comment = dataSource["Comment"];
const Recipe = dataSource["Recipe"];

class CommentService extends Services{
    constructor(){
        super("Comment")
    }
        async commentInARecipe(message:string, userId:number, recipeId:number, picture:string){
            const recipeExists = await Recipe.findOne({where:{id:recipeId}})
            if(!recipeExists){
                throw new BadRequest("Essa receita não existe.")
            }
            const comment = await Comment.create({text: message, picture:picture, userId:userId, recipeId:recipeId})
            return comment
        }
}

export default CommentService