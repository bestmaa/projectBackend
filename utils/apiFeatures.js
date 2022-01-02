class Apifeatures{
    constructor(query,querystr){
        this.query=query; 
        this.querystr=querystr
    }
    search(){
        const keyword=this.querystr.name?{
            name:{
                $regex:this.querystr.name,
                $options:'i'
            }
        }:{}
        this.query=this.query.find({...keyword})
        return this;
    }
    filter(){
        const queryCopy={...this.querystr}
        const removeFields=["name","page","limit"]
        removeFields.forEach(value=> delete queryCopy[value])
        // filter for price
        console.log(queryCopy);
        let queryString =JSON.stringify(queryCopy)
        queryString=queryString.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)
        this.query=this.query.find(JSON.parse(queryString))
        return this
    }
    pagination(perPage){
        const currentPage=Number(this.querystr.page)||1
        const skip=perPage*(currentPage-1)
        this.query=this.query.limit(perPage).skip(skip)
        return this
    }
    

}
export default Apifeatures