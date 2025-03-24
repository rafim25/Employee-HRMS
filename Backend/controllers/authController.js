export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: { email }
        });
        
        // ... your password verification logic ...

        // Set session
        req.session.userId = user.user_id;
        
        res.status(200).json({
            msg: "Login successful",
            user: {
                id: user.user_id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}; 