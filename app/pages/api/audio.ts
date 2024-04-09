// pages/api/audio.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import OpenAI from "openai";
import { tmpdir } from "os";
import { join } from "path";
import { promises as fsPromises } from "fs";

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "20mb",
		},
	},
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		const { file } = req.body;
		const base64Data = file.split(";base64,").pop();
		const tempFilePath = join(tmpdir(), `upload_${Date.now()}.mp3`);
		await fsPromises.writeFile(tempFilePath, base64Data, {
			encoding: "base64",
		});

		const apiKey = process.env.OPENAI_API_KEY;
		const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
		const transcription = await openai.audio.transcriptions.create({
			file: fs.createReadStream(tempFilePath),
			model: "whisper-1",
		});

		// Clean up the temporary file
		await fsPromises.unlink(tempFilePath);

		res.status(200).json({ text: transcription.text });
	} else {
		// Handle any non-POST requests
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
