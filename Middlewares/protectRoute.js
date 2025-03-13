import jwt from "jsonwebtoken";
const protectRoute = (...roles) => {
  return (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ message: "Unauthorized - No Token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

      if (roles.length && !roles.includes("admin")) {
        return res.status(403).json({
          message:
            "Forbidden - You do not have permission to access this resource",
        });
      }
      req.user = decoded.user_id;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    s;
  };
};
export default protectRoute;
