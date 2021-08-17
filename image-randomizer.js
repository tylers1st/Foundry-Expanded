let tok = canvas.tokens.controlled[0];
let tokName = token.name.split(' ', 2);
tokName = tokName[0];

let dir = tok.data.img.split('/');
dir.splice(dir.length - 1, 1);

dir = dir.join('/');

let content = await FilePicker.browse("user", dir);

let min = Math.ceil(0);
let max = Math.floor(content.files.length);

let newImage = content.files[Math.floor(Math.random() * (max - min) + min)];
const update = [];

update.push({
    _id: tok.id,
    img: newImage
});
console.log(newImage);

canvas.tokens.updateMany(update);
