import express from "express";
import { readFile } from 'fs/promises';
import * as dbUtils from "../reviewDBUtils.js";

const reviewRouter = express.Router();

reviewRouter.get("/diningInfo", async (req, res) => {
    const pathname = "back-end/MockData/diningHallInfo.json";
    try {
        const data = await readFile(pathname, 'utf8');
        res.set('Content-Type', 'application/json');
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send({
            "message": `{pathname} not found in the server`
        });
    }
});

/*
We will use fetch API to fetch all the food review from a particular dining hall
- Before this step, checking whether the user is login is important but we can hold off this for now
    - if user is not login, a json message with a status code 401 (unauthenticated)
1. we need to check if diningHall name is valid, hence blocking their calls when it is not valid
2. we need to retrieve food review from this dining hall
    - if successful, then send a json message with a status code 200 (okay)
    - if not, send a json message with warning and a status code 404 (Not found)
*/

// get all the food review from a particular dining hall
reviewRouter.get("/review/:dininghall", (req, res) => {
    let dine = req.params.dininghall;
    dbUtils.getDoc(dine).then((doc) =>{
        res.send(doc);
    })
   
})
reviewRouter.get("/review/:userID", (req,res) => {
    
});
// create a new food review for a particular dining hall
reviewRouter.post("/review", (req, res) => {
    let dine = req.body;
    dbUtils.createDoc(dine).then((val) =>{
        res.send(val);
    })
})

// update an existing food review for a particular dining hall
reviewRouter.post("/review/:dininghall/:reviewID", (req, res) => {

})

// delete an existing food review for a particular dining hall
reviewRouter.delete("/review/:dininghall/:reviewID", (req, res) => {
    
})

reviewRouter.get("/:diningHall", (req, res) => {
    res.sendFile("./front-end/HTML/dining.html", {root: "./"});
});

reviewRouter.get("info/:diningHall", (req, res) => {
    res.send(JSON.stringify({
        "DiningName": "Worcester",
        "DiningAddress": "669 North Pleasant Street, Amherst MA 01003",
        "DiningPhoneNumber": "413-545-2143",
        "NumberOfReviews": 0,
        "DiningDescription": "The new Worcester Commons, opened Fall 2020, is a state of the art facility featuring a “Food Hall” design. Worcester’s globally inspired menu, 12 action stations, teaching kitchen, Grab'N Go, retail café and restaurant will operate from 7am to midnight seven days a week. Worcester Commons is located in the Northeast Residential Area and is handicapped accessible."
    }));
});

export default reviewRouter;