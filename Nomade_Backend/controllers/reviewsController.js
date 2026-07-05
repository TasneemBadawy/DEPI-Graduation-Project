import { createReview , getReviewsByPlace , getReviewsByUserId , deleteReview , getReviewById} from '../models/reviewModel.js';

// add a review
export const addReview = async(req , res) =>{
  const{User_ID, Place, Title, Rate, username, Content}= req.body;
       if (!Content) {
         return res.status(400).json({
         message: "Review content is required"
        });
      }

      if (Rate < 1 || Rate > 5) {
      return res.status(400).json({
        message: "Rate must be between 1 and 5"
    });
} 


  try{
     await createReview(User_ID, Place, Title, Rate, username, Content);

      res.status(201).json({
      message: "Review created successfully",
    });

  }catch (err) {
        console.log(err);

    res.status(500).json({
        error: err.message,
        message: "can't be added"
    });

  }
};

export const getReviewsWithUserId = async(req,res)=>{

  const{id} = req.params;

  try{
     const review = await getReviewsByUserId(id);

     res.status(200).json(review);
   console.log(review);
  }catch(err){

    res.status(500).json({
            error: err.message
        });

  }

};

export const getReviewsWithPlace = async(req , res) =>{
      
  const {place} = req.params;

  try{
     const review = await getReviewsByPlace(place);

     res.status(200).json(review);
  } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};

export const RemoveReview = async(req , res)=>{

       const {id} = req.params;

       try{
          // get the review first

          const review = await getReviewById(id);

          if( review.length === 0){
              return res.status(404).json({
                 message: "Review not found"
              });
          }

          // check ownership

          /*if(review[0].User_ID !== req.id){

               return res.status(403).json({
                message: "You are not allowed to delete this review"
                });
          }*/

          // Delete

          await deleteReview(id);

          res.status(200).json({
             message :"Review deleted successfully"
          });

       }catch (err) {

        res.status(500).json({
            error: err.message
        });

    }


}