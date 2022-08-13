import Header from '@/components/Header';
import SearchBlogs from '@/components/Search/Blogs';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <SearchBlogs />
      {children}
    </>
  )
}

export default Layout;
