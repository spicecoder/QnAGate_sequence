const sharp = require('sharp');
const args = process.argv;
 
const angle = args[2].split("=")[1]
const rotateImage = () => {
   sharp('/IN/image.png')
 // sharp('VM_INPUT/image.jpg')
  .rotate(parseInt(angle))
   .toFile('/OUT/protate_image.png')
 // .toFile( 'VM_OUTPUT/protate_image.jpg')
}

rotateImage()