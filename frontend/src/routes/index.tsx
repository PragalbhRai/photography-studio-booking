import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { packagesApi, photographersApi, queryKeys } from '@/lib/endpoints'
import { IMAGES } from '@/lib/images'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { PackageCard } from '@/components/packages/PackageCard'
import { PhotographerCard } from '@/components/photographers/PhotographerCard'
import { Skeleton } from '@/components/ui/States'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const SPECIALTIES = [
  {
    name: 'Weddings & Celebrations',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a',
    description: 'Palace ceremonies, Varmala rituals & receptions',
  },
  {
    name: 'Pre-Wedding & Engagement',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2',
    description: 'Cinematic heritage fort & dunes storytelling',
  },
  {
    name: 'Portraits & Headshots',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    description: 'Founders, leaders & creative personal branding',
  },
  {
    name: 'Fashion & Editorial',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae',
    description: 'Haute-couture, handlooms & designer lookbooks',
  },
  {
    name: 'Maternity & Newborn',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9',
    description: 'Tender fine-art motherhood & newborn sittings',
  },
  {
    name: 'Events & Corporate',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    description: 'Technology summits, awards & cultural galas',
  },
  {
    name: 'Product & Brand',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    description: 'Fine jewelry, luxury retail & crafted goods',
  },
  {
    name: 'Travel & Lifestyle',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
    description: 'Heritage architecture, backwaters & living culture',
  },
]

const TESTIMONIALS = [
  {
    quote: 'Aarav captured our palace wedding in Udaipur with such grace and cinematic emotion. Every moment under the mandap feels like a royal heirloom.',
    author: 'Pooja & Karan Malhotra',
    service: 'Royal Wedding Photography',
  },
  {
    quote: 'Ananya made my founder headshot session effortless. Clean studio lighting and exceptional guidance that elevated our corporate profile.',
    author: 'Aditya Verma',
    service: 'Leadership & Personal Branding',
  },
  {
    quote: "Priya's editorial eye brought our festive handloom collection to life. The textures, drape, and jewel tones were captured to perfection.",
    author: 'Tarun Rawat, Rawat Couture',
    service: 'Fashion & Campaign Editorial',
  },
  {
    quote: 'Meera made our maternity and newborn session so gentle and serene. We will treasure these portraits for generations.',
    author: 'The Sharma Family',
    service: 'Fine Art Maternity & Newborn',
  },
]

function HomePage() {
  const packagesQuery = useQuery({ queryKey: queryKeys.packages, queryFn: packagesApi.list })
  const photographersQuery = useQuery({
    queryKey: queryKeys.photographers,
    queryFn: photographersApi.list,
  })

  const packages = packagesQuery.data?.slice(0, 6) ?? []
  const photographers = photographersQuery.data?.slice(0, 4) ?? []

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <Photo
            src={IMAGES.hero}
            alt="Editorial photograph of Indian wedding couple"
            className="h-full w-full object-cover object-[center_25%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/20" />
        </div>
        <div className="relative mx-auto flex min-h-[88vh] max-w-site flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-24">
          <p className="text-[11px] uppercase tracking-[0.28em] text-cream/90 font-medium">Premium photography studio</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] text-cream sm:text-7xl md:text-8xl">
            Photographs made to be remembered.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/90 md:text-lg">
            Editorial portraits, intimate celebrations, bold campaigns, and everything in between. 
            Specialist photographers, guided shoots, curated imagery.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/book">
              <Button size="lg" variant="white">
                Book a Session
              </Button>
            </Link>
            <Link to="/packages">
              <Button size="lg" variant="outline-white">
                Explore Our Work
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What We Photograph */}
      <section className="mx-auto max-w-site px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="text-[11px] uppercase tracking-[0.22em] text-brass">What we photograph</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Every story deserves to be told.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-mute">
              From wedding ceremonies to brand campaigns, maternity sessions to editorial fashion—we specialize in capturing what matters to you with editorial quality and authentic direction.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {SPECIALTIES.map((specialty) => (
            <Link
              key={specialty.name}
              to="/packages"
              className="group relative aspect-[3/4] overflow-hidden border border-line bg-paper transition hover:border-ink"
            >
              <Photo src={specialty.image} alt={specialty.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent opacity-80 transition group-hover:opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-display text-lg text-cream md:text-xl">{specialty.name}</h3>
                <p className="mt-1 text-xs text-cream/70">{specialty.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-ink py-20 text-cream md:py-28">
        <div className="mx-auto max-w-site px-5 md:px-8">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Why choose us</p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl">The way we work</h2>
            </div>
          </Reveal>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-cream/20 bg-cream/5">
                <span className="font-display text-2xl text-brass">01</span>
              </div>
              <h3 className="font-display text-xl">Specialist photographers</h3>
              <p className="mt-2 text-sm text-cream/70">
                Each photographer brings deep expertise in their specialty—from fashion editorial to newborn portraiture. You work with someone who truly understands your needs.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-cream/20 bg-cream/5">
                <span className="font-display text-2xl text-brass">02</span>
              </div>
              <h3 className="font-display text-xl">Guided, never forced</h3>
              <p className="mt-2 text-sm text-cream/70">
                We create comfortable environments where authentic moments happen naturally. Professional direction without awkward posing or manufactured emotion.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-cream/20 bg-cream/5">
                <span className="font-display text-2xl text-brass">03</span>
              </div>
              <h3 className="font-display text-xl">Curated, not dumped</h3>
              <p className="mt-2 text-sm text-cream/70">
                Every image is professionally edited and sequenced. You receive a finished collection you can actually use—not hundreds of unedited files to sort through.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section id="work" className="mx-auto max-w-site px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="mb-10 text-center">
            <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Portfolio</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Recent work</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          {IMAGES.featured.map((item) => (
            <figure key={item.src} className={`img-zoom ${item.className}`}>
              <Photo src={item.src} alt={item.alt} />
            </figure>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="bg-cream/60 py-20 md:py-28">
        <div className="mx-auto max-w-site px-5 md:px-8">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Choose your session</p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl">Photography packages</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-mute">
                Transparent pricing, clear deliverables, flexible scheduling. Every package includes professional editing and digital delivery.
              </p>
            </div>
          </Reveal>
          {packagesQuery.isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[520px]" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <p className="text-center text-mute">Packages coming soon.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <Link to="/packages" className="text-xs uppercase tracking-[0.18em] underline decoration-line underline-offset-8 hover:decoration-ink">
              View all packages
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-site px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="text-[11px] uppercase tracking-[0.22em] text-brass">The experience</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">How it works</h2>
          </div>
        </Reveal>
        <div className="grid gap-12 md:grid-cols-4 md:gap-8">
          <div>
            <div className="mb-4 text-5xl font-light text-brass">01</div>
            <h3 className="font-display text-xl">Choose your session</h3>
            <p className="mt-2 text-sm text-mute">
              Browse our packages and find the perfect fit for your needs—wedding, portrait, fashion, maternity, or any specialty.
            </p>
          </div>
          <div>
            <div className="mb-4 text-5xl font-light text-brass">02</div>
            <h3 className="font-display text-xl">Pick your photographer</h3>
            <p className="mt-2 text-sm text-mute">
              Select from our team of specialists. Each brings unique expertise and a distinct creative vision.
            </p>
          </div>
          <div>
            <div className="mb-4 text-5xl font-light text-brass">03</div>
            <h3 className="font-display text-xl">Plan and shoot</h3>
            <p className="mt-2 text-sm text-mute">
              We'll discuss your vision, scout locations if needed, and create a comfortable shooting experience guided by professionals.
            </p>
          </div>
          <div>
            <div className="mb-4 text-5xl font-light text-brass">04</div>
            <h3 className="font-display text-xl">Receive your photos</h3>
            <p className="mt-2 text-sm text-mute">
              Professionally edited, carefully curated images delivered in a private online gallery—ready to share, print, and treasure.
            </p>
          </div>
        </div>
      </section>

      {/* Photographers */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-site px-5 md:px-8">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Meet the team</p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl">Our photographers</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-mute">
                A collective of award-winning photographers, each bringing years of experience and a passion for their craft.
              </p>
            </div>
          </Reveal>
          {photographersQuery.isLoading ? (
            <div className="grid gap-10 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-[3/4]" />
              ))}
            </div>
          ) : photographers.length === 0 ? (
            <p className="text-center text-mute">Photographers coming soon.</p>
          ) : (
            <div className="grid gap-10 md:grid-cols-4">
              {photographers.map((p) => (
                <PhotographerCard key={p.id} photographer={p} />
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <Link to="/photographers" className="text-xs uppercase tracking-[0.18em] underline decoration-line underline-offset-8 hover:decoration-ink">
              View all photographers
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-site px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Client experiences</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">What people say</h2>
            <p className="mt-2 text-xs text-mute">(Demo testimonials for hackathon presentation)</p>
          </div>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div key={idx} className="border border-line bg-paper p-8">
              <p className="text-sm italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em]">{testimonial.author}</p>
                <p className="mt-1 text-xs text-mute">{testimonial.service}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About/Studio Experience */}
      <section className="grid md:grid-cols-2">
        <div className="min-h-[420px]">
          <Photo src={IMAGES.about} alt="Inside the photography studio" />
        </div>
        <div className="flex flex-col justify-center bg-ink px-8 py-16 text-cream md:px-16">
          <p className="text-[11px] uppercase tracking-[0.22em] text-brass">The studio</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">A calm, creative space</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/75">
            We believe great photography happens in comfortable environments. Whether shooting in our natural-light studio, 
            on location, or at your chosen venue, we create calm, unhurried sessions where authenticity emerges naturally.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
            No overwhelming equipment, no forced directions—just thoughtful guidance, professional expertise, 
            and photographs that feel like you.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative min-h-[60vh] overflow-hidden">
        <Photo src={IMAGES.cta} alt="Couple walking at dusk" className="h-full w-full" />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <h2 className="font-display text-4xl text-cream md:text-6xl">Have something worth remembering?</h2>
          <p className="mt-4 max-w-lg text-base text-cream/80">
            Whether it's a celebration, a milestone, a campaign, or simply a moment you want captured beautifully—let's create something extraordinary together.
          </p>
          <Link to="/book" className="mt-10">
            <Button size="lg" className="bg-cream text-ink hover:bg-white">
              Book Your Session
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
