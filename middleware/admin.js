const adminOnly = (req, res, next) => {
  if (req.user.email !== "nivesh.kumar804@gmail.com") {
    return res.status(403).json({
      success: false,
      message: "Admin access denied",
    });
  }

  next();
};

export default adminOnly;