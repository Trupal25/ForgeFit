import Image from 'next/image';
export interface BlogPost {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
}

interface BlogCardProps {
  blog: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-48 bg-gray-200">
        {blog.imageUrl && (
          <Image src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" width={500} height={500}/>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-blue-600">{blog.category}</span>
        <h3 className="text-lg font-semibold mt-1">{blog.title}</h3>
        <p className="text-gray-600 mt-2 line-clamp-3">
          {blog.excerpt}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">{blog.date}</span>
          <button className="text-blue-600 text-sm font-medium">Read More</button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard; 