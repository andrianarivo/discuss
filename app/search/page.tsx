import {redirect} from 'next/navigation'
import PostList from '@/components/posts/post-list'
import {fetchPostsBySearchTerm} from '@/db/queries/posts'

interface SearchPageProps {
  searchParams: {
    term: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { term } = searchParams

  if(!term) {
    redirect('/')
  }

  return <div>
    <h1>Search Results for {term}</h1>
    <PostList fetchData={() => fetchPostsBySearchTerm(term)} />
  </div>
}