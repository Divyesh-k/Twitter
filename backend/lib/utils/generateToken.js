const jwt = require("jsonwebtoken");

 const generateTokenAndSetCookie = (userId,res) =>{

    const token = jwt.sign({userId},process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,  // prevent XSS atacks cross-site scripting attacks
        maxAge: 15 * 24 * 60 * 60 * 1000,  // MS
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
    

}


module.exports = {
    generateTokenAndSetCookie,
}
