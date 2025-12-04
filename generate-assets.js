import sharp from "sharp";
import path from "path";
import fs from "fs";

const sourceImage =
  "/Users/jw/.gemini/antigravity/brain/8d1bcbc5-5c1d-4983-92db-7bcbbb72ca09/benny_pick_bear_simple_1764809956544.png";
const outputDir =
  "/Users/jw/.gemini/antigravity/brain/8d1bcbc5-5c1d-4983-92db-7bcbbb72ca09";

const generateAssets = async () => {
  try {
    console.log("Generating assets from:", sourceImage);

    // 1. Icon (Square)
    // The source is a square logo. User wants it "grounded" at the bottom.
    // We will:
    // 1. Load image
    // 2. Trim whitespace (to get just the bear)
    // 3. Create a new white square background
    // 4. Composite the trimmed bear onto the background, aligned to the bottom-center.

    const image = sharp(sourceImage);
    const metadata = await image.metadata();

    // Trim to get the bounding box of the content
    const trimmed = await image.trim().toBuffer();
    const trimmedMetadata = await sharp(trimmed).metadata();

    // We want a 512x512 output.
    // We should scale the trimmed image so it fits nicely (e.g., 80% width or height),
    // and place it at the bottom.

    const targetSize = 512;
    const padding = 40; // Padding from edges

    // Calculate scale to fit within targetSize - padding
    const scale = Math.min(
      (targetSize - padding * 2) / trimmedMetadata.width,
      (targetSize - padding * 2) / trimmedMetadata.height
    );

    const newWidth = Math.round(trimmedMetadata.width * scale);
    const newHeight = Math.round(trimmedMetadata.height * scale);

    const resizedBear = await sharp(trimmed)
      .resize(newWidth, newHeight)
      .toBuffer();

    // Composite onto white background
    // Position: Center X, Bottom Y (with slight padding at bottom if desired, or 0 to be fully attached)
    // User said "attached at the bottom", so let's put it at y = targetSize - newHeight (bottom aligned)
    // Actually, let's give it a tiny bit of breathing room or 0 depending on "attached".
    // "attached at the bottom" -> likely 0 padding at bottom.

    await sharp({
      create: {
        width: targetSize,
        height: targetSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
      },
    })
      .composite([
        {
          input: resizedBear,
          top: targetSize - newHeight, // Aligned to bottom
          left: Math.round((targetSize - newWidth) / 2), // Centered horizontally
        },
      ])
      .toFile(path.join(outputDir, "benny_pick_icon.png"));

    console.log("Generated benny_pick_icon.png (Bottom Aligned)");

    // 2. Favicon (Small square)
    await sharp(path.join(outputDir, "benny_pick_icon.png"))
      .resize(64, 64)
      .toFile(path.join(outputDir, "benny_pick_favicon.png"));
    console.log("Generated benny_pick_favicon.png");

    // 3. Profile
    // Use the same icon image for profile
    fs.copyFileSync(
      path.join(outputDir, "benny_pick_icon.png"),
      path.join(outputDir, "benny_pick_profile.png")
    );
    console.log("Generated benny_pick_profile.png");
  } catch (error) {
    console.error("Error generating assets:", error);
  }
};

generateAssets();
