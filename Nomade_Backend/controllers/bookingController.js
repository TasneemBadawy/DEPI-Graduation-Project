import { findGuideById , checkExistingBooking , createBooking , getBookingsByUserId ,getBookingById ,  deleteBooking } from "../models/bookingModel.js";

// add a booking
export const addBooking = async (req , res) =>{
    const{User_ID , Guide_ID} = req.body;

    try{
        const guide = await findGuideById(Guide_ID);

        if(guide.length === 0){
            return res.status(404).json({
                message :"Guide not found"
            });
        }
        const existingBooking = await checkExistingBooking(User_ID, Guide_ID);

            if (existingBooking.length > 0) {
               return res.status(400).json({
               message: "You already booked this guide"
                });
            }

        await createBooking(User_ID , Guide_ID);

        res.status(201).json({
            message:"booking added successfully"
        });
    }catch (err){
         res.status(500).json({
            message:err.message
         });
    }
};

export const getUserBookings = async(req , res) =>{
        const{id} = req.params;

        try{
            const bookings = await getBookingsByUserId(id);

             res.status(200).json(bookings);
        }catch(err){
                res.status(500).json({
                  error: err.message,
                  message: "can't be getted"
                });
        }
};

export const removeBooking = async(req , res) =>{
      const {id} = req.params;

      try{
        const booking = await getBookingById(id);

         if(booking.length === 0){
               return res.status(404).json({
                 message: "booking not found"
              });
         }

        await deleteBooking(id);

              res.status(200).json({
               message :"booking deleted successfully"
               });      
      }catch(err){
         res.status(500).json({
            error: err.message
         });
      }
};