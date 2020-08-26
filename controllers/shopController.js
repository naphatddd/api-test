const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const config = require("../config/index");
const Shop = require("../models/shop");

exports.index = async (req, res, next) => {
  try {
    const shops = await Shop.find();
    const shopWithPhotoDomain = await shops.map((shop, index) => {
      return {
        id: shop.id,
        name: shop.name,
        photo: config.DOMAIN + "images/" + shop.photo,
        location: shop.location,
      };
    });
    res.status(200).json({
      result: shopWithPhotoDomain,
    });
  } catch (error) {
    next(error);
  }
};
exports.insert = async (req, res, next) => {
  try {
    const { name, photo, location } = req.body;

    const shop = new Shop();
    shop.name = name;
    shop.photo = await saveImageToDisk(photo);
    shop.location = location;
    await shop.save();

    res.status(200).json({
      message: "บันทึกข้อมูลเรียบร้อยแล้ว",
    });
  } catch (error) {
    next(error);
  }
};
exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id).populate("menus");

    res.status(200).json({
      result: shop,
    });
  } catch (error) {
    next(error);
  }
};
exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existId = await Shop.findOne({ _id: id });
    if (!existId) {
      const error = new Error("ไม่มีข้อมูลในระบบ");
      error.statusCode = 400;
      throw error;
    }

    const shop = await Shop.deleteOne({ _id: id });

    res.status(200).json({
      message: "ลบข้อมูลเรียบร้อย",
    });
  } catch (error) {
    next(error);
  }
};
// exports.update = async (req, res, next) => {
//   try {
//     const shop = await Shop.find();

//     res.status(200).json({
//       result: shop,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

async function saveImageToDisk(baseImage) {
  //หา path จริงของโปรเจค
  const projectPath = path.resolve("./");
  //โฟลเดอร์และ path ของการอัปโหลด
  const uploadPath = `${projectPath}/public/images/`;

  //หานามสกุลไฟล์
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4.v4()}.svg`;
  } else {
    filename = `${uuidv4.v4()}.${ext}`;
  }

  //Extract base64 data ออกมา
  let image = decodeBase64Image(baseImage);

  //เขียนไฟล์ไปไว้ที่ path
  await writeFileAsync(uploadPath + filename, image.data, "base64");
  //return ชื่อไฟล์ใหม่ออกไป
  return filename;
}

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}
