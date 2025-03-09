# Project Restoration Instructions

This document contains instructions on how to restore your real estate project to the state where the property preview page with the Lazord by Lapis layout was implemented.

## Basic Restoration Steps

### Step 1: Navigate to your project directory
Open Terminal and navigate to your project directory:
```bash
cd /Users/ali/Desktop/real-estate-project-backup-20250304_023209
```

### Step 2: Install dependencies (if needed)
If for some reason your node_modules folder is missing or corrupted, you can reinstall dependencies:
```bash
npm install
```

### Step 3: Start the development server
To continue working on the project, start the development server:
```bash
npm run dev
```

### Step 4: Access your preview page
Once the server is running, you can access your preview page at:
```
http://localhost:3000/property-preview/1
```

### Step 5: Check git status (optional)
If you want to verify that you're at the correct commit point:
```bash
git log -1
```
This will show you the most recent commit, which should be "Add property preview page with Lazord by Lapis layout".

## Git-Based Restoration

Since your changes are committed to git, you can always revert to this exact point using git commands:

```bash
# Check the commit hash
git log

# Revert to the specific commit (replace with your actual commit hash)
git checkout b85e6a1
```

## Project Structure

Your property preview page is located at:
- `src/app/property-preview/[id]/page.tsx` (server component)
- `src/app/property-preview/[id]/preview-client-page.tsx` (client component with the Lazord layout)

## Production Build

### Build for Production
If you want to create a production build:
```bash
npm run build
```

### Preview Production Build
To preview the production build locally:
```bash
npm run start
```

## Key Features Implemented

1. **Property Preview Page**: A temporary page to preview the new Lazord by Lapis design without affecting the current property detail page.

2. **Layout Components**:
   - Hero section with cover photo and "Register Your Interest" form overlay
   - Navigation tabs (PDF Brochure, Floor Plans, Location Map, Photo Gallery, Payment Plan, Video)
   - Content sections (Highlights, Project Details, Payment Plan, Photo Gallery, Amenities, Location)
   - Download forms for brochures and floor plans
   - Enquiry form
   - "You May Also Like" section
   - Newsletter subscription section

3. **Design Elements**:
   - Responsive layout that works on different screen sizes
   - Modern UI with clean typography and spacing
   - Form elements for user interaction

## Troubleshooting

If you encounter any issues when restoring the project:

1. **Development Server Won't Start**:
   - Check for errors in the terminal
   - Verify Node.js version (use `node -v`)
   - Try clearing the Next.js cache: `rm -rf .next`

2. **Missing Dependencies**:
   - Run `npm install` to reinstall dependencies

3. **Git Issues**:
   - If git commands aren't working, ensure you're in the correct directory
   - Check git status with `git status`

4. **Page Not Found**:
   - Verify the server is running
   - Check the URL path (should be `/property-preview/1`)
   - Ensure the property with ID 1 exists in your data

## Next Steps

After restoring your project, you might want to:

1. Review the preview page and make any necessary adjustments
2. Implement the design on the main property detail page if you're satisfied with it
3. Add real data and images to replace the placeholder content
4. Test the forms and functionality to ensure everything works as expected

## Contact

If you need further assistance, please contact your development team or support. 