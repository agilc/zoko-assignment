const {Products, validate} = require('../models/resources'); 
const express = require('express');
const router = express.Router();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cloudinary = require('cloudinary');
router.use(logger('dev'));
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(fileUpload());
router.use('/public', express.static(__dirname + '/public'));

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

cloudinary.config({
  cloud_name: "dylz5aj3n", 
  api_key: "749988555327312", 
  api_secret: "t_8t8JA8229vG1CBwcFYvf6ALHE" 
});


const colorMap = {
  red :"#FF0000" ,
  white: "#FFFFFF", 
  blue: "#0000FF", 
  pink: "#FFC0CB", 
  teal: "#008080", 
  purple: "#800080", 
  brown: "#A52A2A", 
  black: "#000000", 
  orange: "#FFA500", 
  yellow: "#FFFF00", 
  green: "#008000", 
  gray: "#808080"
};

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send({'code':251, 'message':error.details[0].message});

    if(!req.files) return res.send({'code':251, 'message':"Image is required."});
    const fileData = req.files.file.data;

    let { name, description, price, tags } = req.body;

    cloudinary.uploader.upload_stream( async (result) => {
      let resource = new Products({ 
        name: name,
        description: description, 
        imageUrl: result.secure_url,
        price: price,
        tags: tags ? JSON.parse(tags) : []
      });
      console.log(result);
      if(result.public_id){
        cloudinary.api.resource(result.public_id, async function(result)  { 
          let colorValues = [];
          console.log(result.predominant.google);
          result.predominant.google.forEach( color => {
            if(color[1] > 10) colorValues.push(colorMap[color[0]]);
          });

          resource['color'] = colorValues;
          resource = await resource.save();

          res.status(200).send(resource);
        }, { colors: true });
      }
      else{
        res.status(251).send({'code':251, 'message':result.error.message});
      }
    })
    .end(fileData)
});

router.get('/', async (req, res) => {
  let product = [];
  if(req.query.params){
    let parameters = {};
    let params = JSON.parse(req.query.params);
    let { name, description, tags, color, minPrice, maxPrice } = params;
    console.log(params);

    if(params.name) 
      parameters["name"] = new RegExp(".*" + name + ".*");
    if(params.description) 
      parameters["description"] = new RegExp(".*" + description + ".*");
    if(params.tags) 
      parameters["tags"] =  { $all : tags.split(",")};
    if(params.color) 
        parameters["color"] =  color.toUpperCase();

    if(minPrice && maxPrice) 
      parameters["price"] = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    else if(minPrice) 
      parameters["price"] = { $gte: parseInt(minPrice) };
    else if(maxPrice) 
      parameters["price"] = { $lte: maxPrice };

    product = await Products
      .find(parameters);
  }
  else{
    product = await Products
    .find();
  }

  if (!product) return res.status(404).send('No Product found.');

  res.status(200).send(product);
});

router.put('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send({'code':251, 'message':error.details[0].message});

    const product = await Products.findById(req.body._id);
    if(!product) res.status(404).send("Product not found");

    let { name, description, price, tags,color } = req.body;
    if(name) product.name = name;
    if(description) product.description = description;
    if(price) product.price = price;
    if(tags) product.tags = tags ? JSON.parse(tags) : [];
    if(color) product.color = JSON.parse(color);

    let result=[];
    if(req.files){
        const fileData = req.files.file.data;
        cloudinary.uploader.upload_stream( async (result) => {
            product.imageUrl = result.secure_url;
            if(result.public_id){
              cloudinary.api.resource(result.public_id, async function(result)  { 
                console.log(result);
                let colorValues = [];
                  console.log(result.predominant.google);
                  result.predominant.google.forEach( color => {
                    if(color[1] > 15) colorValues.push(colorMap[color[0]]);
                  });
                product['color'] = colorValues;
  
                result = await product.save();
                res.status(200).send(result);
              }, { colors: true })
            }
            else{
              res.status(251).send({'code':251, 'message':result.error.message});
            }
          })
          .end(fileData)
    }
    else{
        result = await product.save();
        res.status(200).send(result);
    }
});

router.delete('/:id', async (req, res) => {
  const product = await Products.findByIdAndRemove(id);

  if (!product) return res.send({'code':251, 'message':error.details[0].message});

  res.status(200).send(product);
});

module.exports = router; 