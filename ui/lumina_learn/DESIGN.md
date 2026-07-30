---
name: Lumina Learn
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#39393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#c6c6cc'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#909096'
  outline-variant: '#46464c'
  surface-tint: '#c2c6da'
  primary: '#c2c6da'
  on-primary: '#2b303f'
  primary-container: '#0a0f1d'
  on-primary-container: '#777b8d'
  inverse-primary: '#595e6f'
  secondary: '#d3bbff'
  on-secondary: '#3f008d'
  secondary-container: '#5d03ca'
  on-secondary-container: '#c7aaff'
  tertiary: '#2fd9f4'
  on-tertiary: '#00363e'
  tertiary-container: '#001216'
  on-tertiary-container: '#00889b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dee2f6'
  primary-fixed-dim: '#c2c6da'
  on-primary-fixed: '#161b2a'
  on-primary-fixed-variant: '#424657'
  secondary-fixed: '#ebddff'
  secondary-fixed-dim: '#d3bbff'
  on-secondary-fixed: '#250059'
  on-secondary-fixed-variant: '#5b00c5'
  tertiary-fixed: '#a2eeff'
  tertiary-fixed-dim: '#2fd9f4'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Outfit
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 20px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for a high-performance, AI-driven educational environment. It balances the intellectual rigor of academia with the immersive, forward-leaning aesthetic of modern technology. The target audience—students and lifelong learners—expects a platform that feels intelligent, responsive, and premium.

The visual narrative is defined by **Glassmorphism**. UI elements appear as translucent panes floating in a deep, cosmic space, suggesting depth and layers of information. The emotional response is one of "focused wonder"—reducing cognitive load through clear hierarchy while maintaining engagement through vibrant, neon-pulsing accents and gamified progress indicators. Surfaces use high-gaussian blurs and thin, luminous borders to create a sophisticated, ethereal workspace.

## Colors

This design system utilizes a deep-space dark mode palette to minimize eye strain during long study sessions and to allow neon accents to pop with maximum vibrance.

- **Primary Base (#0A0F1D):** A deep navy used for the background, providing a rich foundation for translucent layers.
- **Secondary / Core Purple (#6D28D9):** Used for structural elements, active states, and primary branding.
- **Vibrant Accents (#22D3EE, #A855F7):** These "Neon Cyan" and "Neon Purple" tones are reserved for gamification, AI-interactable moments, and high-priority call-to-actions.
- **Glass Surfaces:** Layers are constructed using low-opacity whites and purples with `backdrop-filter: blur(20px)`, ensuring legibility over dynamic background gradients.

## Typography

The typography uses **Outfit** for its geometric clarity and modern, tech-centric feel, which excels in both large display headings and small technical labels.

- **Headlines:** Use Bold weights for major milestones and AI insights. Tight letter-spacing on larger sizes mimics a premium editorial feel.
- **Body:** Vietnamese diacritics are handled gracefully by Outfit. Line heights are generous (1.5x) to ensure academic texts are readable against dark, translucent backgrounds.
- **Labels:** Set in SemiBold or Bold with slight tracking for all-caps micro-copy, such as "ĐÃ HOÀN THÀNH" or "BÀI HỌC TIẾP THEO."

## Layout & Spacing

The layout follows a **fluid grid system** that emphasizes breathing room and content focus. 

- **Grid:** A 12-column grid for desktop with 24px gutters. Elements typically span 8 columns for primary learning content and 4 columns for AI assistants or progress sidebars.
- **Rhythm:** A base-8 vertical rhythm ensures consistency. Spacing between glass "cards" is typically `stack-lg` (32px) to allow the background blur effects to remain distinct.
- **Mobile Adaptivity:** On mobile, margins shrink to 20px, and the 12-column grid collapses to a single-column stack. Heavy use of horizontal scrolling for "Course Chips" and "Badges" to keep the vertical height manageable.

## Elevation & Depth

Depth is not achieved through traditional drop shadows, but through **Tonal Stacking** and **Backdrop Blurs**.

- **Level 0 (Background):** Deep Navy (#0A0F1D) with occasional radial gradients of purple or cyan in the corners to simulate "ambient light."
- **Level 1 (Main Surface):** Glassmorphic panels with 3% white opacity and 20px blur. 1px solid border at 10% white opacity.
- **Level 2 (Hover/Active):** Increased opacity (6%) and a secondary purple glow.
- **AI Components:** These elements should use a "Inner Glow" effect using the Cyan accent to differentiate them from standard educational content.

## Shapes

The shape language is consistently **Rounded**, leaning towards a friendly yet professional aesthetic.

- **Base Radius:** 0.5rem (8px) for standard inputs and small chips.
- **Container Radius:** 1rem (16px) for main lesson cards and modal windows.
- **Interactive Radius:** 1.5rem (24px) for primary "Action" buttons to give them a distinct, tactile feel compared to the layout grid.
- **Borders:** Always 1px. Use linear gradients for borders (Top-Left: White 20% to Bottom-Right: White 0%) to simulate light hitting glass edges.

## Components

- **Buttons:** Primary buttons use a linear gradient from Secondary Purple to Neon Purple. Text is white with a subtle drop shadow. Secondary buttons are "Ghost Glass"—transparent with a 1px cyan border.
- **Cards:** The central container for lessons. Must include a `backdrop-filter: blur(20px)` and a subtle 1px border. 
- **AI Assistant (Chat):** A specialized floating component with a Neon Cyan outer glow. Input fields within the chat should be dark navy with 50% opacity to contrast against the glass card.
- **Progress Bars:** Use the Neon Cyan accent for the "filled" state, with a subtle outer glow to simulate a light-pipe or fiber-optic effect.
- **Chips/Badges:** Small, pill-shaped elements for "Cấp độ," "Chủ đề," or "Thời gian." Use background-tinted versions of the accent colors (e.g., 10% Cyan background with 100% Cyan text).
- **Input Fields:** Semi-transparent dark fills. On focus, the border transitions from White 10% to Neon Purple 100%.