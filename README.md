<div align="center">
  <img src="https://webstree.com/_ipx/_/logo.svg" alt="WebsTree Logo" width="400" style="margin-bottom: 20px;"/>

  <p align="center">
    <a href="https://webstree.com">View Demo</a>
    ·
    <a href="https://github.com/hadsizefendi/webstree/issues">Report Bug</a>
    ·
    <a href="https://github.com/hadsizefendi/webstree/issues">Request Feature</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/github/license/hadsizefendi/webstree" alt="License">
    <img src="https://img.shields.io/github/stars/hadsizefendi/webstree" alt="Stars">
    <img src="https://img.shields.io/github/forks/hadsizefendi/webstree" alt="Forks">
  </p>


  <p align="center">
    <strong>WebsTree</strong> - A modern, full-stack web application built with Nuxt 3, featuring a powerful content management system and dynamic theming capabilities.
  </p>

</div>

## ✨ Key Features

- 🎨 **Dynamic Theming System**
  - Customizable color schemes and layouts
  - Real-time theme preview
  - Dark/Light mode support

- 🚀 **Modern Tech Stack**
  - Built with Nuxt 3 and Vue.js
  - TypeScript for type safety
  - Tailwind CSS for styling

- 📱 **Responsive Design**
  - Mobile-first approach
  - Cross-browser compatibility
  - Optimized for all screen sizes

- 🔒 **Security & Performance**
  - Built-in security features
  - SEO optimized
  - Fast loading times

- 🎨 Dynamic Theme Management
- 📱 Fully Responsive Design
- 🔐 Secure Authentication System
- 📧 Email Integration
- 📁 File Management System
- 🖼️ Image Processing
- 🎥 Video Processing
- 📊 Admin Dashboard
- 🔄 Real-time Updates
- 🌐 SEO Optimized

## 🛠️ Tech Stack

- **Frontend Framework**: [Nuxt 3](https://nuxt.com/)
- **UI Components**: [@nuxt/ui-pro](https://ui.nuxt.com/)
- **Styling**: Tailwind CSS
- **Database**: MongoDB (via nuxt-mongoose)
- **Email Service**: Nodemailer
- **File Processing**: 
  - Sharp (Image processing)
  - Fluent-ffmpeg (Video processing)
- **Authentication**: JWT & Bcrypt
- **Animations**: VueUse Motion & Animate.css
- **Icons**: Iconify

## 📋 Prerequisites

- Node.js (v18 or higher)
- PNPM Package Manager
- MongoDB Database
- FFmpeg (for video processing)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/hadsizefendi/webstree.git

# Navigate to project directory
cd webstree

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/hadsizefendi/webstree.git
   cd webstree
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory and add necessary environment variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   MAIL_TO=your_email
   MAIL_HOST=your_smtp_host
   MAIL_USERNAME=your_smtp_user
   MAIL_PASSWORD=your_smtp_password
   FILE_STORAGE_PATH=path/to/file/storage
   ```

4. **Run development server**
   ```bash
   pnpm dev
   ```

5. **Build for production (Need Nuxt UI Pro License)**
   ```bash
   pnpm build
   ```

## 🏗️ Project Structure

```
webstree/
├── app/
│   ├── components/    # Reusable Vue components
│   ├── pages/         # Application pages
│   ├── plugins/       # Nuxt plugins
│   └── public/        # Static assets
├── server/           # Server-side code
├── stores/           # Pinia stores
└── content/          # Markdown content
```

## 🔧 Configuration

The project uses several configuration files:
- `nuxt.config.ts` - Nuxt configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `app.config.ts` - Application-specific configuration

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Ahmet Hamdi Arslan - Initial work

## 🌐 Created by Upcreate.art

<p align="center">
 <a href="https://upcreate.art" target="_blank"><img src="https://hadsizefendi.com/up.webp" width="60"></a>
</p>

## 🙏 Acknowledgments

Thanks to God for everything. And special thanks to:
- [Nuxt Team](https://nuxt.com/) for the amazing framework
- [Vue.js Team](https://vuejs.org/) for the incredible Vue.js framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [MongoDB Team](https://www.mongodb.com/) for the powerful database solution

---

⭐️ If you like this project, please give it a star on GitHub!
