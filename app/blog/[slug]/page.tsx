"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "motion/react";
import { getPostBySlug, formatDate, blogPosts } from "@/lib/blog-data";
import { Header } from "@/components/stariva/header";
import { Footer } from "@/components/stariva/footer";

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Find related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <Header variant="solid" />
      <main className="pt-24 lg:pt-32 pb-20">
        {/* Back Link */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-taupe hover:text-terracotta transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="label-caps-md">Назад к блогу</span>
            </Link>
          </motion.div>
        </div>

        {/* Article Header */}
        <article className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="label-caps text-terracotta">
                {post.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-taupe/50" />
              <span className="label-caps text-taupe">{post.readTime}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-espresso mb-6 text-balance">
              {post.title}
            </h1>
            <p className="text-taupe text-lg leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <time className="text-sm text-taupe/70">
              {formatDate(post.date)}
            </time>
          </motion.header>

          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-[21/9] lg:aspect-[2.5/1] overflow-hidden rounded-xl mb-16"
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1400px) 100vw, 1400px"
              priority
            />
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            {post.content.map((block, index) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <p
                      key={index}
                      className="text-espresso/90 leading-relaxed text-lg mb-6"
                    >
                      {block.text}
                    </p>
                  );
                case "heading":
                  return (
                    <h2
                      key={index}
                      className="font-serif text-2xl lg:text-3xl text-espresso mt-12 mb-6"
                    >
                      {block.text}
                    </h2>
                  );
                case "image":
                  return (
                    <figure key={index} className="my-12">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image
                          src={block.src!}
                          alt={block.alt!}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 672px"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="text-center text-sm text-taupe mt-4">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                case "quote":
                  return (
                    <blockquote
                      key={index}
                      className="my-12 pl-6 border-l-2 border-terracotta"
                    >
                      <p className="font-serif text-xl lg:text-2xl text-espresso italic leading-relaxed">
                        {block.text}
                      </p>
                    </blockquote>
                  );
                default:
                  return null;
              }
            })}
          </motion.div>

          {/* Author / CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto mt-16 pt-12 border-t border-espresso/10"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 bg-sand rounded-xl p-6 lg:p-8">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                <Image
                  src="/images/craftswoman.jpg"
                  alt="Мастер Stariva"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <p className="label-caps text-terracotta mb-2">Автор</p>
                <p className="font-serif text-xl text-espresso mb-1">
                  Мастерская Stariva
                </p>
                <p className="text-taupe text-sm">
                  Создаём уют руками с 2018 года. Каждое изделие — с любовью и
                  вниманием к деталям.
                </p>
              </div>
            </div>
          </motion.div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-[1400px] mx-auto px-6 lg:px-10 mt-20 lg:mt-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-2xl lg:text-3xl text-espresso mb-10 text-center">
                Читайте также
              </h2>
              <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-5">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <div className="absolute inset-0 bg-espresso/10 group-hover:bg-espresso/0 transition-colors duration-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="label-caps text-terracotta">
                        {relatedPost.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-taupe/50" />
                      <span className="label-caps text-taupe">
                        {relatedPost.readTime}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-espresso group-hover:text-terracotta transition-colors text-balance">
                      {relatedPost.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* Back to Blog */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mt-16 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 label-caps-md px-6 py-3 rounded-full border border-espresso text-espresso hover:bg-espresso hover:text-parchment transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Все статьи блога
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
