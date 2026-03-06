require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/history', express.static('history'));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024, fieldSize: 50 * 1024 * 1024 } });

// Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// History file path
const HISTORY_FILE = path.join(__dirname, 'history', 'history.json');

function loadHistory() {
  if (fs.existsSync(HISTORY_FILE)) {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  }
  return [];
}

function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// ============ FREEPIK API ============
app.get('/api/freepik/search', async (req, res) => {
  const { query, page = 1 } = req.query;
  const apiKey = process.env.FREEPIK_API_KEY;

  if (!apiKey || apiKey === 'TU_API_KEY_DE_FREEPIK_AQUI') {
    // Return sample placeholder designs when no API key
    return res.json(generateSampleDesigns(query));
  }

  try {
    const searchTerm = encodeURIComponent((query || '') + ' tarjeta presentacion business card');
    const url = `https://api.freepik.com/v1/resources?locale=es&page=${page}&limit=20&order=relevance&term=${searchTerm}`;
    const response = await fetch(url, {
      headers: { 'Accept-Language': 'es', 'x-freepik-api-key': apiKey }
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error('Freepik response:', response.status, errText);
      throw new Error(`Freepik API error: ${response.status}`);
    }
    const raw = await response.json();
    // Transform Freepik response to our format
    const designs = (raw.data || []).map((item, i) => ({
      id: item.id || `freepik_${i}`,
      title: item.title || `Diseno ${i + 1}`,
      preview: item.image?.source?.url || item.image?.source_url || item.thumbnail?.url || item.preview?.url || null,
      color: null,
      style: 'Freepik',
      isSample: false,
      freepikUrl: item.url || null
    }));
    // Mix with sample designs if Freepik returns few results
    if (designs.length < 6) {
      const samples = generateSampleDesigns(query);
      designs.push(...samples.data);
    }
    res.json({ data: designs, meta: raw.meta });
  } catch (error) {
    console.error('Freepik API error:', error.message);
    res.json(generateSampleDesigns(query));
  }
});

// Image proxy to avoid CORS issues with Freepik thumbnails
app.get('/api/proxy-image', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url');
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send('Error fetching image');
  }
});

function generateSampleDesigns(category) {
  const colors = ['#1a365d', '#2d5016', '#7c2d12', '#581c87', '#0c4a6e', '#134e4a', '#713f12', '#4a044e', '#1e3a5f', '#3d0c02'];
  const styles = ['Moderno', 'Clasico', 'Minimalista', 'Elegante', 'Corporativo', 'Creativo', 'Premium', 'Profesional', 'Limpio', 'Audaz', 'Geometrico', 'Gradiente'];
  const designs = [];
  for (let i = 0; i < 12; i++) {
    designs.push({
      id: `sample_${i + 1}`,
      title: `Tarjeta ${styles[i % styles.length]} - ${category || 'Profesional'}`,
      preview: null,
      color: colors[i % colors.length],
      style: styles[i % styles.length],
      isSample: true
    });
  }
  return { data: designs, meta: { pagination: { total: 12, pages: 1 } } };
}

// Helper: download image and return as base64
async function downloadImageAsBase64(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download image: ${response.status}`);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

// ============ GEMINI AI - Generate Card ============
const cardUpload = upload.fields([
  { name: 'templateImage', maxCount: 1 },
  { name: 'logoImage', maxCount: 1 },
  { name: 'photoImage', maxCount: 1 }
]);

app.post('/api/generate-card', cardUpload, async (req, res) => {
  try {
    const { nombre, cargo, empresa, telefono, email, direccion, web, categoria, colorPrimario, colorSecundario, useCustomColors, editInstructions, templatePreviewUrl, templateIsSample, cardSide, cardOrientation } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image-preview' });

    let prompt;
    const isEdit = !!editInstructions;
    const hasFreepikTemplate = templatePreviewUrl && templateIsSample !== '1';
    const side = cardSide || 'front';
    const isFront = side === 'front';
    const wantsCustomColors = useCustomColors === '1';
    const isVertical = cardOrientation === 'vertical';

    // Build color instruction
    const colorInstruction = wantsCustomColors
      ? `IMPORTANT COLOR OVERRIDE: Replace the template's main/primary color with ${colorPrimario} and the secondary/accent color with ${colorSecundario}. Adapt all design elements to use these two colors instead of the original template colors.`
      : `Keep the ORIGINAL colors from the template design. Do NOT change any colors.`;

    // Check for uploaded images
    const hasLogo = req.files && req.files['logoImage'] && req.files['logoImage'][0];
    const hasPhoto = req.files && req.files['photoImage'] && req.files['photoImage'][0];

    const imageInstructions = [];
    if (hasLogo) imageInstructions.push('I am providing a LOGO image — incorporate it into the card design in a prominent but tasteful position.');
    if (hasPhoto) imageInstructions.push('I am providing a PHOTO image — incorporate it into the card design (e.g., as a profile photo or visual element).');
    const imageNote = imageInstructions.length > 0 ? '\n' + imageInstructions.join('\n') : '';

    // CRITICAL instruction to avoid mockups with multiple cards
    const dimensionInfo = isVertical
      ? `portrait/vertical orientation, approximately 600x1050 pixels (5x9 cm at 300 DPI)`
      : `landscape/horizontal orientation, approximately 1050x600 pixels (9x5 cm at 300 DPI)`;
    const SINGLE_CARD_RULE = `
CRITICAL RULES - READ CAREFULLY:
- Generate EXACTLY ONE single flat business card image — ONLY the ${isFront ? 'FRONT' : 'BACK'} side.
- The output must be ONLY the card itself, filling the ENTIRE image with NO margins, NO background, NO shadows, NO perspective, NO mockup.
- Do NOT generate multiple cards, do NOT show front and back together, do NOT create a presentation or collage.
- The image must be a flat, straight-on view of JUST ONE card — as if scanned on a flatbed scanner.
- Image dimensions: ${dimensionInfo}. The card is ${isVertical ? 'VERTICAL (taller than wide)' : 'HORIZONTAL (wider than tall)'}.
- The card must fill 100% of the image — edge to edge, no gray/white borders around it.`;

    if (isEdit) {
      prompt = `Edit this business card image with the following changes: ${editInstructions}.
Keep the same layout and information unless specifically asked to change it.
${colorInstruction}
${SINGLE_CARD_RULE}`;
    } else if (hasFreepikTemplate) {
      if (isFront) {
        prompt = `I'm providing a business card template/design as reference image. You MUST use this exact design as the base for the FRONT side of the card:
- Keep the same layout, shapes, decorative elements, and overall visual style from the template image.
- Replace ALL placeholder/sample text in the template with the following REAL information:

  Name: ${nombre || 'Tu Nombre'}
  Title/Position: ${cargo || 'Profesional'}
  Company: ${empresa || ''}
  Phone: ${telefono || ''}
  Email: ${email || ''}
  Address: ${direccion || ''}
  Website: ${web || ''}

- Maintain the EXACT same visual design, background, shapes, and decorative elements from the template.
- Only replace the text content — do NOT change the design layout or style.
- Keep professional typography matching the template's style.
- The category/industry is: ${categoria || 'Profesional'}

${colorInstruction}
${imageNote}
${SINGLE_CARD_RULE}`;
      } else {
        prompt = `I'm providing a business card template/design as reference image. Generate the BACK side of this business card:
- Use the same visual style, shapes and decorative elements from the template.
- The back side should include:
  * Company name: ${empresa || nombre || 'Empresa'}
  * Category: ${categoria || 'Profesional'}
  * Optionally a tagline or the website: ${web || ''}
- Keep it clean and complementary to the front design.

${colorInstruction}
${hasLogo ? 'I am providing a LOGO image — place it prominently on the back side.' : ''}
${SINGLE_CARD_RULE}`;
      }
    } else {
      if (isFront) {
        prompt = `Generate the FRONT side of a professional business card with these specifications:
- Category/Industry: ${categoria || 'Profesional'}
${wantsCustomColors ? `- Primary color: ${colorPrimario}\n- Secondary color: ${colorSecundario}` : '- Use professional colors appropriate for the industry'}

Information to include:
- Name: ${nombre || 'Tu Nombre'}
- Title/Position: ${cargo || 'Profesional'}
- Company: ${empresa || ''}
- Phone: ${telefono || ''}
- Email: ${email || ''}
- Address: ${direccion || ''}
- Website: ${web || ''}

Design requirements:
- Clean, professional layout with modern typography
- The text must be clearly readable
- Include a subtle design element or icon related to ${categoria || 'the profession'}
- Balanced composition with proper spacing
${imageNote}
${SINGLE_CARD_RULE}`;
      } else {
        prompt = `Generate the BACK side of a professional business card with these specifications:
- Category/Industry: ${categoria || 'Profesional'}
${wantsCustomColors ? `- Primary color: ${colorPrimario}\n- Secondary color: ${colorSecundario}` : '- Use professional colors appropriate for the industry'}

Information for the back:
- Company/Business name: ${empresa || nombre || 'Empresa'}
- Website: ${web || ''}
- A subtle tagline or category reference: ${categoria || 'Profesional'}

Design requirements:
- Complementary to a front-side design
- Simpler and cleaner than the front
- Same color scheme and style
${hasLogo ? 'I am providing a LOGO image — place it prominently on the back side.' : ''}
${SINGLE_CARD_RULE}`;
      }
    }

    let requestParts = [{ text: prompt }];

    // If it's a new generation with a Freepik template, download and attach the template image
    if (!isEdit && hasFreepikTemplate) {
      try {
        console.log('Downloading Freepik template:', templatePreviewUrl);
        const templateBase64 = await downloadImageAsBase64(templatePreviewUrl);
        requestParts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: templateBase64
          }
        });
        console.log('Template image attached successfully');
      } catch (dlErr) {
        console.error('Failed to download template image:', dlErr.message);
        // Continue without template - will generate from scratch
      }
    }

    // If editing, include the current card image
    if (isEdit && req.body.currentImageBase64) {
      const base64Data = req.body.currentImageBase64.replace(/^data:image\/\w+;base64,/, '');
      requestParts.push({
        inlineData: {
          mimeType: 'image/png',
          data: base64Data
        }
      });
    }

    // Attach uploaded logo
    if (hasLogo) {
      const logoData = fs.readFileSync(req.files['logoImage'][0].path);
      requestParts.push({
        inlineData: {
          mimeType: req.files['logoImage'][0].mimetype,
          data: logoData.toString('base64')
        }
      });
      console.log('Logo image attached');
    }

    // Attach uploaded photo
    if (hasPhoto) {
      const photoData = fs.readFileSync(req.files['photoImage'][0].path);
      requestParts.push({
        inlineData: {
          mimeType: req.files['photoImage'][0].mimetype,
          data: photoData.toString('base64')
        }
      });
      console.log('Photo image attached');
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: requestParts }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const response = result.response;
    let imageBase64 = null;
    let textResponse = '';

    if (response.candidates && response.candidates[0]) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageBase64 = part.inlineData.data;
        }
        if (part.text) {
          textResponse = part.text;
        }
      }
    }

    if (!imageBase64) {
      return res.status(500).json({ error: 'No se pudo generar la imagen. Intenta de nuevo.', details: textResponse });
    }

    // Save to file
    const filename = `card_${uuidv4()}.png`;
    const filepath = path.join(__dirname, 'uploads', filename);
    fs.writeFileSync(filepath, Buffer.from(imageBase64, 'base64'));

    // Save to history
    const history = loadHistory();
    const historyEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      datos: { nombre, cargo, empresa, telefono, email, direccion, web, categoria, colorPrimario, colorSecundario },
      imagePath: `/uploads/${filename}`,
      cardSide: side,
      editInstructions: editInstructions || null,
      parentId: req.body.parentId || null
    };
    history.push(historyEntry);
    saveHistory(history);

    res.json({
      success: true,
      imageUrl: `/uploads/${filename}`,
      imageBase64: `data:image/png;base64,${imageBase64}`,
      historyId: historyEntry.id,
      cardSide: side,
      message: textResponse
    });
  } catch (error) {
    console.error('Error generating card:', error);
    res.status(500).json({ error: 'Error al generar la tarjeta', details: error.message });
  }
});

// ============ History endpoints ============
app.get('/api/history', (req, res) => {
  const history = loadHistory();
  res.json(history.reverse());
});

app.get('/api/history/:id', (req, res) => {
  const history = loadHistory();
  const entry = history.find(h => h.id === req.params.id);
  if (!entry) return res.status(404).json({ error: 'No encontrado' });
  res.json(entry);
});

app.delete('/api/history/:id', (req, res) => {
  let history = loadHistory();
  const entry = history.find(h => h.id === req.params.id);
  if (entry && entry.imagePath) {
    const fullPath = path.join(__dirname, entry.imagePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
  history = history.filter(h => h.id !== req.params.id);
  saveHistory(history);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`\n  Disenador de Tarjetas con IA`);
  console.log(`  Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`  Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Configurada' : 'NO CONFIGURADA'}`);
  console.log(`  Freepik API Key: ${process.env.FREEPIK_API_KEY && process.env.FREEPIK_API_KEY !== 'TU_API_KEY_DE_FREEPIK_AQUI' ? 'Configurada' : 'Usando disenos de muestra'}\n`);
});
