---
name: Nova Cronum Protocol
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0d0e0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#292a2a'
  surface-container-highest: '#333535'
  on-surface: '#e3e2e2'
  on-surface-variant: '#c4c5d5'
  inverse-surface: '#e3e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#8e909e'
  outline-variant: '#444653'
  surface-tint: '#b5c4ff'
  primary: '#b5c4ff'
  on-primary: '#00287d'
  primary-container: '#003399'
  on-primary-container: '#8aa4ff'
  inverse-primary: '#3557bc'
  secondary: '#ffb4a8'
  on-secondary: '#690000'
  secondary-container: '#ce0301'
  on-secondary-container: '#ffdcd7'
  tertiary: '#00dbe9'
  on-tertiary: '#00363a'
  tertiary-container: '#004449'
  on-tertiary-container: '#00b9c5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#153ea3'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#930000'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#121414'
  on-background: '#e3e2e2'
  surface-variant: '#333535'
typography:
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
spacing:
  base: 8px
  gutter: 24px
  margin: 40px
  panel-padding: 16px
  column-count: '12'
---

## Brand & Style
The design system is engineered to evoke the weight and authority of an ancient Cybertronian archive. It balances the raw, industrial grit of a mechanical shipyard with the sophisticated, high-speed computation of a galactic command center. The visual language is "Cyber-Industrial"—a fusion of heavy-duty mechanical framing, weathered metal textures, and advanced data-readout aesthetics.

The personality is authoritative and powerful, designed for users who require precision and historical accuracy. It avoids the fluff of consumer-grade interfaces in favor of a "military-grade" dashboard experience that feels like a physical console within the Ark itself.

## Colors
This design system utilizes a high-contrast palette rooted in the heroic "Prime" legacy. The foundation is a deep **Robotic Blue**, used for core navigation and structural branding. **Heroic Red** is reserved for critical status indicators, primary actions, and warnings.

Metallic accents in **Silver and Gunmetal** provide the industrial framework, while a **Cyan Neon** (Tertiary) is used sparingly for glowing data readouts and active states. Surfaces should utilize a semi-transparent dark grey to allow for background mechanical textures to peek through, creating a sense of layered depth.

## Typography
The typography is divided into three distinct roles to reinforce the technical nature of the database.

**Space Grotesk** serves as the display typeface, providing a geometric and futuristic tone for major section headers and status titles. **Geist** is the primary workhorse for descriptions and body copy, chosen for its clarity and precise, developer-centric feel. **JetBrains Mono** is utilized for all system labels, metadata, and coordinates, emphasizing the "database" nature of the application. All labels should be set in uppercase with slight tracking to mimic military equipment marking.

## Layout & Spacing
The layout follows a **Fixed Grid** model to simulate a hardware-enclosed monitor. The interface is contained within a 12-column grid with generous 40px margins that suggest a physical bezel. 

Spacing is rigid and mathematical, moving in 8px increments. Content is organized into "Modules" or "Pods" that occupy specific column spans. On mobile, the 12-column grid collapses to a 4-column layout, and horizontal margins reduce to 16px to maximize data density. Use "safe zones" around glowing elements to prevent visual clutter and ensure neon blurs do not overlap critical text.

## Elevation & Depth
Depth in the design system is achieved through "Mechanical Layering" rather than traditional soft shadows.

1.  **Backdrop Layer:** Darkest base with a faint, low-opacity metallic texture or blueprint grid.
2.  **Panels:** Semi-transparent (60-80% opacity) gunmetal surfaces with a 1px "weathered" silver border.
3.  **Active Focus:** Panels in an active state gain an inner cyan glow (`box-shadow: inset 0 0 10px`) and an outer neon pulse.
4.  **Information Overlays:** Modals and tooltips utilize high-blur backdrop filters (Glassmorphism) to appear as though they are projected "Heads-Up Display" (HUD) elements floating above the mechanical base.

## Shapes
The shape language is strictly **Sharp (0px roundedness)** to reflect forged metal and industrial plating. 

To add visual interest without using rounds, utilize **chamfered corners** (45-degree angles) on buttons and header tags. This reinforces the "machined" look. Any decorative element should feel like a part of a larger machine—think vents, bolts, and interlocking plates.

## Components
-   **Buttons:** Rectangular with no radius. Use a heavy 2px bottom border in Primary Blue or Secondary Red to create a "tactile switch" feel. Text is always uppercase JetBrains Mono.
-   **Cards/Panels:** Feature a "weathered" 1px border using a gradient of Silver (#C0C0C0) to Gunmetal (#2F2F2F). The top-left corner should include a small "Serial ID" label in monospaced font.
-   **Input Fields:** Styled as terminal prompts. A subtle blinking cursor and a background tint of 5% blue reinforce the active state.
-   **Chips/Badges:** Use a "bracket" style `[ STATUS ]` instead of rounded pills. Active badges should pulse with a tertiary cyan glow.
-   **Progress Bars:** Segmented blocks rather than a continuous line, mimicking old battery or power levels on industrial equipment.
-   **Data Viz:** High-contrast line graphs and radial gauges should use thin, 1px strokes with neon glows, contrasting against the heavy, dark background modules.
