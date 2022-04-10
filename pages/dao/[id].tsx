import { ChevronLeftIcon } from '@heroicons/react/outline'
import request, { gql } from 'graphql-request'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiGlobe, FiTwitter } from 'react-icons/fi'
import { SiDiscord } from 'react-icons/si'
import useSWR from 'swr'
interface IDAO {
  name: string
  logo: string
  description: string
  mission: string
  website_url: string
  discord_url: string
  discord_user_count: number
  twitter_handle: string
  twitter_followrs_count: number
  token: {
    price_usd: string
    market_cap_usd: string
    holders_count: number
  }
  treasury_size: string
  num_proposals: number
  categories: [
    {
      name: string
    }
  ]
  tags: [
    {
      name: string
    }
  ]
}

const fetcher = (query: string, id: string) =>
  request('/api/graphql', query, { id })

export default function DAODetails() {
  const {
    query: { id = null },
  } = useRouter()

  const { data } = useSWR<{ dao: IDAO | null }>(
    [
      gql`
        query MyQuery($id: Int = 0) {
          dao: daos_by_pk(id: $id) {
            name
            logo
            description
            mission
            website_url
            discord_url
            discord_user_count
            twitter_handle
            twitter_followrs_count
            token {
              price_usd
              market_cap_usd
              holders_count
            }
            treasury_size
            num_proposals
            categories {
              name
            }
            tags {
              name
            }
          }
        }
      `,
      id,
    ],
    fetcher
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <Head>
        <title>Valaxy | {data?.dao?.name}</title>
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
      <nav
        className="flex items-start px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Breadcrumb"
      >
        <Link href="/">
          <a className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900">
            <ChevronLeftIcon
              className="-ml-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <span>Listing</span>
          </a>
        </Link>
      </nav>

      {data && data.dao && (
        <article className="bg-gray-100 pb-8">
          {/* Profile header */}
          <div>
            <div>
              <img
                className="h-32 w-full bg-gradient-to-r from-[#2563EB]  via-[#9333EA] to-[#E11D48] object-cover lg:h-48"
                // src={profile.coverImageUrl}
                alt=""
              />
            </div>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                <div className="flex">
                  <img
                    className="h-24 w-24 rounded-full bg-white ring-4 ring-white sm:h-32 sm:w-32"
                    src={data.dao.logo}
                    alt=""
                  />
                </div>
                <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                  <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                    <h1 className="truncate text-2xl font-bold text-gray-900">
                      {data.dao.name}
                    </h1>
                    <div>
                      {data.dao.categories.map((c, i) => (
                        <span
                          key={i}
                          className="mr-2 inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <a
                      type="button"
                      href={data.dao.discord_url}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      <SiDiscord
                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Discord</span>
                    </a>
                    <a
                      type="button"
                      href={`https://twitter.com/${data.dao.twitter_handle}`}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      <FiTwitter
                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Twitter</span>
                    </a>

                    <a
                      type="button"
                      href={data.dao.website_url}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      <FiGlobe
                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Website</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                <h1 className="truncate text-2xl font-bold text-gray-900">
                  {data.dao.name}
                </h1>
              </div>
            </div>
          </div>

          {/* Tabs */}
          {/* <Tab.Group>
          <div className="mt-6 sm:mt-2 2xl:mt-5">
            <div className="border-b border-gray-200">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Tab.List className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab, i) => (
                    <Tab key={i} as={Fragment}>
                      {({ selected }) => (
                        <button
                          className={classNames(
                            selected
                              ? "border-pink-500 text-gray-900"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                            "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                          )}
                          aria-current={selected ? "page" : undefined}
                        >
                          {tab.name}
                        </button>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>
            </div>
          </div>
          <Tab.Panels>
              <Tab.Panel>

              </Tab.Panel>
          </Tab.Panels>
        </Tab.Group> */}

          {/* <div className="mt-6 sm:mt-2 2xl:mt-5">
          <div className="border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      tab.current
                        ? "border-pink-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                      "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div> */}

          <div className="mx-auto mt-6 max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Information
            </h3>
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Mission
                </h3>
                <p className="mt-1 text-sm text-gray-500">{data.dao.mission}</p>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Description
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {data.dao.description}
                </p>
              </div>
              {/* <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      Margot Foster
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Application for
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      Backend Developer
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      margotfoster@example.com
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Salary expectation
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      $120,000
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">About</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      Fugiat ipsum ipsum deserunt culpa aute sint do nostrud
                      anim incididunt cillum culpa consequat. Excepteur qui
                      ipsum aliquip consequat sint. Sit id mollit nulla mollit
                      nostrud in ea officia proident. Irure nostrud pariatur
                      mollit ad adipisicing reprehenderit deserunt qui eu.
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Attachments
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <ul
                        role="list"
                        className="divide-y divide-gray-200 rounded-md border border-gray-200"
                      >
                        <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="ml-2 w-0 flex-1 truncate">
                              resume_back_end_developer.pdf
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <a
                              href="#"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Download
                            </a>
                          </div>
                        </li>
                        <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="ml-2 w-0 flex-1 truncate">
                              coverletter_back_end_developer.pdf
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <a
                              href="#"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Download
                            </a>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div> */}
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-5xl px-4 lg:px-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              DAO Stats
            </h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Discord Users
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {data.dao.discord_user_count}
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Number of Proposals
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {data.dao.num_proposals}
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Twitter Followers
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {data.dao.twitter_followrs_count}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mx-auto mt-6 max-w-5xl px-4 lg:px-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Token Stats
            </h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Price
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {data.dao.token.price_usd}
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Market Cap
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {data.dao.token.market_cap_usd}
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  Token Holders
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {data.dao.token.holders_count}
                </dd>
              </div>
            </dl>
          </div>

          {/* Description list */}
          {/* <div className="mx-auto mt-6 max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Mission</dt>
              <dd
                className="mt-1 space-y-5 text-sm text-gray-900"
                dangerouslySetInnerHTML={{ __html: data.dao.mission }}
              />
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd
                className="mt-1 space-y-5 text-sm text-gray-900"
                dangerouslySetInnerHTML={{ __html: data.dao.description }}
              />
            </div>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              {Object.keys(profile.fields).map((field) => (
                <div key={field} className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">{field}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.fields[field]}
                  </dd>
                </div>
              ))}
            </dl>
          </div> */}
        </article>
      )}
    </div>
  )
}
