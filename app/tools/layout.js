import ToolsHeader from '@/app/components/ToolsHeader'

export const metadata = {
  title: 'Discover AI Tools',
  description: 'Browse 500+ curated AI tools for writing, design, video, code and productivity.',
  alternates: { canonical: '/tools' },
}

export default function ToolsLayout({ children }) {
  return (
    <>
      <ToolsHeader />
      {children}
    </>
  )
}