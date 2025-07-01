import { getDatabase } from "./api/notion";
import Article from "../components/Article";
import Tag from "../components/Tag";
import { useState, useMemo } from "react";

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home({ posts }) {
  const [selectedTags, setSelectedTags] = useState([]);

  // Filter posts to only show those with summaries (completed posts)
  const publishedPosts = posts.filter(post =>
    post.properties.summary?.rich_text?.[0]?.plain_text
  );

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Map();
    publishedPosts.forEach(post => {
      const tags = post.properties.tags?.multi_select || [];
      tags.forEach(tag => {
        if (!tagSet.has(tag.name)) {
          tagSet.set(tag.name, tag);
        }
      });
    });
    return Array.from(tagSet.values());
  }, [publishedPosts]);

  // Filter posts by selected tags
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) {
      return publishedPosts;
    }
    return publishedPosts.filter(post => {
      const postTags = post.properties.tags?.multi_select || [];
      return selectedTags.some(selectedTag =>
        postTags.some(postTag => postTag.name === selectedTag)
      );
    });
  }, [publishedPosts, selectedTags]);

  const handleTagClick = (tagName) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(tag => tag !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  return (
    <>
      {/* Tag Filter Section */}
      {allTags.length > 0 && (
        <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-title">Filter by Tags</h3>
              <p className="text-xs text-text opacity-60 mt-1">Select multiple tags to show posts that contain any of the selected tags</p>
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={clearAllTags}
                className="text-sm text-secondary hover:text-red-400 underline transition duration-200"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap">
            {allTags.map((tag, index) => (
              <Tag
                key={index}
                name={tag.name}
                color={tag.color}
                onClick={handleTagClick}
                isSelected={selectedTags.includes(tag.name)}
              />
            ))}
          </div>
          {selectedTags.length > 0 && (
            <p className="mt-3 text-sm text-text opacity-80">
              Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
              {selectedTags.length > 0 && ` with tag${selectedTags.length > 1 ? 's' : ''}: ${selectedTags.join(', ')}`}
            </p>
          )}
        </div>
      )}

      {/* Posts Section */}
      {filteredPosts.map((post) => {
        const date = new Date(post.last_edited_time).toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });

        const summary = post.properties.summary.rich_text[0].plain_text;
        const tags = post.properties.tags?.multi_select || [];

        return (
          <Article
            key={post.id}
            title={post.properties.title.title[0].plain_text}
            date={date}
            summary={summary}
            href={`/${post.id}`}
            tags={tags}
            onTagClick={handleTagClick}
          />
        );
      })}

      {filteredPosts.length === 0 && selectedTags.length > 0 && (
        <div className="text-center py-8">
          <p className="text-text opacity-60">No posts found with the selected tag{selectedTags.length > 1 ? 's' : ''}.</p>
        </div>
      )}
    </>
  );
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);

  return {
    props: {
      posts: database,
    },
  };
};
