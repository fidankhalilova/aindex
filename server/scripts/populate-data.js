// scripts/create-complete-tools.js
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin123!';

async function login() {
    const response = await axios.post(`${STRAPI_URL}/api/auth/local`, {
        identifier: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
    });
    return response.data.jwt;
}

async function getCategories(token) {
    const response = await axios.get(`${STRAPI_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const categories = {};
    response.data.data.forEach(cat => {
        categories[cat.attributes.slug] = cat.id;
    });
    return categories;
}

async function createTool(token, toolData) {
    try {
        const response = await axios.post(
            `${STRAPI_URL}/api/tools`,
            { data: toolData },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`✅ Created: ${toolData.name}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Failed to create ${toolData.name}:`, error.response?.data?.error?.message);
        return null;
    }
}

async function createCompleteTools() {
    console.log('🚀 Creating complete tools...\n');

    const token = await login();
    const categories = await getCategories(token);

    const tools = [
        {
            name: 'ChatGPT',
            slug: 'chatgpt',
            shortDescription: 'Advanced AI language model for conversations and content creation',
            description: 'ChatGPT is a powerful AI language model that can help with writing, coding, research, and creative tasks. It understands context and can generate human-like responses.',
            website: 'https://chat.openai.com',
            pricing: 'freemium',
            pricingDetails: 'Free tier available, ChatGPT Plus for $20/month',
            features: ['Natural conversations', 'Code generation', 'Content writing', 'API access', 'Multilingual support'],
            tags: ['writing', 'chatbot', 'coding', 'research', 'productivity'],
            averageRating: 4.8,
            reviewsCount: 1250,
            viewsCount: 50000,
            isVerified: true,
            isFeatured: true,
            state: 'published',
            category: categories['ai-writing']
        },
        {
            name: 'Midjourney',
            slug: 'midjourney',
            shortDescription: 'AI art generator creating stunning images from text descriptions',
            description: 'Midjourney is an AI image generation tool that creates amazing artwork from text prompts. Known for its artistic style and high-quality outputs.',
            website: 'https://www.midjourney.com',
            pricing: 'paid',
            pricingDetails: 'Starts at $10/month',
            features: ['Text to image', 'Style variations', 'High resolution', 'Community gallery', 'Upscaling'],
            tags: ['art', 'design', 'creative', 'image-generation', 'digital-art'],
            averageRating: 4.9,
            reviewsCount: 2100,
            viewsCount: 75000,
            isVerified: true,
            isFeatured: true,
            state: 'published',
            category: categories['image-generation']
        },
        {
            name: 'GitHub Copilot',
            slug: 'github-copilot',
            shortDescription: 'AI pair programmer that suggests code in real-time',
            description: 'GitHub Copilot uses OpenAI Codex to suggest code and entire functions in real-time, right from your editor.',
            website: 'https://github.com/features/copilot',
            pricing: 'paid',
            pricingDetails: '$10/month or $100/year',
            features: ['Code completion', 'Function generation', 'Multiple languages', 'IDE integration', 'Context awareness'],
            tags: ['coding', 'development', 'programming', 'productivity', 'ide'],
            averageRating: 4.7,
            reviewsCount: 3400,
            viewsCount: 120000,
            isVerified: true,
            isFeatured: true,
            state: 'published',
            category: categories['code-assistant']
        },
        {
            name: 'Runway ML',
            slug: 'runway-ml',
            shortDescription: 'AI video editing and generation platform',
            description: 'Runway offers AI-powered video editing tools including green screen removal, motion tracking, and text-to-video generation.',
            website: 'https://runwayml.com',
            pricing: 'freemium',
            pricingDetails: 'Free plan, Pro from $15/month',
            features: ['Text to video', 'Video editing', 'Green screen removal', 'Motion tracking', 'AI filters'],
            tags: ['video', 'editing', 'creative', 'generation', 'ai-video'],
            averageRating: 4.6,
            reviewsCount: 890,
            viewsCount: 35000,
            isVerified: true,
            isFeatured: true,
            state: 'published',
            category: categories['video-creation']
        },
        {
            name: 'Notion AI',
            slug: 'notion-ai',
            shortDescription: 'AI assistant integrated into Notion workspace',
            description: 'Write better, think bigger, and get answers faster with AI inside Notion.',
            website: 'https://www.notion.so/product/ai',
            pricing: 'paid',
            pricingDetails: 'Add-on to Notion: $8/month',
            features: ['Writing assistant', 'Summarization', 'Brainstorming', 'Translation', 'Content generation'],
            tags: ['productivity', 'writing', 'workspace', 'organization', 'notes'],
            averageRating: 4.5,
            reviewsCount: 560,
            viewsCount: 28000,
            isVerified: true,
            isFeatured: false,
            state: 'published',
            category: categories['productivity']
        },
        {
            name: 'ElevenLabs',
            slug: 'elevenlabs',
            shortDescription: 'AI voice synthesis with realistic voices',
            description: 'Generate natural-sounding speech in multiple languages and voices with unprecedented realism.',
            website: 'https://elevenlabs.io',
            pricing: 'freemium',
            pricingDetails: 'Free tier, Creator from $22/month',
            features: ['Voice cloning', 'Multiple languages', 'Emotional range', 'API access', 'Voice library'],
            tags: ['audio', 'voice', 'tts', 'speech', 'synthesis'],
            averageRating: 4.8,
            reviewsCount: 670,
            viewsCount: 32000,
            isVerified: true,
            isFeatured: true,
            state: 'published',
            category: categories['audio-music']
        }
    ];

    for (const tool of tools) {
        await createTool(token, tool);
    }

    console.log('\n✨ Complete tools created successfully!');
    console.log('📊 Check your Strapi admin panel to see the new tools');
}

createCompleteTools();