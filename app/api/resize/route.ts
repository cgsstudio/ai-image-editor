import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File;
        const width = formData.get('width');
        const height = formData.get('height');

        if (!imageFile) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Resize to 1024x1024
        const imagePng = await sharp(buffer)
            .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toBuffer();

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
            prompt: `Resize to ${width}x${height} and fill empty areas naturally, matching the original scene.`,
            n: 1,
            size: "1024x1024",
        });

        const outputUrl = response.data?.[0]?.url;

        if (!outputUrl) {
            throw new Error('No output URL received from OpenAI');
        }

        return NextResponse.json({
            image: outputUrl,
            message: "Image resized"
        });

    } catch (error: any) {
        console.error('Error resizing:', error);
        return NextResponse.json({ error: error.message || 'Failed to resize image' }, { status: 500 });
    }
}
