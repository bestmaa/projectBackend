export default errorCatchAsync=>(req,res,next)=>{
   Promise.resolve(errorCatchAsync(req,res,next)).catch(next)
}
// export default function theFunction(cl){
//     cl((req,res,next)=>{
//         Promise.resolve(theFunction(req,res,next)).catch(next)
//     })
// }

