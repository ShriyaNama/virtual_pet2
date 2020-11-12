var dog, happyDog, database, foodS, foodStock, dogImg, fedTime, lastFed;

function preload()
{
  dogImg = loadImage("Dog.png");
  happyDog = loadImage("happydog.png");
  milkImg = loadImage("Milk.png");
}

function setup() {
  createCanvas(1000, 500);
  
  dog = createSprite(850, 250);
  dog.addImage(dogImg);
  dog.scale = 0.4;
  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food();

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);
  
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  fill(255, 255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : " + lastFed%12 + "PM", 350, 30);
  }else if(lastFed == 0){
    text("Last Fed : 12 Am", 350, 30);
  }else{
    text("Last Feed : " + lastFed + "AM", 350, 30);
  }

  drawSprites();
}

function readStock(data) {
  foodS = data.val();
}

function writeStock(x) {
  if( x<= 0) {
    x = 0;
  }
  else {
    x=x-1;
  }
  database.ref('/').update({
    Food: x
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}
