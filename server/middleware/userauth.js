import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json({ success: false, message: 'Unauthorized login again' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id) {
            req.body.userId = decoded.id;
            
        } else {
            return res.json({ success: false, message: 'Unauthorized login again' });   
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: 'Unauthorized login again' });
    }
}
