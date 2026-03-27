"use strict";

module.exports = {
  async bootstrap() {
    console.log("Checking if database needs seeding...");

    // Check if categories exist
    const categoriesCount = await strapi.db
      .query("api::category.category")
      .count();

    if (categoriesCount === 0) {
      console.log("🌱 Seeding database...");

      // 1. Create Categories
      const categories = await createCategories();

      // 2. Create Users
      const users = await createUsers();

      // 3. Create Tools
      await createTools(categories, users);

      console.log("✅ Database seeded successfully!");
      console.log("📊 You can now view the data in the Strapi Admin Panel");
    } else {
      console.log("Database already has data, skipping seed");
    }
  },
};

async function createCategories() {
  const categories = [
    {
      name: "AI Writing",
      slug: "ai-writing",
      icon: "PenTool",
      color: "#4F46E5",
      description: "AI-powered writing assistants and content generators",
    },
    {
      name: "Image Generation",
      slug: "image-generation",
      icon: "Image",
      color: "#EC489A",
      description: "Create stunning images with AI",
    },
    {
      name: "Video Creation",
      slug: "video-creation",
      icon: "Video",
      color: "#14B8A6",
      description: "AI video editing and generation tools",
    },
    {
      name: "Code Assistant",
      slug: "code-assistant",
      icon: "Code",
      color: "#10B981",
      description: "AI coding helpers and developers tools",
    },
    {
      name: "Audio & Music",
      slug: "audio-music",
      icon: "Music",
      color: "#F59E0B",
      description: "AI music generation and audio processing",
    },
    {
      name: "Productivity",
      slug: "productivity",
      icon: "Briefcase",
      color: "#6366F1",
      description: "Boost productivity with AI assistants",
    },
    {
      name: "Design",
      slug: "design",
      icon: "Palette",
      color: "#EF4444",
      description: "AI design tools and generators",
    },
    {
      name: "Marketing",
      slug: "marketing",
      icon: "TrendingUp",
      color: "#8B5CF6",
      description: "AI marketing and SEO tools",
    },
    {
      name: "Research",
      slug: "research",
      icon: "BookOpen",
      color: "#06B6D4",
      description: "AI research assistants and academic tools",
    },
    {
      name: "Business",
      slug: "business",
      icon: "Building2",
      color: "#84CC16",
      description: "AI tools for business operations",
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    try {
      const created = await strapi.db.query("api::category.category").create({
        data: category,
      });
      createdCategories.push(created);
      console.log(`  ✓ Created category: ${category.name}`);
    } catch (error) {
      console.log(
        `  ✗ Error creating category ${category.name}:`,
        error.message,
      );
    }
  }
  return createdCategories;
}

async function createUsers() {
  // Get the authenticated role ID
  const authRole = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({
      where: { type: "authenticated" },
    });

  const users = [
    {
      username: "admin_user",
      email: "admin@aindex.com",
      password: "Admin123!",
      bio: "AI enthusiast and platform administrator",
      confirmed: true,
      blocked: false,
      role: authRole.id,
    },
    {
      username: "tech_writer",
      email: "tech@aindex.com",
      password: "Tech123!",
      bio: "Technical writer passionate about AI tools",
      confirmed: true,
      blocked: false,
      role: authRole.id,
    },
    {
      username: "ai_explorer",
      email: "explorer@aindex.com",
      password: "Explorer123!",
      bio: "Exploring the world of AI tools",
      confirmed: true,
      blocked: false,
      role: authRole.id,
    },
  ];

  const createdUsers = [];
  for (const user of users) {
    try {
      // Hash the password
      const hashedPassword = await strapi.plugins[
        "users-permissions"
      ].services.user.hashPassword(user.password);

      const created = await strapi.db
        .query("plugin::users-permissions.user")
        .create({
          data: {
            ...user,
            password: hashedPassword,
          },
        });
      createdUsers.push(created);
      console.log(`  ✓ Created user: ${user.username}`);
    } catch (error) {
      console.log(`  ✗ Error creating user ${user.username}:`, error.message);
    }
  }
  return createdUsers;
}

async function createTools(categories, users) {
  const tools = [
    // AI Writing Tools
    {
      name: "ChatGPT",
      slug: "chatgpt",
      shortDescription:
        "Advanced AI language model for conversations and content creation",
      description:
        "ChatGPT is a powerful AI language model that can help with writing, coding, research, and creative tasks. It understands context and can generate human-like responses.",
      website: "https://chat.openai.com",
      pricing: "freemium",
      pricingDetails: "Free tier available, ChatGPT Plus for $20/month",
      features: [
        "Natural conversations",
        "Code generation",
        "Content writing",
        "API access",
      ],
      tags: ["writing", "chatbot", "coding", "research"],
      averageRating: 4.8,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: true,
      state: "published",
      category: categories.find((c) => c.slug === "ai-writing")?.id,
      submittedBy: users[0]?.id,
    },
    {
      name: "Jasper AI",
      slug: "jasper-ai",
      shortDescription:
        "AI content creation platform for marketing and business",
      description:
        "Jasper helps you create high-quality content for blogs, social media, ads, and more. With 50+ templates and support for 25+ languages.",
      website: "https://www.jasper.ai",
      pricing: "paid",
      pricingDetails: "Starts at $39/month",
      features: [
        "50+ templates",
        "Multiple languages",
        "SEO optimization",
        "Team collaboration",
      ],
      tags: ["marketing", "content", "blogging", "seo"],
      averageRating: 4.6,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: true,
      state: "published",
      category: categories.find((c) => c.slug === "ai-writing")?.id,
      submittedBy: users[1]?.id,
    },
    {
      name: "Copy.ai",
      slug: "copy-ai",
      shortDescription: "AI-powered copywriting tool for marketing content",
      description:
        "Generate marketing copy, blog posts, product descriptions, and more in seconds.",
      website: "https://www.copy.ai",
      pricing: "freemium",
      pricingDetails: "Free plan with 2000 words/month, Pro from $36/month",
      features: [
        "Blog content",
        "Social media posts",
        "Email marketing",
        "Product descriptions",
      ],
      tags: ["copywriting", "marketing", "social-media"],
      averageRating: 4.5,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: false,
      state: "published",
      category: categories.find((c) => c.slug === "ai-writing")?.id,
      submittedBy: users[2]?.id,
    },

    // Image Generation Tools
    {
      name: "Midjourney",
      slug: "midjourney",
      shortDescription:
        "AI art generator creating stunning images from text descriptions",
      description:
        "Midjourney is an AI image generation tool that creates amazing artwork from text prompts. Known for its artistic style and high-quality outputs.",
      website: "https://www.midjourney.com",
      pricing: "paid",
      pricingDetails: "Starts at $10/month",
      features: [
        "Text to image",
        "Style variations",
        "High resolution",
        "Community gallery",
      ],
      tags: ["art", "design", "creative", "image-generation"],
      averageRating: 4.9,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: true,
      state: "published",
      category: categories.find((c) => c.slug === "image-generation")?.id,
      submittedBy: users[0]?.id,
    },
    {
      name: "DALL-E 3",
      slug: "dalle-3",
      shortDescription: "OpenAI's advanced image generation model",
      description:
        "Create realistic images and art from natural language descriptions. DALL-E 3 understands nuances and details better than previous versions.",
      website: "https://openai.com/dall-e-3",
      pricing: "paid",
      pricingDetails: "Pay per image, starts at $0.020/image",
      features: ["High accuracy", "Inpainting", "Outpainting", "Variations"],
      tags: ["image", "creative", "art", "design"],
      averageRating: 4.8,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: true,
      state: "published",
      category: categories.find((c) => c.slug === "image-generation")?.id,
      submittedBy: users[1]?.id,
    },
    {
      name: "Stable Diffusion",
      slug: "stable-diffusion",
      shortDescription: "Open-source AI image generation model",
      description:
        "Open-source text-to-image model that runs locally or in the cloud. Highly customizable with many community models.",
      website: "https://stability.ai",
      pricing: "free",
      pricingDetails: "Free and open-source",
      features: [
        "Open source",
        "Local deployment",
        "Custom models",
        "Commercial use",
      ],
      tags: ["open-source", "image", "creative", "self-hosted"],
      averageRating: 4.7,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: false,
      state: "published",
      category: categories.find((c) => c.slug === "image-generation")?.id,
      submittedBy: users[2]?.id,
    },

    // Code Assistant Tools
    {
      name: "GitHub Copilot",
      slug: "github-copilot",
      shortDescription: "AI pair programmer that suggests code in real-time",
      description:
        "GitHub Copilot uses OpenAI Codex to suggest code and entire functions in real-time, right from your editor.",
      website: "https://github.com/features/copilot",
      pricing: "paid",
      pricingDetails: "$10/month or $100/year",
      features: [
        "Code completion",
        "Function generation",
        "Multiple languages",
        "IDE integration",
      ],
      tags: ["coding", "development", "programming", "productivity"],
      averageRating: 4.7,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: true,
      state: "published",
      category: categories.find((c) => c.slug === "code-assistant")?.id,
      submittedBy: users[0]?.id,
    },
    {
      name: "Cursor",
      slug: "cursor",
      shortDescription: "AI-first code editor with chat interface",
      description:
        "Cursor is an AI-powered code editor that helps you write code faster with natural language commands.",
      website: "https://cursor.sh",
      pricing: "freemium",
      pricingDetails: "Free tier available, Pro at $20/month",
      features: [
        "Chat interface",
        "Code generation",
        "Refactoring",
        "Debugging",
      ],
      tags: ["editor", "ide", "productivity", "ai-coding"],
      averageRating: 4.6,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: false,
      state: "published",
      category: categories.find((c) => c.slug === "code-assistant")?.id,
      submittedBy: users[1]?.id,
    },
    {
      name: "Tabnine",
      slug: "tabnine",
      shortDescription: "AI code completion for developers",
      description:
        "Tabnine uses AI to predict and suggest code completions across all programming languages.",
      website: "https://www.tabnine.com",
      pricing: "freemium",
      pricingDetails: "Free tier, Pro from $12/month",
      features: [
        "Code completion",
        "Multiple languages",
        "IDE plugins",
        "Team collaboration",
      ],
      tags: ["coding", "completion", "productivity"],
      averageRating: 4.5,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: false,
      state: "published",
      category: categories.find((c) => c.slug === "code-assistant")?.id,
      submittedBy: users[2]?.id,
    },

    // Video Creation Tools
    {
      name: "Runway ML",
      slug: "runway-ml",
      shortDescription: "AI video editing and generation platform",
      description:
        "Runway offers AI-powered video editing tools including green screen removal, motion tracking, and text-to-video generation.",
      website: "https://runwayml.com",
      pricing: "freemium",
      pricingDetails: "Free plan, Pro from $15/month",
      features: [
        "Text to video",
        "Video editing",
        "Green screen",
        "Motion tracking",
      ],
      tags: ["video", "editing", "creative", "generation"],
      averageRating: 4.6,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: true,
      state: "published",
      category: categories.find((c) => c.slug === "video-creation")?.id,
      submittedBy: users[0]?.id,
    },
    {
      name: "Synthesia",
      slug: "synthesia",
      shortDescription: "AI video generation with realistic avatars",
      description:
        "Create professional videos with AI avatars in minutes. No cameras or actors needed.",
      website: "https://www.synthesia.io",
      pricing: "paid",
      pricingDetails: "Starts at $30/month",
      features: [
        "AI avatars",
        "Multiple languages",
        "Custom backgrounds",
        "Voice cloning",
      ],
      tags: ["video", "avatars", "presentation", "marketing"],
      averageRating: 4.7,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: false,
      state: "published",
      category: categories.find((c) => c.slug === "video-creation")?.id,
      submittedBy: users[1]?.id,
    },

    // Productivity Tools
    {
      name: "Notion AI",
      slug: "notion-ai",
      shortDescription: "AI assistant integrated into Notion workspace",
      description:
        "Write better, think bigger, and get answers faster with AI inside Notion.",
      website: "https://www.notion.so/product/ai",
      pricing: "paid",
      pricingDetails: "Add-on to Notion: $8/month",
      features: [
        "Writing assistant",
        "Summarization",
        "Brainstorming",
        "Translation",
      ],
      tags: ["productivity", "writing", "workspace", "organization"],
      averageRating: 4.5,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: true,
      state: "published",
      category: categories.find((c) => c.slug === "productivity")?.id,
      submittedBy: users[2]?.id,
    },
    {
      name: "Grammarly",
      slug: "grammarly",
      shortDescription: "AI-powered writing assistant for grammar and style",
      description:
        "Grammarly helps you write clearly and effectively across all your apps.",
      website: "https://www.grammarly.com",
      pricing: "freemium",
      pricingDetails: "Free tier, Premium from $12/month",
      features: [
        "Grammar checking",
        "Tone detection",
        "Plagiarism checker",
        "Style suggestions",
      ],
      tags: ["writing", "grammar", "productivity", "editing"],
      averageRating: 4.6,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: false,
      state: "published",
      category: categories.find((c) => c.slug === "productivity")?.id,
      submittedBy: users[0]?.id,
    },

    // Marketing Tools
    {
      name: "Surfer SEO",
      slug: "surfer-seo",
      shortDescription: "AI-powered SEO content optimization",
      description:
        "Create content that ranks with data-driven SEO recommendations.",
      website: "https://surferseo.com",
      pricing: "paid",
      pricingDetails: "Starts at $59/month",
      features: [
        "Content editor",
        "Keyword research",
        "SERP analyzer",
        "Audit tool",
      ],
      tags: ["seo", "marketing", "content", "analytics"],
      averageRating: 4.7,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: false,
      state: "published",
      category: categories.find((c) => c.slug === "marketing")?.id,
      submittedBy: users[1]?.id,
    },
    {
      name: "Canva Magic Write",
      slug: "canva-magic-write",
      shortDescription: "AI writing assistant in Canva",
      description:
        "Generate copy for your designs with AI-powered writing tools.",
      website: "https://www.canva.com",
      pricing: "freemium",
      pricingDetails: "Free with Canva, Pro features with Canva Pro",
      features: [
        "Copy generation",
        "Design suggestions",
        "Brand voice",
        "Multiple languages",
      ],
      tags: ["design", "marketing", "social-media", "copywriting"],
      averageRating: 4.5,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: false,
      state: "published",
      category: categories.find((c) => c.slug === "marketing")?.id,
      submittedBy: users[2]?.id,
    },

    // Audio & Music Tools
    {
      name: "ElevenLabs",
      slug: "elevenlabs",
      shortDescription: "AI voice synthesis with realistic voices",
      description:
        "Generate natural-sounding speech in multiple languages and voices.",
      website: "https://elevenlabs.io",
      pricing: "freemium",
      pricingDetails: "Free tier, Creator from $22/month",
      features: [
        "Voice cloning",
        "Multiple languages",
        "Emotional range",
        "API access",
      ],
      tags: ["audio", "voice", "tts", "speech"],
      averageRating: 4.8,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: true,
      state: "published",
      category: categories.find((c) => c.slug === "audio-music")?.id,
      submittedBy: users[0]?.id,
    },
    {
      name: "AIVA",
      slug: "aiva",
      shortDescription: "AI music generation for creators",
      description: "Create original music for your projects with AI composers.",
      website: "https://www.aiva.ai",
      pricing: "freemium",
      pricingDetails: "Free plan, Pro from $15/month",
      features: [
        "Music generation",
        "Multiple genres",
        "Customization",
        "Commercial license",
      ],
      tags: ["music", "audio", "creative", "composition"],
      averageRating: 4.6,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: true,
      isFeatured: false,
      state: "published",
      category: categories.find((c) => c.slug === "audio-music")?.id,
      submittedBy: users[1]?.id,
    },
  ];

  for (const tool of tools) {
    try {
      await strapi.db.query("api::tool.tool").create({
        data: tool,
      });
      console.log(`  ✓ Created tool: ${tool.name}`);
    } catch (error) {
      console.log(`  ✗ Error creating tool ${tool.name}:`, error.message);
    }
  }
}
