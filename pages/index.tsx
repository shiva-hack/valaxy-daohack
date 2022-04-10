import { Fragment, useState } from 'react'
import type { NextPage } from 'next'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { ChevronDownIcon, PlusSmIcon } from '@heroicons/react/solid'
import { SiDiscord } from 'react-icons/si'
import Link from 'next/link'
import { classNames } from '../components/utils'

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

const Home: NextPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [filters] = useState<IFilter[]>([
    {
      id: 'category',
      name: 'Category',
      options: [
        { value: 'white', label: 'White' },
        { value: 'beige', label: 'Beige' },
        { value: 'blue', label: 'Blue' },
        { value: 'brown', label: 'Brown' },
        { value: 'green', label: 'Green' },
        { value: 'purple', label: 'Purple' },
      ],
    },
  ])
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter>({
    category: [],
    network: [],
    tag: [],
  })

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
  }

  if (!filters || !filters.length) return null

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <div>{JSON.stringify(filters, null, 2)}</div>
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
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
                {Array(12)
                  .fill('')
                  .map((v, i) => (
                    <Link key={i} href={`/dao/${i}`}>
                      <a className="flex flex-col space-y-4 rounded-md bg-white p-4 shadow-md transition-all ease-in-out hover:-translate-y-2">
                        <div className="flex items-center space-x-4">
                          <figure className="h-20 w-20 rounded-md bg-gray-300"></figure>
                          <div className="flex flex-grow flex-col space-y-1">
                            <p className="text-lg font-bold">DAO Name</p>
                            <p className="text-sm text-gray-500">$20,000</p>
                            <p className="flex items-center space-x-1 text-xs">
                              <SiDiscord className="h-4 w-4" />
                              <span>22K</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-md text-justify text-gray-500">
                          Flowbite is a library of interactive UI components
                          built with Tailwind CSS that can get you started
                          building websites faster and more efficiently.
                        </div>
                        <div className="">
                          <span className="mr-2 inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                            Badge
                          </span>
                          <span className="mr-2 mb-2 inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            Badge
                          </span>
                          <span className="mr-2 mb-2 inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                            Badge
                          </span>
                          <span className="mr-2 mb-2 inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            Badge
                          </span>
                          <span className="mr-2 mb-2 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            Badge
                          </span>
                          {/* <span className="inline-flex mr-2 mb-2 items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          Badge
                        </span>
                        <span className="inline-flex mr-2 mb-2 items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Badge
                        </span> */}
                          <span className="mr-2 mb-2 inline-flex items-center rounded bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800">
                            Badge
                          </span>
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
