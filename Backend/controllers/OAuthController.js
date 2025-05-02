import Visitor from "../models/Visitor.js";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Google OAuth
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ msg: "Token is required" });
    }

    // Verify the token with Google
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { sub, email, name, picture } = response.data;

    // Check if user already exists
    let visitor = await Visitor.findOne({
      where: {
        oauth_id: sub,
        oauth_provider: 'google'
      }
    });

    if (!visitor) {
      // Create new visitor
      visitor = await Visitor.create({
        visitor_id: `VIS-${uuidv4().substring(0, 8)}`,
        name,
        email,
        profile_picture: picture,
        oauth_id: sub,
        oauth_provider: 'google',
        status: 'active',
        last_login: new Date()
      });
    } else {
      // Update last login
      await visitor.update({
        last_login: new Date(),
        profile_picture: picture // Update profile picture in case it changed
      });
    }

    // Set session
    req.session.visitorId = visitor.visitor_id;

    // Return visitor data
    res.status(200).json({
      visitor_id: visitor.visitor_id,
      name: visitor.name,
      email: visitor.email,
      profile_picture: visitor.profile_picture,
      msg: "Google authentication successful"
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ msg: "Authentication failed", error: error.message });
  }
};

// Facebook OAuth
export const facebookAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ msg: "Token is required" });
    }

    // Verify the token with Facebook
    const response = await axios.get(`https://graph.facebook.com/v12.0/me?fields=id,name,email,picture&access_token=${token}`);
    
    const { id, email, name, picture } = response.data;

    // Check if user already exists
    let visitor = await Visitor.findOne({
      where: {
        oauth_id: id,
        oauth_provider: 'facebook'
      }
    });

    if (!visitor) {
      // Create new visitor
      visitor = await Visitor.create({
        visitor_id: `VIS-${uuidv4().substring(0, 8)}`,
        name,
        email,
        profile_picture: picture?.data?.url,
        oauth_id: id,
        oauth_provider: 'facebook',
        status: 'active',
        last_login: new Date()
      });
    } else {
      // Update last login
      await visitor.update({
        last_login: new Date(),
        profile_picture: picture?.data?.url // Update profile picture in case it changed
      });
    }

    // Set session
    req.session.visitorId = visitor.visitor_id;

    // Return visitor data
    res.status(200).json({
      visitor_id: visitor.visitor_id,
      name: visitor.name,
      email: visitor.email,
      profile_picture: visitor.profile_picture,
      msg: "Facebook authentication successful"
    });
  } catch (error) {
    console.error("Facebook auth error:", error);
    res.status(500).json({ msg: "Authentication failed", error: error.message });
  }
};

// Get visitor profile
export const getVisitorProfile = async (req, res) => {
  try {
    if (!req.session.visitorId) {
      return res.status(401).json({ msg: "Please login to your account!" });
    }

    const visitor = await Visitor.findOne({
      where: {
        visitor_id: req.session.visitorId,
      }
    });

    if (!visitor) {
      return res.status(404).json({ msg: "Visitor not found" });
    }

    res.status(200).json(visitor);
  } catch (error) {
    console.error("Get visitor profile error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Logout visitor
export const visitorLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Visitor logout error:", err);
      return res.status(400).json({ msg: "Unable to logout" });
    }
    res.status(200).json({ msg: "You have been logged out" });
  });
}; 