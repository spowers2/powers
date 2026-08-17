# Publish Powers UI Kit as a Figma library

Do this once the Components page feels solid (you already have 49/49 + Patterns).

## Steps (Figma UI)

1. Open **Powers UI Kit**.  
2. Open the **Assets** panel (or library publish entry for your plan).  
3. **Publish library** / **Publish changes**.  
4. Confirm components you want shared (all kit components).  
5. Publish.

## Verify

1. **File → New design file** (sandbox).  
2. Assets → enable **Powers UI Kit** library.  
3. Drag in:
   - `Button` (switch Variant / Size)  
   - `Input`  
   - `Card`  
   - `Text`  
4. Confirm they are **instances** (purple outline / instance badge), not detached frames.  
5. Tweak a Variable mode if available — instances should track semantic tokens where bound.

## Team / folder

- Keep the source file in your **Powers** folder.  
- Only publish from this file (single source of truth).  
- After big token syncs (plugin **Sync Variables**), publish library updates again.

## Link from product work

Design Lab / landing / app screens in **separate files** that consume the library — don’t copy components back into the kit file except to improve the system.
