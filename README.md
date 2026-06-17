# Jerwin Cruspero - Personal Portfolio

A sleek, responsive, and highly customizable personal portfolio website built with React, TypeScript, and Tailwind CSS. The portfolio features a modern design, dark/light mode, and an integrated PDF CV generator.

## Features

- **Modern UI:** Built with Tailwind CSS for a fully responsive and elegant design.
- **Dark/Light Mode:** Includes an automatic and toggleable theme switcher.
- **Dynamic CV Export:** Generates a customized, highly formatted PDF version of the resume directly from the browser using `jspdf`.
- **Project Showcase:** Highlights recent work and experience seamlessly.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **Utilities:** jsPDF (for generating downloadable CVs)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/your-portfolio.git
   ```

2. Navigate into the directory:
   ```bash
   cd your-portfolio
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000` (or the port specified by Vite).

## Deployment

The app is optimized for edge deployment using tools like **Cloudflare Pages**, Vercel, or Netlify. Since it is a Vite-based Single Page Application (SPA), ensure the build command is set to `npm run build` and the output directory is `dist`.

## License

This project is open-source and available under the MIT License.
