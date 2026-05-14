"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { blogPosts, formatDate } from "@/lib/blog-data"
import { Header } from "@/components/stariva/header"
import { Footer } from "@/components/stariva/footer"

export default function BlogPage() {
  const featuredPost = blogPosts[0]
  const otherPosts = blogPosts.slice(1)

  return (
    <>
      <Header variant="solid" />
      <main className="pt-24 lg:pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="label-caps text-terracotta mb-4 block">Блог Stariva</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-espresso mb-6 text-balance">
              Истории о ремесле, уюте и осознанной жизни
            </h1>
            <p className="text-taupe max-w-2xl mx-auto text-lg leading-relaxed">
              Делимся вдохновением, советами по уходу за изделиями и историями о том, как ручная работа
              меняет пространство вокруг нас.
            </p>
          </motion.div>

          {/* Featured Post */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="relative aspect-[4/3] lg:aspect-[3/2] overflow-hidden rounded-lg">
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-espresso/10 group-hover:bg-espresso/0 transition-colors duration-500" />
                </div>
                <div className="lg:py-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="label-caps text-terracotta">{featuredPost.category}</span>
                    <span className="w-1 h-1 rounded-full bg-taupe/50" />
                    <span className="label-caps text-taupe">{featuredPost.readTime}</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-espresso mb-4 group-hover:text-terracotta transition-colors text-balance">
                    {featuredPost.title}
                  </h2>
                  <p className="text-taupe leading-relaxed mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <time className="text-sm text-taupe">{formatDate(featuredPost.date)}</time>
                    <span className="label-caps-md text-terracotta group-hover:underline underline-offset-4">
                      Читать статью
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        </section>

        {/* Divider */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-16 lg:mb-24">
          <div className="h-px bg-espresso/10" />
        </div>

        {/* Posts Grid */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-serif text-2xl lg:text-3xl text-espresso mb-10"
          >
            Все статьи
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {otherPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-5">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-espresso/10 group-hover:bg-espresso/0 transition-colors duration-500" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="label-caps text-terracotta">{post.category}</span>
                    <span className="w-1 h-1 rounded-full bg-taupe/50" />
                    <span className="label-caps text-taupe">{post.readTime}</span>
                  </div>
                  <h3 className="font-serif text-xl lg:text-2xl text-espresso mb-3 group-hover:text-terracotta transition-colors text-balance">
                    {post.title}
                  </h3>
                  <p className="text-taupe text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <time className="text-sm text-taupe/70">{formatDate(post.date)}</time>
                </Link>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-10 mt-20 lg:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-sand rounded-2xl p-8 lg:p-12 text-center"
          >
            <h2 className="font-serif text-2xl lg:text-3xl text-espresso mb-4">
              Подпишитесь на наши истории
            </h2>
            <p className="text-taupe max-w-lg mx-auto mb-8">
              Раз в месяц присылаем новые статьи, вдохновение и закулисье мастерской. Без спама,
              только тёплые письма.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-5 py-3 rounded-full border border-espresso/15 bg-parchment text-espresso placeholder:text-taupe/60 focus:outline-none focus:border-terracotta transition-colors"
              />
              <button
                type="submit"
                className="label-caps-md px-6 py-3 rounded-full bg-espresso text-parchment hover:bg-terracotta transition-colors"
              >
                Подписаться
              </button>
            </form>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  )
}
