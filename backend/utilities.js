const jwt = require('jsonwebtoken')


function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No token provided or incorrect format");
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];  // Extract the token after "Bearer"
    //console.log("Extracted Token:", token);  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("Access Token:", process.env.ACCESS_TOKEN_SECRET);
            console.log("Token verification failed:", err.message);
            console.log(jwt.decode(token));
            return res.status(401).json({ error: "Invalid token" });
        }
        req.user = user;
        // console.log(req.user);
        
        next();
    });
}



module.exports = {
    authenticateToken,
}

