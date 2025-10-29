export const updateProductImages = async (req,res)=>{

        const productId = req.params.productId;

        console.log(req.files , productId)
        console.log(req.body.existingimageUrls, "formdata data body ")
    return res.status(200).json({message:"update product images controller works" , productId})




}