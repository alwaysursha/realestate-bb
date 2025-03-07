#!/bin/bash

# Create directories if they don't exist
mkdir -p public/images/about
mkdir -p public/images/team

# Download hero image
curl -o public/images/about-hero.jpg https://source.unsplash.com/random/1920x1080/?dubai,skyline

# Download mission image
curl -o public/images/about-mission.jpg https://source.unsplash.com/random/1200x800/?office,modern

# Download value images
curl -o public/images/value-integrity.jpg https://source.unsplash.com/random/800x600/?handshake,business
curl -o public/images/value-excellence.jpg https://source.unsplash.com/random/800x600/?award,trophy
curl -o public/images/value-client.jpg https://source.unsplash.com/random/800x600/?meeting,client

# Download team images
curl -o public/images/team-ceo.jpg https://source.unsplash.com/random/400x600/?businessman,executive
curl -o public/images/team-coo.jpg https://source.unsplash.com/random/400x600/?businesswoman,executive
curl -o public/images/team-sales.jpg https://source.unsplash.com/random/400x600/?businessman,arab
curl -o public/images/team-marketing.jpg https://source.unsplash.com/random/400x600/?businesswoman,indian

# Download testimonial images
curl -o public/images/testimonial-1.jpg https://source.unsplash.com/random/200x200/?couple,arab
curl -o public/images/testimonial-2.jpg https://source.unsplash.com/random/200x200/?businessman,western
curl -o public/images/testimonial-3.jpg https://source.unsplash.com/random/200x200/?businesswoman,arab

# Download CTA background
curl -o public/images/cta-background.jpg https://source.unsplash.com/random/1920x1080/?dubai,night

echo "All images downloaded successfully!" 