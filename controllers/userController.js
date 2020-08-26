const User = require("../models/user");
const jwt = require("jsonwebtoken");
exports.index = async (req, res, next) => {
  try {
    const user = await User.find().sort({ _id: -1 });
    res.status(200).json({
      result: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existId = await User.findOne({ email: email });
    if (existId) {
      const error = new Error("อีเมล์ซ้ำ มีในระบบแล้ว");
      error.statusCode = 400;
      throw error;
    }

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = await user.encryptPassword(password);
    await user.save();

    res.status(200).json({
      message: "สมัครสมาชิกเรียบร้อยแล้ว",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("ไม่พบข้อมูลในระบบ");
      error.statusCode = 400;
      throw error;
    }

    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error("รหัสผ่านwไม่ถูกต้อง");
      error.statusCode = 400;
      throw error;
    }
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      "LPawy4GmxjOJGeoAiyoVsdGlNhyD7SPnia8MijBGRTOLuI1nxjJCc50Z8vyWiFq",
      { expiresIn: "10m" }
    );

    const exprie_in = jwt.decode(token);

    res.status(200).json({
      access_token: token,
      exprie_in: exprie_in.exp,
      token_type: "Bearer",
    });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const { _id, name, email, role } = req.user;
    res.status(200).json({
      result: {
        id: _id,
        name: name,
        email: email,
        role: role,
      },
    });
  } catch (error) {
    next(error);
  }
};
