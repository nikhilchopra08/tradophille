import image1 from "../assets/blog/image.png";
import image2 from "../assets/blog/img3.webp"; // Relative path if it's within the src directory
import image3 from "../assets/blog/img3.webp"; // External URL

export const blogData = [
  {
    id: 1,
    title: "Introduction to Stock Market",
    excerpt: "Learn the basics of stock trading and investment strategies...",
    content:
      "The stock market is a platform where buyers and sellers meet to trade stocks. Stocks represent ownership in a company. Investing in stocks can generate wealth over time, but it involves risks. Understanding market trends, analyzing stocks, and diversifying portfolios are key strategies to succeed in trading.",
    image: image1, // Imported image
  },
  {
    id: 2,
    title: "Day Trading Tips for Beginners",
    excerpt: "Day trading can be rewarding but comes with high risks...",
    content:
      "Day trading involves buying and selling stocks within a single trading day. Beginners should start by understanding technical analysis, setting stop-loss limits, and managing their emotions. It's crucial to have a trading plan and discipline to execute it consistently.",
    image: image2, // Imported image from relative path
  },
  {
    id: 3,
    title: "The Importance of Risk Management",
    excerpt: "Protect your investments with effective risk management techniques...",
    content:
      "Risk management is the cornerstone of successful trading. It involves setting stop-loss orders, diversifying your investments, and allocating capital wisely. Traders should only risk a small percentage of their portfolio on a single trade to avoid significant losses.",
    image: image3, // External image URL
  },
];
