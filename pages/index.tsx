import { Fragment, useState } from 'react'
import type { NextPage } from 'next'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { ChevronDownIcon, PlusSmIcon, UsersIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { classNames } from '../components/utils'
import request, { gql } from 'graphql-request'
import useSWR from 'swr'
import Head from 'next/head'

interface IFilterOption {
  value: string
  label: string
}
interface IFilter {
  id: 'category' | 'network' | 'tag'
  name: string
  options: IFilterOption[]
}

interface ISelectedFilter {
  category: string[]
  network: string[]
  tag: string[]
}

interface ICategory {
  id: number
  name: string
}

export interface IDAO {
  id: number
  description: string
  name: string
  logo: string
  treasury_size: string
  token: {
    holders_count: number
  }
  categories: ICategory[]
}

const fetcher = (query: string, categories: string[]) =>
  request('/api/graphql', query, {
    name: categories.length ? { _in: categories } : {},
  })

const Home: NextPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false)

  const [filters] = useState<IFilter[]>([
    {
      id: 'category',
      name: 'Category',
      options: [
        { value: 'protocol', label: 'Protocol' },
        { value: 'grant', label: 'Grant' },
        { value: 'defi', label: 'Defi' },
        { value: 'social', label: 'Social' },
        { value: 'game', label: 'Game' },
        { value: 'investment', label: 'Investment' },
        { value: 'product', label: 'Product' },
        { value: 'nft', label: 'NFT' },
        { value: 'service', label: 'Service' },
        { value: 'collector', label: 'Collector' },
        { value: 'creator', label: 'Creator' },
        { value: 'media', label: 'Media' },
      ],
    },
  ])
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter>({
    category: [],
    network: [],
    tag: [],
  })

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const { data } = useSWR(
    [
      gql`
        query ListOfDAOs($name: String_comparison_exp = {}) {
          daos(where: { categories: { name: $name } }) {
            logo
            name
            treasury_size
            token {
              holders_count
            }
            description
            id
            categories {
              name
            }
          }
        }
      `,
      selectedCategories,
    ],
    fetcher
  )

  const handleChange = (
    sectionId: 'category' | 'network' | 'tag',
    value: string,
    checked: boolean
  ) => {
    const newItems = [...(selectedFilters[sectionId] || [])]
    const itemIndex = newItems.indexOf(value)
    const exists = itemIndex > -1

    if (checked && exists) return

    if (!checked && !exists) return

    if (checked && !exists) {
      newItems.push(value)
    }

    if (!checked && exists) {
      newItems.splice(itemIndex, 1)
    }

    setSelectedFilters({ ...selectedFilters, [sectionId]: newItems })

    if (sectionId === 'category') {
      setSelectedCategories(newItems)
    }
  }

  if (!filters || !filters.length) return null

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Head>
        <title>Valaxy</title>
      </Head>
      <div className="flex items-center justify-between bg-white py-4 px-8 shadow-md">
        <h1>
          <img src="/logo.png" className="w-32" />
        </h1>
        <div className="space-x-4">
          <a href="https://twitter.com/valaxyio">Twitter</a>
          <a href="https://www.instagram.com/valaxyio/">Instagram</a>
        </div>
      </div>
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} appear={true} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-40 flex lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4">
                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.name}
                      className="border-t border-gray-200 pt-4 pb-4"
                    >
                      {({ open }) => (
                        <fieldset>
                          <legend className="w-full px-2">
                            <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                              <span className="text-sm font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex h-7 items-center">
                                <ChevronDownIcon
                                  className={classNames(
                                    open ? '-rotate-180' : 'rotate-0',
                                    'h-5 w-5 transform'
                                  )}
                                  aria-hidden="true"
                                />
                              </span>
                            </Disclosure.Button>
                          </legend>
                          <Disclosure.Panel className="px-4 pt-4 pb-2">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`${section.id}-${optionIdx}-mobile`}
                                    name={`${section.id}[]`}
                                    // defaultValue={option.value}
                                    type="checkbox"
                                    checked={
                                      selectedFilters[section.id].indexOf(
                                        option.value
                                      ) > -1
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        section.id,
                                        option.value,
                                        e.target.checked
                                      )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`${section.id}-${optionIdx}-mobile`}
                                    className="ml-3 text-sm text-gray-500"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </fieldset>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>

        <main className="py-16 px-4 sm:py-12 sm:px-6 lg:px-8">
          <div className="w-full border-b border-gray-200 pb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              List of DAOs
            </h1>
            <p className="mt-4 text-base text-gray-500">
              Checkout out the latest list of DAOs, new and improved!
            </p>
          </div>

          <div className="w-full pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            <aside>
              <h2 className="sr-only">Filters</h2>

              <button
                type="button"
                className="inline-flex items-center lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="text-sm font-medium text-gray-700">
                  Filters
                </span>
                <PlusSmIcon
                  className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              </button>

              <div className="hidden lg:block">
                <form className="space-y-10 divide-y divide-gray-200">
                  {filters.map((section, sectionIdx) => (
                    <div
                      key={section.name}
                      className={sectionIdx === 0 ? '' : 'pt-10'}
                    >
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-900">
                          {section.name}
                        </legend>
                        <div className="space-y-3 pt-6">
                          {section.options.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                // defaultValue={option.value}
                                type="checkbox"
                                checked={
                                  selectedFilters[section.id].indexOf(
                                    option.value
                                  ) > -1
                                }
                                onChange={(e) =>
                                  handleChange(
                                    section.id,
                                    option.value,
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`${section.id}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  ))}
                </form>
              </div>
            </aside>

            {/* Product grid */}
            <div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
              {/* Replace with your content */}
              {/* <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 lg:h-full" /> */}
              {/* /End replace */}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data &&
                  data.daos.map((dao: IDAO, i: number) => (
                    <Link key={i} href={`/dao/${dao.id}`}>
                      <a className="flex flex-col justify-between space-y-4 rounded-md bg-white p-4 shadow-md transition-all ease-in-out hover:-translate-y-2">
                        <div className="flex items-center space-x-4">
                          <figure className="h-20 w-20 overflow-hidden rounded-full">
                            <img src={dao.logo} className="" />
                          </figure>
                          <div className="flex flex-grow flex-col space-y-1">
                            <p className="text-lg font-bold">{dao.name}</p>
                            <p className="text-sm text-gray-500">
                              {dao.treasury_size}
                            </p>
                            <p className="flex items-center space-x-1 text-xs">
                              <UsersIcon className="h-4 w-4" />
                              <span>{dao.token.holders_count}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-md text-justify text-gray-500">
                          {dao.description}
                        </div>
                        <div className="">
                          {dao.categories.map((cat, i) => (
                            <span
                              key={i}
                              className="mr-2 inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800"
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      </a>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home
