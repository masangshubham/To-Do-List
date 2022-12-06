const express=require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app=express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb+srv://admin-shubham:test123@cluster0.5kooihn.mongodb.net/todoDB",{useNewUrlParser: true})

const itemSchema = {
    name: String
};
const Item = mongoose.model("item",itemSchema);

const item1 = new Item({
    name: "Eat"
});

const item2 = new Item({
    name: "Sleep"
});

const item3 = new Item({
    name: "Repeat"
});

const defaultItems=[item1,item2,item3];





app.get("/",function(req,res){



    Item.find({},function(err, foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err)
                }else{
                    console.log("inserted default items")
                }
            })
            res.redirect("/")
        }else{
            res.render("list",{newListItems: foundItems});
        }
        
    })

    
})

app.post("/",function(req,res){
    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    })
    item.save();
    res.redirect("/");
})

app.post("/delete",function (req,res) {
    const checkedItem = req.body.checkbox;
    Item.findByIdAndRemove(checkedItem,function(err){
        if(!err){
            res.redirect("/")
        }
    })
})

app.listen(3000,function(){
    console.log("server running on port 3000")
})