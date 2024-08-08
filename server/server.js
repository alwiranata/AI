import express from "express"
import * as dotenv from "dotenv"
import cors from "cors"
import OpenAI from "openai"
dotenv.config()

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
	res.status(200).send({message: "Hello from CodeX!"})
})

app.post("/", async (req, res) => {
	try {
		const {prompt} = req.body

		if (!prompt) {
			return res.status(400).send({error: "Prompt is required"})
		}

		const response = await openai.completions.create({
			model: "gpt-3.5-turbo-instruct", // Use 'gpt-4-turbo' or another valid model
			messages: [{role: "user", content: prompt}],
			temperature: 0.7,
			max_tokens: 150,
		})

		res.status(200).send({bot: response.choices[0].message.content})
	} catch (error) {
		console.error(
			"Error:",
			error.response ? error.response.data : error.message
		)
		res.status(500).send({error: error.message || "Something went wrong"})
	}
})

const port = process.env.PORT || 5001
app.listen(port, () => {
	console.log(`AI server started on http://localhost:${port}`)
})
