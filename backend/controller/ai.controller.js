import axios from 'axios';
import pdfParse from 'pdf-parse';

export const readPdf = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No PDF URL provided' });

  try {
    // Download PDF as buffer
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(response.data, 'binary');

    // Extract text using pdf-parse
    const data = await pdfParse(pdfBuffer);
    res.json({ text: data.text });
  } catch (err) {
    console.error("error in readpdf controller", err);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
};