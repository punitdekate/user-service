const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/profiles");
    },
    filename: function (req, file, cb) {
        // Generate a unique suffix based on the current timestamp
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;
