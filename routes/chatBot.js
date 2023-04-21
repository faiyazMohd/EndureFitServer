const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();

// Route 1 : chat bot requests using: POST "/api/chatbot" . no login required
router.post(
  "/chatbot",
  async (req, res) => {
    let success = false;
    try {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
          });
          const openai = new OpenAIApi(configuration);
        const prompt = req.body.prompt;
        const response =  await openai.createCompletion({
            model: "text-davinci-003",
            // model: "text-ada-001",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        // console.log(response);
        const data = response.data.choices[0].text;
        success = true
        res.status(200).send({ success, msg: "successfull",data });
    } catch (error) {
      success = false;
      res.status(500).send({ success, msg: "Something went wrong" });
      // console.log(error);
    }
  }
);
module.exports = router;
