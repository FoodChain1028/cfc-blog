/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import { databaseId } from ".";
import { getDatabase, getPage, getBlocks } from "./api/notion";
import Link from "next/link";
import { Text } from "../components/Text";
import Seo from "../components/Seo";
import CodeBlock from "../components/CodeBlock";
import Tag from "../components/Tag";
import { BlockMath } from 'react-katex';
import { siteMetaData } from "../utils/config";
import 'katex/dist/katex.min.css';

const renderNestedList = (block) => {
  // Numbered lists not working\
  const { type } = block;
  const value = block[type];
  if (!value) return null;

  const isNumberedList = value.children[0].type === "numbered_list_item";

  return isNumberedList ? (
    <ol>{value.children.map((block) => renderBlock(block))}</ol>
  ) : (
    <ul>{value.children.map((block) => renderBlock(block))}</ul>
  );
};

const renderBlock = (block) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return (
        <p>
          <Text text={value.rich_text} />
        </p>
      );
    case "heading_1":
      return (
        <h1 className="mb-6">
          <Text text={value.rich_text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="mb-6">
          <Text text={value.rich_text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="mb-6">
          <Text text={value.rich_text} />
        </h3>
      );
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li>
          <Text text={value.rich_text} />
          {value.children && renderNestedList(block)}
        </li>
      );
    case "to_do":
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />
            <Text text={value.rich_text} />
          </label>
        </div>
      );
    case "toggle":
      return (
        <details>
          <summary>
            <Text text={value.rich_text} />
          </summary>
          {value.children?.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      );
    case "child_page":
      return <p>{value.title}</p>;
    case "image":
      const src =
        value.type === "external" ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure>
          <img loading="lazy" src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    case "divider":
      return <hr key={id} className="my-8" />;
    case "quote":
      return (
        <div key={id}>
          <br />
          <blockquote><Text text={value.rich_text} /></blockquote>
          <br />
        </div>
      );
    case "code":
      const codeText = value.rich_text[0]?.plain_text || '';
      const language = value.language || 'text';
      return (
        <CodeBlock
          key={id}
          code={codeText}
          language={language}
          backgroundColor="bg-zinc-800"
        />
      );
    case "equation":
      return (
        <div key={id} className="my-8 flex justify-center">
          <BlockMath math={value.expression} />
        </div>
      );
    case "file":
      const src_file =
        value.type === "external" ? value.external.url : value.file.url;
      const splitSourceArray = src_file.split("/");
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
      const caption_file = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure>
          <div className="flex items-center gap-2 rounded-md bg-blue-100 px-2 py-1">
            📎
            <Link href={src_file} passHref>
              <a className="font-medium underline">
                {lastElementInArray.split("?")[0]}
              </a>
            </Link>
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      );

    case "bookmark":
      const href = value.url;
      return (
        <a
          href={href}
          target="_brank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {href}
        </a>
      );
    case "table":
      return (
        <div className="overflow-x-auto my-8">
          <table className="min-w-full border-collapse border border-gray-300">
            <tbody>
              {value.children?.map((row, index) => (
                <tr key={row.id || index}>
                  {row.table_row?.cells?.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                      <Text text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "table_row":
      // Table rows are handled within the table case above
      return null;
    default:
      return `❌ Unsupported block (${type === "unsupported" ? "unsupported by Notion API" : type
        })`;
  }
};

export default function Post({ page, blocks }) {
  if (!page || !blocks) {
    return <div />;
  }
  let title = page.properties.title.title[0].plain_text;
  // let description = page.properties.Summary.rich_text[0].plain_text;
  let description = "123123";
  const tags = page.properties.tags?.multi_select || [];

  return (
    <>
      <Seo
        title={title}
        ogImageUrl={`${siteMetaData.siteUrl}/api/og?title=${encodeURIComponent(
          title
        )}`}
        description={description}
      />
      <div className="mx-auto my-5 max-w-5xl content-center px-3">
        <article className="container">
          <h1 className="edit">
            <Text text={page.properties.title.title} />
          </h1>
          {tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap">
                {tags.map((tag, index) => (
                  <Tag
                    key={index}
                    name={tag.name}
                    color={tag.color}
                  />
                ))}
              </div>
            </div>
          )}
          <section className="font-merriweather text-base font-normal">
            {blocks.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
          </section>
          <Link href="/">← Back to home</Link>
        </article>
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const database = await getDatabase(databaseId);
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const page = await getPage(id);
  const blocks = await getBlocks(id);

  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        };
      })
  );
  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children && !block[block.type].children) {
      block[block.type]["children"] = childBlocks.find(
        (x) => x.id === block.id
      )?.children;
    }
    return block;
  });

  return {
    props: {
      page,
      blocks: blocksWithChildren,
    },
    revalidate: 1,
  };
};
