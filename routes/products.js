const express             = require('express')
const router              = express.Router()
const ProductsControlller = require('../controllers/products-controller')
const multer              = require('multer')
const login               = require('../middleware/login')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        //cb(null, new Date().toISOString() + file.originalname)
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload  = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/', ProductsControlller.getProducts)
router.get('/:product_id', ProductsControlller.getProduct)
router.post('/', login.required, upload.single('image'), ProductsControlller.postProduct)
router.patch('/', login.required, upload.single('image'), ProductsControlller.patchProduct)
router.delete('/:product_id', login.required, ProductsControlller.deleteProduct)

module.exports = router
