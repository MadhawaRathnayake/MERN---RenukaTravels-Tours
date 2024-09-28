export const test  = (req, res) => {
    res.json({message: "Api is working!"});
};

export const signout = (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json('User signed out successfully');
    } catch (error) {
        next(error);
    }
};