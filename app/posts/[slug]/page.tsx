import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

import './page.css'

export default async function Post({ params }: Params) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.coverImage && (
        <AspectRatio ratio={16 / 9}>
          {/* <img src={post.coverImage} alt={post.title} className="mb-4 rounded-md object-cover max-w-full" /> */}
          <Image src={`https://raw.githubusercontent.com/AvishakeAdhikary/blog/refs/heads/main/public`+post.coverImage} alt={post.title} className="mb-8 rounded-md w-full h-auto" width={0} height={0} sizes="100vw"/>
        </AspectRatio>
      )}
      <div className="post-content mt-8" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title}`;

  return {
    title,
    openGraph: {
      title,
      images: post.ogImage ? [`https://raw.githubusercontent.com/AvishakeAdhikary/blog/refs/heads/main/public`+post.ogImage.url] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
