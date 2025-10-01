import { GoogleGenerativeAI } from "@google/generative-ai";
import cron from "node-cron";
import RedditPosts from "./model.js";

export async function Post() {
    try {
        const hasGeminiKey = !!process.env.GEMINI_API_KEY;
        const genAI = hasGeminiKey ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

        if (!genAI) {
            console.error("Gemini API key not found.");
            return;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const allData = await RedditPosts.find({owner:"68c70472465e33a10dffca1f"});
        const prompt = `You are an expert-level content creator and a senior software engineer with a passion for mentoring students. Your mission is to generate a list of 5 to 10 profoundly useful, detailed, and engaging posts for a student-focused platform in India. The target audience is university students pursuing degrees in Computer Science, Information Technology, and related engineering fields. Your content should be educational, insightful, and directly applicable to their learning, research, and career preparation.

### Primary Directive
Generate a diverse list of posts, ensuring no two posts are from the same category. Each post must provide significant depth and detail.

### Content Categories & Specific Instructions

When generating a post for a category, follow these detailed instructions for its description:

1.  **Advanced Interview Topic Deep Dive:**
    * **Task:** Do not list generic tips. Instead, choose **one** specific, advanced interview topic and create a deep-dive post.
    * **Examples:** "Mastering System Design for Scalable Ride-Sharing Apps," "Advanced Dynamic Programming: The Knapsack Pattern Explained," or "Cracking Behavioral Interviews: The STAR Method for Indian Product Companies."
    * **Description Requirements:** The description must be a mini-tutorial. It should include an introduction to the topic's importance, a breakdown of key concepts, a practical example or a scenario-based question, and common pitfalls to avoid. It should be structured, clear, and at least 150 words.

2.  **Hackathon or Tech Event Announcement:**
    * **Task:** Announce a fictional (but realistic) national-level hackathon or tech conference.
    * **Details to Include:** Give it a compelling name (e.g., "CodeSangam 2025," "InnovateIndia Tech Summit"). The description must specify the theme (e.g., AI in Healthcare, Sustainable FinTech), the dates, the prize pool, and a list of key skills participants can expect to learn or showcase (e.g., "Deploying models with PyTorch," "Building on the Polygon blockchain").

3.  **Emerging Technology Explainer:**
    * **Task:** Choose a cutting-edge topic in computer science and explain it for a student audience.
    * **Examples:** "What is Federated Learning and Why It's the Future of Privacy," "A Student's Guide to Quantum Computing," or "Understanding eBPF: The Future of Networking and Observability."
    * **Description Requirements:** The description must define the technology, explain its core principles, detail its real-world applications (mentioning Indian companies or research if possible), and suggest 2-3 online resources (like research papers, blogs, or GitHub repos) for deeper learning.

4.  **In-Depth Internship/Scholarship Spotlight:**
    * **Task:** Instead of a list, focus on **one** prestigious internship program or scholarship relevant to Indian CS students.
    * **Examples:** "How to Ace the Microsoft Engage Mentorship Program," "A Guide to the Google Summer of Code (GSoC) for Indian Students," "Applying for the Tata Innovation Fellowship."
    * **Description Requirements:** The description must detail the eligibility criteria, the step-by-step application process, tips for creating a standout application, and what the program entails (e.g., stipend, mentorship, project types).

5.  **Challenging Coding Question (MindQuiz - Algorithms):**
    * **Task:** Provide a LeetCode-style coding problem of **Medium or Hard** difficulty. Do not provide the solution.
    * **Description Requirements:** The description must be perfectly structured to include:
        * A clear and unambiguous **Problem Statement**.
        * One or two **Examples** with specific inputs and outputs to illustrate the requirement.
        * A **Constraints** section detailing the range of input values (e.g., \`1 <= nums.length <= 10^5\`).

6.  **Advanced Math Problem (MindQuiz - CS Theory):**
    * **Task:** Pose a challenging problem from discrete mathematics, probability theory, or linear algebra that has direct applications in computer science.
    * **Examples:** A graph theory problem related to network routing, a Bayesian probability puzzle for machine learning, or a combinatorics problem for algorithm analysis.
    * **Description Requirements:** The description should present the problem clearly and briefly explain its connection to a specific domain within computer science.

7.  **Advanced QA & Testing Concepts:**
    * **Task:** Create a post on an advanced or modern Quality Assurance topic, moving beyond basic manual testing.
    * **Examples:** "An Introduction to Performance Testing with K6 and Grafana," "Automating API Tests for a RESTful Service using Postman and Newman," or "The Role of a Software Development Engineer in Test (SDET)."
    * **Description Requirements:** Explain what the concept is, why it is crucial in modern software development, and the basic steps or tools involved in getting started.

And next are your existing Posts and make sure that you dont Repeate your older posts or repost them os create new one everytime based on these data try to not generate the same content over and over
${JSON.stringify(allData)}
### Final Output Format: STRICTLY ADHERE

You **MUST** return the data as a single, valid JSON array of objects. Your entire response must be **ONLY** the JSON array. Do **NOT** include any introductory text, explanations, conclusions, or markdown formatting like \`\`\`json.
Description must be longers and not only two to three lines and give imageUrl if needed in 40% of posts you must add imgUrl.And give link which works and we can render on html img tag in india.Some image links you provide doesnt work so give me imagUrl which works and we can render.
Each object in the array must follow this exact schema:
**Crucial Escaping Rule:** Any double quotes (\`"\`) that appear inside the \`title\` or \`description\` string values **MUST** be escaped with a backslash (e.g., \`"description": "An example of a \\"quoted text\\" inside a string."\`). This is critical for valid JSON.

And add imageUrl to some of the post of do Posts which require images.
Each object in the array must follow this exact schema:
{
  "title": "A relevant and engaging title based on the instructions above",
  "description": "A detailed, well-structured, and helpful description (minimum 150 words) following the specific guidelines for its category",
  "imgUrl": "An optional URL to a relevant online image. Omit this key if no image is suitable."
}`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();
        
        text = text.replace(/```json/g, '').replace(/```/g, '');

        const startIndex = text.indexOf('[');
        const endIndex = text.lastIndexOf(']');

        if (startIndex === -1 || endIndex === -1) {
            console.error("No valid JSON array found in the model's response.", text);
            return;
        }

        const jsonString = text.substring(startIndex, endIndex + 1).trim();
        
        const finalResults = JSON.parse(jsonString);

        for (const finalResult of finalResults) {
            const newPost = new RedditPosts({
                title: finalResult.title,
                description: finalResult.description,
                imgUrl: finalResult.imgUrl || "",
                owner: "68c70472465e33a10dffca1f",
                group: null
            });
            await newPost.save();
        }

        console.log(`Successfully saved ${finalResults.length} new posts.`);
        return "Done";

    } catch (error) {
        console.error("An error occurred in the Post function:", error);
    }
}

export function startBot() {
    cron.schedule("0 0 * * *", async () => {
        console.log("Cron job running: Generating new posts...");
        await Post();
    });
}