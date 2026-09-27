import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'
import { packagesApi, photographersApi, queryKeys } from '@/lib/endpoints'
import { requireRole } from '@/lib/guards'
import { getErrorMessage } from '@/lib/errors'
import { formatDuration, formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { TextArea, TextField } from '@/components/ui/TextField'
import { PageState, Skeleton } from '@/components/ui/States'

const photographerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(1),
  bio: z.string().optional(),
  specialties: z.string().optional(),
})

type PhotographerForm = z.infer<typeof photographerSchema>

const packageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  duration_minutes: z.coerce.number().int().positive('Duration must be positive'),
  image_url: z.string().url('A valid image URL is required'),
  description: z.string().optional(),
  photographer_id: z.string().optional(),
})

type PackageForm = z.infer<typeof packageSchema>

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context, location }) => requireRole({ context, location, roles: ['admin'] }),
  component: AdminDashboard,
})

function AdminDashboard() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'photographers' | 'packages'>('photographers')
  const photographers = useQuery({ queryKey: queryKeys.photographers, queryFn: photographersApi.list })
  const packages = useQuery({ queryKey: queryKeys.packages, queryFn: packagesApi.list })

  const photogForm = useForm<PhotographerForm>({
    defaultValues: { email: '', password: '', full_name: '', bio: '', specialties: '' },
  })

  const pkgForm = useForm<PackageForm>({
    defaultValues: {
      name: '',
      category: 'Weddings & Celebrations',
      price: 25000,
      duration_minutes: 120,
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552',
      description: '',
      photographer_id: '',
    },
  })

  const createPhotographer = useMutation({
    mutationFn: (values: PhotographerForm) =>
      photographersApi.create({
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        bio: values.bio || undefined,
        specialties: (values.specialties ?? '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.photographers })
      photogForm.reset()
    },
  })

  const createPackage = useMutation({
    mutationFn: async (values: PackageForm) => {
      const created = await packagesApi.create({
        name: values.name,
        category: values.category,
        price: values.price,
        duration_minutes: values.duration_minutes,
        image_url: values.image_url,
        description: values.description || undefined,
        photographer_ids: values.photographer_id ? [values.photographer_id] : [],
      })
      return created
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.packages })
      pkgForm.reset()
    },
  })

  return (
    <div className="mx-auto max-w-site px-5 py-16 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Administration</p>
      <h1 className="mt-2 font-display text-5xl">Studio overview</h1>
      <p className="mt-3 max-w-2xl text-mute">
        Manage studio photographers, offerings, and package assignments across the platform.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="border border-line bg-cream p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mute">Photographers</p>
          <p className="mt-2 font-display text-5xl">{photographers.data?.length ?? '—'}</p>
        </div>
        <div className="border border-line bg-cream p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mute">Packages</p>
          <p className="mt-2 font-display text-5xl">{packages.data?.length ?? '—'}</p>
        </div>
        <div className="border border-line bg-cream p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mute">Studio Mode</p>
          <p className="mt-2 font-display text-xl">Active & Operational</p>
          <p className="mt-1 text-xs text-mute">Timezone: Asia/Kolkata</p>
        </div>
      </div>

      <div className="mt-10 flex gap-2 border-b border-line pb-4">
        <button
          type="button"
          onClick={() => setTab('photographers')}
          className={`border px-5 py-2.5 text-xs uppercase tracking-[0.16em] transition ${
            tab === 'photographers' ? 'border-ink bg-ink text-cream' : 'border-line text-mute hover:text-ink'
          }`}
        >
          Photographers ({photographers.data?.length ?? 0})
        </button>
        <button
          type="button"
          onClick={() => setTab('packages')}
          className={`border px-5 py-2.5 text-xs uppercase tracking-[0.16em] transition ${
            tab === 'packages' ? 'border-ink bg-ink text-cream' : 'border-line text-mute hover:text-ink'
          }`}
        >
          Packages ({packages.data?.length ?? 0})
        </button>
      </div>

      {tab === 'photographers' ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <form
            className="space-y-4 border border-line bg-cream p-6"
            onSubmit={photogForm.handleSubmit((values) => {
              const parsed = photographerSchema.safeParse(values)
              if (!parsed.success) {
                parsed.error.issues.forEach((issue) => {
                  photogForm.setError(issue.path[0] as keyof PhotographerForm, { message: issue.message })
                })
                return
              }
              createPhotographer.mutate(parsed.data)
            })}
          >
            <h2 className="font-display text-3xl">Add photographer</h2>
            <TextField
              label="Full name"
              {...photogForm.register('full_name')}
              error={photogForm.formState.errors.full_name?.message}
            />
            <TextField
              label="Email"
              type="email"
              {...photogForm.register('email')}
              error={photogForm.formState.errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              hint="Minimum 8 characters"
              {...photogForm.register('password')}
              error={photogForm.formState.errors.password?.message}
            />
            <TextArea label="Bio" rows={4} {...photogForm.register('bio')} />
            <TextField
              label="Specialties"
              hint="Comma-separated, e.g. Weddings & Celebrations, Portraits & Headshots"
              {...photogForm.register('specialties')}
            />
            {createPhotographer.isError ? (
              <p className="text-sm text-red-800">{getErrorMessage(createPhotographer.error)}</p>
            ) : null}
            {createPhotographer.isSuccess ? <p className="text-sm text-emerald-800">Photographer created successfully.</p> : null}
            <Button type="submit" disabled={createPhotographer.isPending}>
              {createPhotographer.isPending ? 'Creating…' : 'Create photographer'}
            </Button>
          </form>

          <div>
            <h2 className="font-display text-3xl">Roster</h2>
            {photographers.isLoading ? (
              <Skeleton className="mt-4 h-48" />
            ) : photographers.isError ? (
              <PageState title="Something went wrong. Please try again." body="Could not load photographers." />
            ) : !photographers.data?.length ? (
              <p className="mt-4 text-sm text-mute">Nothing available yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line border border-line bg-cream">
                {photographers.data.map((p) => (
                  <li key={p.id} className="px-4 py-3">
                    <p className="font-medium">{p.full_name}</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-mute">
                      {p.specialties.join(' · ') || 'No specialties listed'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <form
            className="space-y-4 border border-line bg-cream p-6"
            onSubmit={pkgForm.handleSubmit((values) => {
              const parsed = packageSchema.safeParse(values)
              if (!parsed.success) {
                parsed.error.issues.forEach((issue) => {
                  pkgForm.setError(issue.path[0] as keyof PackageForm, { message: issue.message })
                })
                return
              }
              createPackage.mutate(parsed.data)
            })}
          >
            <h2 className="font-display text-3xl">Create & assign package</h2>
            <TextField label="Package name" {...pkgForm.register('name')} error={pkgForm.formState.errors.name?.message} />
            <TextField
              label="Category"
              hint="e.g. Weddings & Celebrations, Portraits & Headshots"
              {...pkgForm.register('category')}
              error={pkgForm.formState.errors.category?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Price (₹)"
                type="number"
                {...pkgForm.register('price', { valueAsNumber: true })}
                error={pkgForm.formState.errors.price?.message}
              />
              <TextField
                label="Duration (minutes)"
                type="number"
                {...pkgForm.register('duration_minutes', { valueAsNumber: true })}
                error={pkgForm.formState.errors.duration_minutes?.message}
              />
            </div>
            <TextField
              label="Cover image URL"
              {...pkgForm.register('image_url')}
              error={pkgForm.formState.errors.image_url?.message}
            />
            <label className="block space-y-1.5">
              <span className="text-xs uppercase tracking-[0.16em] text-mute">Assign to Photographer</span>
              <select
                className="w-full border border-line bg-cream px-3 py-2.5 text-sm"
                {...pkgForm.register('photographer_id')}
              >
                <option value="">-- Optional: Assign Photographer --</option>
                {photographers.data?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name}
                  </option>
                ))}
              </select>
            </label>
            <TextArea label="Description" rows={3} {...pkgForm.register('description')} />
            {createPackage.isError ? (
              <p className="text-sm text-red-800">{getErrorMessage(createPackage.error)}</p>
            ) : null}
            {createPackage.isSuccess ? <p className="text-sm text-emerald-800">Package created and assigned successfully.</p> : null}
            <Button type="submit" disabled={createPackage.isPending}>
              {createPackage.isPending ? 'Creating…' : 'Create & assign package'}
            </Button>
          </form>

          <div>
            <h2 className="font-display text-3xl">Active packages</h2>
            {packages.isLoading ? (
              <Skeleton className="mt-4 h-48" />
            ) : packages.isError ? (
              <PageState title="Something went wrong. Please try again." body="Could not load packages." />
            ) : !packages.data?.length ? (
              <p className="mt-4 text-sm text-mute">Nothing available yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line border border-line bg-cream">
                {packages.data.map((pkg) => (
                  <li key={pkg.id} className="flex items-center justify-between px-4 py-3.5 text-sm">
                    <div>
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-xs text-mute">
                        {pkg.category} · {formatDuration(pkg.duration_minutes)}
                      </p>
                    </div>
                    <span className="font-display text-base font-semibold">{formatPrice(pkg.price)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
