# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-file portfolio website (`portfolio.html`) - a responsive, animated skills showcase page with a dark theme and red accent colors. The entire application is self-contained in one HTML file with embedded CSS and JavaScript.

## Quick Start

**Viewing the page:**
Open `portfolio.html` in a web browser (double-click or drag into browser).

**Editing:**
Edit `portfolio.html` directly - all content, styling, and interactivity is contained within this file.

## Architecture

The page is organized into semantic HTML sections:

- **Header & Navigation** - Sticky header with logo and nav links
- **Hero Section** - Large introductory section with call-to-action button
- **About Section** - Brief personal introduction
- **Skills Section** - Two-part display:
  - Interactive skill wheel (rotating circle of 8 skill items with center "pause" button)
  - Grid of skill cards with descriptions
- **Contact Section** - Call-to-action with contact links
- **Footer** - Copyright information

## Key Implementation Details

**Skill Wheel Animation:**
- Uses CSS `rotate()` transforms to position items in a circle
- Continuous `spin` animation (8s linear rotation)
- Click the center circle to pause/resume animation
- Hover over skill items or center to manage animation state

**Responsive Design:**
- Mobile breakpoint at 768px reduces font sizes and adjusts skill wheel positioning
- Uses CSS Grid for skill cards with `auto-fit` for flexible layout
- All measurements use relative units (rem, %)

**Color Scheme:**
- Primary accent: `#cc0000` (red)
- Background: `#0a0a0a` (nearly black)
- Text: `#fff` (white) with `#ddd` for secondary text
- Glow effects use `text-shadow` and `box-shadow` with red tints

## Customization

To personalize this portfolio:

1. **Page title & hero text** - Update `<title>`, `<h1>`, `<p>` in hero section, and footer year
2. **Navigation links** - Modify `<a>` href attributes in header `<ul>`
3. **About content** - Edit `<p>` tags in `.about` section
4. **Skills** - Modify skill names in `.skill-item` divs and descriptions in `.skill-card` divs
5. **Contact links** - Update `href` attributes in `.contact-links` (email, LinkedIn, GitHub, Twitter)
6. **Color scheme** - Replace `#cc0000` and related shades throughout CSS (use find-replace)

## Interactivity

- Smooth scroll navigation for anchor links
- Skill wheel pause/resume on click
- Hover effects on all interactive elements (nav links, buttons, skill items, skill cards)
- Glow effects enhance hover states
