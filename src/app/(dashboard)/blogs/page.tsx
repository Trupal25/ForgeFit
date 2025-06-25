import React from 'react';
import BlogCard, { BlogPost } from '@/components/blogs/BlogCard';

// Mock blog data
const BLOG_DATA: BlogPost[] = [
  {
    id: 1,
    title: "How to Maximize Your Workout Results",
    category: "Fitness Tips",
    excerpt: "Discover the most effective strategies to get the most out of your exercise routine.",
    date: "April 22, 2025",
    imageUrl:"https://i.ytimg.com/vi/3z7p-Z_Ke74/maxresdefault.jpg"
  },
  {
    id: 2,
    title: "Nutrition Basics for Muscle Building",
    category: "Nutrition",
    excerpt: "Learn the essential nutritional requirements to support muscle growth and recovery.",
    date: "April 20, 2025"
  },
  {
    id: 3,
    title: "The Benefits of Morning Workouts",
    category: "Lifestyle",
    excerpt: "Find out why exercising in the morning can lead to better results and improved daily energy.",
    date: "April 18, 2025"
  },
  {
    id: 4,
    title: "Recovery Techniques for Athletes",
    category: "Recovery",
    excerpt: "Explore proven methods to enhance recovery and reduce downtime between training sessions.",
    date: "April 15, 2025"
  },
  {
    id: 5,
    title: "Mindfulness and Exercise: The Perfect Combo",
    category: "Mental Health",
    excerpt: "Understand how combining mindfulness practices with exercise can boost overall well-being.",
    date: "April 12, 2025"
  },
  {
    id: 6,
    title: "Getting Started with Strength Training",
    category: "Beginners Guide",
    excerpt: "A comprehensive guide for beginners looking to start their strength training journey.",
    date: "April 10, 2025"
  }
];
// TODO: Add a search bar to the page
// TODO: Add a filter to the page
// TODO: Add a sort to the page
// TODO: Add a pagination to the page
// TODO: Add a blog post to the page
// TODO: Change from hardcoded to fetching from database

export default function BlogsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Knowldge Vault</h1>
        <p className="text-gray-600">Read the latest fitness articles and tips to improve your health and nutrition.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_DATA.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
} 