module.exports = func => {
    return (req,res,next) => {
        func(req,res,next).catch(next);
    } //this passes a function to our custom error handler
} //if func gets an error it will be passed to next()

