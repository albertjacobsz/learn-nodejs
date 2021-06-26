/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const Tour = require('../models/tourModels');
const APIFeatures = require("../utils/apiFeatures");
const createAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.aliasTopTours = (req, res, next) =>{
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
  next(); 
}


exports.getAllTours = createAsync( async (req, res,next) => {
    //execute
    const features = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: req.requestTime,
      data : {
        tours
      }
    });
});
exports.getTour = createAsync(async (req, res,next) => {
    const tour = await Tour.findById(req.params.id);
    if(!tour){
      return next(new AppError('Tour not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        tours: tour,
      },
    });
});
exports.createNewTour = createAsync (async (req, res,next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      // eslint-disable-next-line prettier/prettier
      status: 'success',
      data: {
        tour: newTour
      },
    });
});
exports.updateNewTour = createAsync(async (req, res,next) => {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new: true,
      runValidators: true
    });
    if(!tour){
      return next(new AppError('Tour not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        updatedTour 
      },
    });
});
exports.deleteTour = createAsync(async (req, res,next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour){
      return next(new AppError('Tour not found', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
exports.getTourStats = createAsync (async (req, res,next) =>{
    const stats = await Tour.aggregate([
      {
        $match: {ratingsAverage: {$gte : 4.5}}
      },
      {
        $group: {
          _id: '$difficulty',
          num: {$sum: 1},
          numRatings: { $sum: '$ratingsQuantity'},
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: {$avg: '$price'},
          minPrice: {$min: '$price'},
          maxPrice: {$max: '$price'}
        }
      },
      {
        $sort: {
          avgPrice: 1
        }
      },
      //{
        //$match: {_id: {$ne: 'easy'}}
      //}
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats 
      },
    });
});
exports.getMonthlyPlan = createAsync(async (req,res,next)=>{
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },{
        $group: {
          _id:{
            $month: '$startDates'
          },
          numTourStarts: {$sum: 1},
          tours: {$push: '$name'}
        }
      },
      {
        $addFields:{
          month: '$_id'
        }
      },
      {
        $project:{
          _id:0
        }
      },
      {
        $sort:{
          numTourStarts: -1
        }
      },
      {
        $limit:12
      }
  ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan 
      },
    });
});
