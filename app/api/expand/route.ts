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

        // Resize original to fit within 512x512 to allow expansion room
        const originalResized = await sharp(buffer)
            .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toBuffer();

        const originalMeta = await sharp(originalResized).metadata();
        const w = originalMeta.width || 512;
        const h = originalMeta.height || 512;

        // Composite original onto 1024x1024 canvas
        const imagePng = await sharp({
            create: {
                width: 1024,
                height: 1024,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
            }
        })
            .composite([{ input: originalResized, gravity: 'center' }])
            .png()
            .toBuffer();

        // Create mask
        const maskPng = await sharp({
            create: {
                width: 1024,
                height: 1024,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent = Edit here (surroundings)
            }
        })
            .composite([{
                input: await sharp({
                    create: {
                        width: w,
                        height: h,
                        channels: 4,
                        background: { r: 0, g: 0, b: 0, alpha: 255 } // Opaque = Keep this (original)
                    }
                }).png().toBuffer(),
                gravity: 'center'
            }])
            .png()
            .toBuffer();

        const image = new File([imagePng as any], 'image.png', { type: 'image/png' });
        const mask = new File([maskPng as any], 'mask.png', { type: 'image/png' });

        const response = await openai.images.edit({
            image: image,
            mask: mask,
            prompt: "Extend the image beyond its borders. Match lighting, shadows, texture and style. No distortion.",
            n: 1,
            size: "1024x1024",
        });

        const outputUrl = response.data?.[0]?.url;

        if (!outputUrl) {
            throw new Error('No output URL received from OpenAI');
        }

        return NextResponse.json({
            image: outputUrl,
            message: "Image expanded"
        });

    } catch (error: any) {
        console.error('Error expanding:', error);
        return NextResponse.json({ error: error.message || 'Failed to expand image' }, { status: 500 });
    }
}
