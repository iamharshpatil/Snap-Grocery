const resultArray = await productModel.aggregate([
        {
          $group: {
            _id: "$category",  // Group by the category field
            products: { $push: "$$ROOT" }  // Push all product details into an array
          }
        },
        {
          $project: {
            _id: 0,  // Exclude the _id field
            category: "$_id",  // Rename _id to category
            products: { $slice: ["$products", 10] }  // Limit to first 10 products per category
          }
        }
      ]);

      const resultObject=resultArray.reduce((acc,item)=>{
        acc[item.category]=item.products;
        return acc;
      },{});