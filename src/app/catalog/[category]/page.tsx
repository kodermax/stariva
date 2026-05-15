import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/stariva/footer";
import { Header } from "@/components/stariva/header";
import { categories, getProductsByCategory } from "@/lib/ozon-service";
import { getCategoryBySlug } from "@/lib/products";
import CategoryFilters from "./category-filters";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(categorySlug);

  return (
    <>
      <Header variant="solid" />
      <main className="min-h-screen bg-parchment">
        {/* ── Category Hero ── */}
        <section className="relative overflow-hidden bg-espresso">
          <div className="absolute inset-0">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover opacity-40"
              priority
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-5 lg:px-12 pt-32 pb-16 lg:pt-40 lg:pb-20">
            {/* Breadcrumb */}
            <nav
              className="flex items-center gap-2 text-sm text-white/50 mb-8"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-white/80 transition-colors">
                Главная
              </Link>
              <span>/</span>
              <Link
                href="/catalog"
                className="hover:text-white/80 transition-colors"
              >
                Каталог
              </Link>
              <span>/</span>
              <span className="text-white/80">{category.name}</span>
            </nav>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <span className="label-caps text-linen/70 mb-3 block">
                  {products.length} товаров
                </span>
                <h1 className="font-serif text-5xl lg:text-7xl text-white leading-[1.0] tracking-tight">
                  {category.name}
                </h1>
                <p className="text-white/60 mt-4 max-w-md text-base leading-relaxed">
                  {category.description}
                </p>
              </div>
              {/* Sub-category quick links */}
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((sub) => (
                  <span
                    key={sub.slug}
                    className="px-4 py-2 rounded-full border border-white/20 text-white/60 label-caps text-[11px]"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Products with Filters ── */}
        <CategoryFilters
          products={products}
          category={category}
          categorySlug={categorySlug}
        />

        {/* ── Other Categories ── */}
        <section className="pb-24 px-5 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="font-serif text-2xl lg:text-3xl text-espresso mb-8">
              Другие направления
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {categories
                .filter((c) => c.slug !== categorySlug)
                .map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/catalog/${cat.slug}`}
                    className="group relative overflow-hidden rounded-xl bg-sand hover:bg-espresso transition-colors duration-300"
                  >
                    <div className="flex items-center gap-5 p-5">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-espresso group-hover:text-parchment transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-taupe group-hover:text-parchment/60 text-sm line-clamp-1 transition-colors mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        className="ml-auto flex-shrink-0 text-espresso/20 group-hover:text-parchment/40 transition-colors"
                      >
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
