import { Schema } from "mongoose"
import categoryList from '../post.constants'


type TCategoryList = typeof categoryList 

type TPost = {
    userId : Schema.Types.ObjectId ,
    title: string ,
    description: string ,
    images : string [],
    categories : TCategoryList ,
    premium?:false
    
}



export default TPost