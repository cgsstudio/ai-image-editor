import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Resize to 1024x1024 and convert to PNG
        const imagePng = await sharp(buffer)
            .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toBuffer();

        // Create a fully transparent mask (edit everything)
        const maskPng = await sharp({
            create: {
                width: 1024,
                height: 1024,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
            .png()
            .toBuffer();

        const image = new File([imagePng as any], 'image.png', { type: 'image/png' });
        const mask = new File([maskPng as any], 'mask.png', { type: 'image/png' });

        const response = await openai.images.edit({
            image: image,
            mask: mask,
            prompt: "Remove the background completely. Keep the subject sharp. Output PNG with transparent background.",
            n: 1,
            size: "1024x1024",
        });

        const outputUrl = response.data?.[0]?.url;

        if (!outputUrl) {
            throw new Error('No output URL received from OpenAI');
        }

        return NextResponse.json({
            image: outputUrl,
            message: "Background removed"
        });

    } catch (error: any) {
        console.error('Error removing background:', error);
        return NextResponse.json({ error: error.message || 'Failed to remove background' }, { status: 500 });
    }
}
